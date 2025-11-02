"use client";
import { create } from "zustand";
import { NodeInfo } from "./ClusterStore";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// export type ClusterWSMessage = WSMessage<Payload>;
export type LiveWSMessage = WSMessage<MetricPayload> | WSMessage<LogPayload>;

interface WSMessage<T> {
	channel: string;
	payload: T;
}

export type MessageType = "metric" | "log" | "system";

export interface MetricPayload {
	type: "metric";
	timestamp: string;
	nodes: NodeInfo[];
	cpuUsage: number;
	memoryUsage: number;
}

export interface LogPayload {
	type: "log";
	timestamp: string;
	level: "INFO" | "WARN" | "ERROR";
	message: string;
}

export interface ControlPayload {
	action: "subscribe" | "unsubscribe";
	channel?: string;
}

interface LatencyPayload {
	action: "ping" | "pong";
}

export type Payload =
	| MetricPayload
	| LogPayload
	| ControlPayload
	| LatencyPayload;

interface WebSocketState {
	socket: WebSocket | null;
	channels: Record<string, ((msg: WSMessage<Payload>) => void)[]>;
	isConnected: boolean;
	latency: number | null;
	connect: () => void;
	disconnect: () => void;
	send: (msg: WSMessage<Payload>) => void;
	subscribe: (
		channel: string,
		handler: (msg: WSMessage<Payload>) => void
	) => void;
	unsubscribe: (
		channel: string,
		handler: (msg: WSMessage<Payload>) => void
	) => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
	socket: null,
	channels: {},
	isConnected: false,
	latency: null,

	connect: () => {
		if (get().socket) return;
		
		const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
		const wsUrl = API_BASE
			? `ws://${API_BASE.replace(/^https?:\/\//, "")}/ws`
			: `${wsProtocol}://${window.location.host}/api/ws`;

		const ws = new WebSocket(wsUrl);

		let pingTimer: NodeJS.Timeout | null = null;
		let lastPingTime: number | null = null;

		ws.onopen = () => {
			set({ isConnected: true });

			pingTimer = setInterval(() => {
				lastPingTime = Date.now();
				get().send({
					channel: "latency",
					payload: {
						action: "ping",
					},
				} as WSMessage<LatencyPayload>);
			}, 5000);
		};

		ws.onmessage = (event) => {
			const msg: WSMessage<LatencyPayload> = JSON.parse(event.data);

			if (
				msg.channel === "latency" &&
				msg.payload.action === "pong" &&
				lastPingTime
			) {
				const latency = Date.now() - lastPingTime;
				set({ latency });
				return;
			}

			const handlers = get().channels[msg.channel] || [];
			handlers.forEach((h) => h(msg));
		};

		ws.onclose = () => {
			set({ socket: null, isConnected: false, latency: null });
			setTimeout(() => get().connect(), 2000);
		};

		set({ socket: ws });
	},

	disconnect: () => {
		get().socket?.close();
		set({ socket: null, isConnected: false, latency: null });
	},

	send: (msg: WSMessage<Payload>) => {
		const socket = get().socket;
		if (!socket || socket.readyState !== WebSocket.OPEN) {
			console.warn("WebSocket not open. Message skipped:", msg);
			return;
		}

		socket.send(JSON.stringify(msg));
	},

	subscribe: (channel, handler) => {
		set((state) => {
			const handlers = state.channels[channel] || [];
			return {
				channels: { ...state.channels, [channel]: [...handlers, handler] },
			};
		});

		get().send({
			channel: "control",
			payload: {
				action: "subscribe",
				channel,
			} as ControlPayload,
		});
	},

	unsubscribe: (channel, handler) => {
		set((state) => {
			const handlers = state.channels[channel] || [];
			return {
				channels: {
					...state.channels,
					[channel]: handlers.filter((h) => h !== handler),
				},
			};
		});

		get().send({
			channel: "control",
			payload: {
				action: "unsubscribe",
				channel,
			} as ControlPayload,
		});
	},
}));
