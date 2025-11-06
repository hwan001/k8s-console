import { create } from "zustand";
import type { NodeInfo } from "./ClusterStore";
import { LiveWSMessage, LogPayload, MetricPayload, useWebSocketStore } from "./WebSocketStore";

interface LiveClusterState {
  [clusterId: string]: NodeInfo[];
}

interface LogMap {
  [clusterId: string]: string[];
}

interface ClusterLiveStore {
  metric: LiveClusterState;
  log: LogMap;
  lastUpdate: Record<string, number>;
  agentStatus: Record<string, "online" | "offline">;
  subscribeCluster: (clusterId: string) => void;
  unsubscribeCluster: (clusterId: string) => void;
}

// interval 관리용 맵
const clusterIntervals: Record<string, NodeJS.Timeout> = {};

export const useClusterLiveStore = create<ClusterLiveStore>((set, get) => ({
  metric: {},
  log: {},
  lastUpdate: {},
  agentStatus: {},

  subscribeCluster: clusterId => {
    const ws = useWebSocketStore.getState();

    const subscribeChannel = (suffix: string, handler: (payload: any) => void) => {
      const channel = `username:${clusterId}:${suffix}`;
      ws.subscribe(channel, rawPayload => {
        const msg = rawPayload as LiveWSMessage;
        handler(msg.payload);
      });
    };

    // --- Metric ---
    subscribeChannel("metric", (payload: MetricPayload) => {
      set(state => ({
        metric: {
          ...state.metric,
          [clusterId]: payload.nodes,
        },
        lastUpdate: { ...state.lastUpdate, [clusterId]: Date.now() },
      }));
    });

    // --- Log ---
    subscribeChannel("log", (payload: LogPayload) => {
      set(state => ({
        log: {
          ...state.log,
          [clusterId]: [
            ...(state.log[clusterId] ?? []),
            `[${payload.timestamp}] [${payload.level}] ${payload.message}`,
          ],
        },
        lastUpdate: { ...state.lastUpdate, [clusterId]: Date.now() },
      }));
    });

    // --- Heartbeat 체크 (중복 제거) ---
    if (clusterIntervals[clusterId]) {
      clearInterval(clusterIntervals[clusterId]);
    }

    const interval = setInterval(() => {
      const last = get().lastUpdate[clusterId];
      const now = Date.now();
      const diff = now - (last ?? 0);
      const isAlive = diff < 15000;
      set(state => ({
        agentStatus: {
          ...state.agentStatus,
          [clusterId]: isAlive ? "online" : "offline",
        },
      }));
    }, 5000);

    clusterIntervals[clusterId] = interval;
  },

  unsubscribeCluster: clusterId => {
    const ws = useWebSocketStore.getState();

    // 모든 타입별 채널 해제
    ["metric", "log"].forEach(suffix => {
      const channel = `username:${clusterId}:${suffix}`;
      ws.unsubscribe(channel, () => {});
    });

    // interval 클린업
    if (clusterIntervals[clusterId]) {
      clearInterval(clusterIntervals[clusterId]);
      delete clusterIntervals[clusterId];
    }

    // 상태 초기화 (선택적)
    set(state => ({
      agentStatus: { ...state.agentStatus, [clusterId]: "offline" },
    }));
  },
}));
