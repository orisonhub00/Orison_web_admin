"use client";

import Dashboard from "../../../src/components/Dashboard/Dashboard";
import withAuth from "@/utils/withAuth";

export default function DashboardPage(props: any) {
  const ProtectedDashboard = withAuth(Dashboard);
  return <ProtectedDashboard {...props} />;
}
