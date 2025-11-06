import queue
import signal
import sys

from collector import ClusterCollector
from kubernetes import config
from sender import gRPCClient

from agent import config as cfg  # 환경 변수 로드된 설정 모듈 (cfg.GRPC_HOST 등)

q = queue.Queue()


def main():
    # Kubernetes 설정 로드 (in-cluster 우선)
    try:
        config.load_incluster_config()
    except Exception:
        print(f"{cfg.K8S_CONTEXT}, {cfg.K8S_CONFIG_FILE}")
        config.load_kube_config(
            context=cfg.K8S_CONTEXT,
            config_file=cfg.K8S_CONFIG_FILE
        )

    # ClusterCollector에 config 전달
    collector = ClusterCollector(q, interval=cfg.POLL_INTERVAL, config=cfg)
    collector.start()

    # gRPC 설정 로드
    grpc_host = cfg.GRPC_HOST or "localhost"
    grpc_port = int(cfg.GRPC_PORT or 50051)
    grpc_token = cfg.GRPC_TOKEN or ""
    poll_interval = cfg.POLL_INTERVAL

    print(
        f"[agent] Starting gRPC client to {grpc_host}:{grpc_port} (poll={poll_interval}s)")

    grpc_client = gRPCClient(host=grpc_host, port=grpc_port, token=grpc_token)

    # Graceful shutdown
    def shutdown(*args):
        print("\n[agent] Shutting down gracefully...")
        collector.stop()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    try:
        grpc_client.send_stream(q)
    except Exception as e:
        print(f"[agent] gRPC stream error: {e}")
        shutdown()


if __name__ == "__main__":
    main()
