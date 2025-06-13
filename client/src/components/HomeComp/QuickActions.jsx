import React from "react";
import { FaPlus, FaHistory } from "react-icons/fa";
import QuickLink from "../DashboardComp/QuickLink";

const QuickActions = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <QuickLink
      to="/submit-report"
      title="Submit New Report"
      icon={<FaPlus />}
      description="Create and submit a new report"
    />
    <QuickLink
      to="/my-reports"
      title="View My Reports"
      icon={<FaHistory />}
      description="View and manage your submitted reports"
    />
  </div>
);

export default QuickActions;