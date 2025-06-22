import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentStore from "../store/documentStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import DocumentFilters from "../components/DocumentManagementComp/DocumentFilters";
import DocumentTable from "../components/DocumentManagementComp/DocumentTable";

const ManageDocuments = () => {
  const navigate = useNavigate();
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

  // Initial fetch with default filters
  useEffect(() => {
    fetchDocuments();

    // Clean up function to close modal if open when unmounting
    return () => {
      if (viewModalOpen) {
        closeViewModal();
      }
    };
  }, []);

  const handlePageChange = (newPage) => {
    updateFilters({ page: newPage });
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleApproveDocument = async (docId) => {
    setActionLoading(true);
    await approveDocument(docId);
    setActionLoading(false);
  };

  const handleRejectDocument = async (docId) => {
    setActionLoading(true);
    await rejectDocument(docId);
    setActionLoading(false);
  };

  const handleDeleteDocument = async (docId) => {
    setActionLoading(true);
    await deleteDocument(docId);
    setActionLoading(false);
  };

  const handleViewDocument = (docId) => {
    openViewModal(docId);
  };

  if (loading && !actionLoading && documents.length === 0) {
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

      <DocumentFilters filters={filters} onFilterChange={handleFilterChange} />

      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-700">Processing...</p>
          </div>
        </div>
      )}

      {loading && documents.length > 0 && !actionLoading && (
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
