import base64
import hashlib
import logging
import threading
import time

from kubernetes import client, watch
from NodeCache import NodeCache


class ClusterCollector:
    def __init__(self, q, interval=None, config=None):
        self.q = q
        self.config = config
        self.interval = interval or getattr(config, "POLL_INTERVAL", 5)
        self.running = False

        logging.basicConfig(level=logging.INFO,
                            format="[%(levelname)s] %(message)s")
        self.log = logging.getLogger("collector")

        self.log.info("[ClusterCollector] Loaded local kubeconfig")

        self.v1 = client.CoreV1Api()

    def _collect_metrics(self):
        node_cache = NodeCache()
        nodes = node_cache.get_nodes()
        cluster_name = getattr(self.config, "CLUSTER_NAME", "unknown")

        data = {
            "type": "metric",
            "timestamp": time.time(),
            "cluster": cluster_name,
            "nodes": nodes,
        }

        self.log.info(
            f"[METRIC] Collected: {len(nodes)} nodes ({cluster_name})")
        self.q.put(data)

    def _metric_loop(self):
        while self.running:
            try:
                self._collect_metrics()
            except Exception as e:
                self.log.warning(f"[METRIC] Error collecting metrics: {e}")
            time.sleep(self.interval)

    def _stream_single_container_logs(self, namespace, pod_name, container_name):
        w = watch.Watch()
        try:
            for log_line in w.stream(
                self.v1.read_namespaced_pod_log,
                name=pod_name,
                namespace=namespace,
                container=container_name,
                follow=True,
                _preload_content=True,
            ):
                log_entry = {
                    "type": "log",
                    "timestamp": time.time(),
                    "level": "INFO",
                    "cluster": getattr(self.config, "CLUSTER_NAME", "unknown"),
                    "message": log_line.strip(),
                }
                self.q.put(log_entry)
        except Exception as e:
            self.log.warning(f"[LOG][{pod_name}/{container_name}] Error: {e}")

    def _stream_pod_logs(self, namespace, pod_name):
        pod = self.v1.read_namespaced_pod(name=pod_name, namespace=namespace)
        containers = [c.name for c in pod.spec.containers]
        for container in containers:
            threading.Thread(
                target=self._stream_single_container_logs,
                args=(namespace, pod_name, container),
                daemon=True,
            ).start()

    def _start_log_collectors(self):
        self.log.info("[LOG] Starting log collectors for all pods...")
        pods = self.v1.list_pod_for_all_namespaces(watch=False).items
        for pod in pods:
            threading.Thread(
                target=self._stream_pod_logs,
                args=(pod.metadata.namespace, pod.metadata.name),
                daemon=True,
            ).start()

    def get_cluster_info(self):
        nodes = self.v1.list_node()
        pods = self.v1.list_pod_for_all_namespaces()
        return {
            "node_count": len(nodes.items),
            "pod_count": len(pods.items),
            "nodes": [n.metadata.name for n in nodes.items],
        }

    def get_cluster_fingerprint(self):
        ns = self.v1.read_namespace("kube-system")
        kube_system_uid = ns.metadata.uid

        cm = self.v1.read_namespaced_config_map("cluster-info", "kube-public")
        cluster_ca = cm.data.get("certificate-authority-data", "")
        cluster_ca_hash = hashlib.sha256(
            base64.b64decode(cluster_ca)).hexdigest()

        fingerprint_raw = f"{kube_system_uid}:{cluster_ca_hash}"
        fingerprint = hashlib.sha256(fingerprint_raw.encode()).hexdigest()
        return fingerprint

    def start(self):
        self.running = True
        cluster_name = getattr(self.config, "CLUSTER_NAME", "unknown")
        self.log.info(
            f"[ClusterCollector] Starting collectors for {cluster_name}")
        self.log.info(
            f"[ClusterCollector] Cluster Fingerprint: {self.get_cluster_fingerprint()}")
        threading.Thread(target=self._metric_loop, daemon=True).start()
        threading.Thread(target=self._start_log_collectors,
                         daemon=True).start()

    def stop(self):
        self.running = False
        self.log.info("[ClusterCollector] Stopping collectors...")
        try:
            watch.Watch().stop()
        except Exception:
            pass
