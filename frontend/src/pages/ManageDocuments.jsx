import React, { useEffect, useState, useCallback } from "react";
import useDocumentStore from "../store/documentStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import DocumentFilters from "../components/DocumentManagementComp/DocumentFilters";
import DocumentTable from "../components/DocumentManagementComp/DocumentTable";
import { format } from "date-fns";
import { FaClock, FaSync } from "react-icons/fa";

const ManageDocuments = () => {
  const {
    documents,
    loading,
    error,
    filters,
    pagination,
    fetchDocuments,
    updateFilters,
    approveDocument,
    rejectDocument,
    deleteDocument,
    openViewModal,
    closeViewModal,
    viewModalOpen,
  } = useDocumentStore();

  // State for overlay loading during actions
  const [actionLoading, setActionLoading] = useState(false);

  // Add state for last updated time and refresh status
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Create a memoized refresh function
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await fetchDocuments();
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing document data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchDocuments]);

  // Initial data load and set up auto-refresh
  useEffect(() => {
    refreshData();

    // Clean up function to close modal if open when unmounting
    return () => {
      if (viewModalOpen) {
        closeViewModal();
      }
    };
  }, [refreshData, closeViewModal, viewModalOpen]);

  // Set up auto-refresh interval (every 60 seconds)
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshData();
    }, 60000 * 5); // 60000 ms = 1 minute

    return () => clearInterval(intervalId);
  }, [refreshData]);

  const formatDateTime = (date) => {
    return format(date, "MMM dd, yyyy 'at' h:mm:ss a");
  };

  const handlePageChange = (newPage) => {
    updateFilters({ page: newPage });
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleApproveDocument = async (docId) => {
    setActionLoading(true);
    await approveDocument(docId);
    setLastUpdated(new Date()); // Update timestamp after successful approval
    setActionLoading(false);
  };

  const handleRejectDocument = async (docId) => {
    setActionLoading(true);
    await rejectDocument(docId);
    setLastUpdated(new Date()); // Update timestamp after successful rejection
    setActionLoading(false);
  };

  const handleDeleteDocument = async (docId) => {
    setActionLoading(true);
    await deleteDocument(docId);
    setLastUpdated(new Date()); // Update timestamp after successful deletion
    setActionLoading(false);
  };

  const handleViewDocument = (docId) => {
    openViewModal(docId);
  };

  if (loading && !actionLoading && documents.length === 0 && !isRefreshing) {
    return <LoadingScreen message="Loading documents..." />;
  }

  if (error && !documents.length) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Manage Documents
        </h1>
        <p className="text-gray-600">
          View and manage all submitted reports and documents
        </p>
      </div>

      {/* Last Updated & Refresh Info */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2 md:mb-0">
          <FaClock className="mr-1" />
          <span>Last updated: {formatDateTime(lastUpdated)}</span>
        </div>
        <button
          onClick={refreshData}
          disabled={isRefreshing || actionLoading}
          className={`flex items-center text-sm ${
            isRefreshing || actionLoading
              ? "text-gray-400"
              : "text-blue-600 hover:text-blue-800"
          } transition-colors`}
        >
          <FaSync
            className={`mr-1 ${
              isRefreshing || actionLoading ? "animate-spin" : ""
            }`}
          />
          {isRefreshing || actionLoading ? "Refreshing..." : "Refresh data"}
        </button>
      </div>

      <DocumentFilters filters={filters} onFilterChange={handleFilterChange} />

      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-700">Processing...</p>
          </div>
        </div>
      )}

      {loading && documents.length > 0 && !actionLoading && !isRefreshing && (
        <div className="flex justify-center my-4">
          <div className="animate-pulse text-gray-500">
            Loading updated results...
          </div>
        </div>
      )}

      <DocumentTable
        documents={documents}
        pagination={pagination}
        onPageChange={handlePageChange}
        onApprove={handleApproveDocument}
        onReject={handleRejectDocument}
        onDelete={handleDeleteDocument}
        onView={handleViewDocument}
      />
    </div>
  );
};

export default ManageDocuments;
