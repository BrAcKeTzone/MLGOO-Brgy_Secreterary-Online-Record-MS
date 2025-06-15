import React, { useEffect } from "react";
import useMyReportsStore from "../store/myReportsStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import MyReportsFilters from "../components/MyReportsComp/MyReportsFilters";
import MyReportsTable from "../components/MyReportsComp/MyReportsTable";

const MyReports = () => {
  const {
    reports,
    loading,
    error,
    filters,
    fetchReports,
    updateFilters,
    deleteReport,
  } = useMyReportsStore();

  // Initial fetch with default filters
  useEffect(() => {
    fetchReports(filters);
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading documents..." />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  const handleViewReport = (reportId) => {
    // Implement view report logic (e.g., navigate to a details page)
    console.log(`View report with ID: ${reportId}`);
  };

  const handleEditReport = (reportId) => {
    // Implement edit report logic (e.g., navigate to an edit page)
    console.log(`Edit report with ID: ${reportId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Reports</h1>
        <p className="text-gray-600">
          View, edit, and manage your submitted reports
        </p>
      </div>

      <MyReportsFilters filters={filters} onFilterChange={updateFilters} />

      <MyReportsTable
        reports={reports}
        onDelete={deleteReport}
        onView={handleViewReport}
        onEdit={handleEditReport}
      />
    </div>
  );
};

export default MyReports;
