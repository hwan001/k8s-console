"use client";

import EnhancedTable from "@/app/_components/EnhancedTable";
import Layout from "@/app/_components/Layout";
import { useClusterLiveStore } from "@/app/_stores/ClusterLiveStore";
import { useClusterStore } from "@/app/_stores/ClusterStore";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import ClusterInfo from "./components/ClusterInfo";
import LogViewer from "./components/LogViewer";
import NodeTable from "./components/NodeTable";

const headCells = [
  { id: "cluster", numeric: false, disablePadding: true, label: "Cluster" },
  { id: "node", numeric: false, disablePadding: false, label: "Node" },
  { id: "pod", numeric: false, disablePadding: false, label: "Pod" },
  { id: "pod_ip", numeric: false, disablePadding: false, label: "IP" },
  { id: "namespace", numeric: false, disablePadding: false, label: "Namespace" },
  { id: "status", numeric: true, disablePadding: false, label: "Status" },
];

const rows = [
  {
    id: 1,
    cluster: "h001-k8s",
    node: "node1",
    pod: "test-1-pod",
    pod_ip: "192.168.0.55",
    namespace: "test",
    status: 1,
  },
  {
    id: 2,
    cluster: "h001-k8s",
    node: "node2",
    pod: "test-2-pod",
    pod_ip: "192.168.0.56",
    namespace: "default",
    status: 0,
  },
];

export default function ClusterDetailPage() {
  const { clusterId } = useParams<{ clusterId: string }>();
  const { clusters, fetchClusters } = useClusterStore();
  const { log, metric, subscribeCluster, unsubscribeCluster } = useClusterLiveStore();

  const liveNodes = metric[clusterId] || [];
  const liveLogs = log[clusterId] || [];

  useEffect(() => {
    if (clusters.length === 0) {
      fetchClusters();
    }
  }, [clusters.length, fetchClusters]);

  useEffect(() => {
    if (!clusterId) return;
    subscribeCluster(clusterId);
    return () => unsubscribeCluster(clusterId);
  }, [clusterId]);

  const cluster = clusters.find(c => c.id === clusterId);

  if (!cluster) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading cluster details...</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box className="p-6 w-full max-w-none">
        <Typography variant="h4" fontWeight="bold" mb={4}>
          {cluster.name}
        </Typography>

        <ClusterInfo cluster={cluster} />

        <Box mt={6}>
          <Typography variant="h6" mb={2}>
            Node Status
          </Typography>
          <NodeTable nodes={liveNodes.length ? liveNodes : cluster.nodes} />
        </Box>

        <Box mt={6}>
          <Typography variant="h6" mb={2}>
            Log Viewer
          </Typography>
          <LogViewer logs={liveLogs} />
        </Box>
      </Box>

      <EnhancedTable
        title="Pods"
        headCells={headCells}
        rows={rows}
        onAddRow={() => console.log("Add new row")}
        onEditRow={row => console.log("Edit", row)}
        onDeleteSelected={ids => console.log("Delete", ids)}
      />
    </Layout>
  );
}
