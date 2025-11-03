import time

import psutil
from kubernetes import client


class NodeCache:
    def __init__(self, ttl=300, config=None):
        self.ttl = ttl
        self.config = config or {}
        self.cache = None
        self.last_updated = 0

    def get_nodes(self):
        if not self.cache or time.time() - self.last_updated > self.ttl:
            v1 = client.CoreV1Api()
            nodes = v1.list_node().items
            result = []

            for node in nodes:
                addresses = {a.type: a.address for a in node.status.addresses}
                ip = addresses.get("InternalIP", "N/A")
                hostname = addresses.get("Hostname", node.metadata.name)

                labels = node.metadata.labels or {}
                role = "control" if (
                    "node-role.kubernetes.io/master" in labels or
                    "node-role.kubernetes.io/control-plane" in labels
                ) else "data"

                conditions = {c.type: c.status for c in node.status.conditions}
                status = "healthy" if conditions.get(
                    "Ready") == "True" else "down"

                result.append({
                    "id": node.metadata.uid,
                    "ip": ip,
                    "hostname": hostname,
                    "role": role,
                    "cpuUsage": psutil.cpu_percent(),
                    "memoryUsage": psutil.virtual_memory().percent,
                    "status": status,
                    "uptime": format_uptime(),
                    # "clusterName": self.config.get("cluster_name", "unknown"),
                })

            self.cache = result
            self.last_updated = time.time()

        return self.cache


def format_uptime():
    uptime_seconds = time.time() - psutil.boot_time()
    days, remainder = divmod(int(uptime_seconds), 86400)
    hours, minutes = divmod(remainder, 3600)
    return f"{days}d {hours}h {minutes//60}m"
