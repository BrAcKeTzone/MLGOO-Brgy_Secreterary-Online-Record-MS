import React, { useEffect } from "react";
import useDocumentStore from "../store/documentStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import DocumentFilters from "../components/DocumentManagement/DocumentFilters";
import DocumentTable from "../components/DocumentManagement/DocumentTable";

const ManageDocuments = () => {
  const {
    filteredDocuments,
    loading,
    error,
    filters,
    fetchDocuments,
    updateFilters,
    updateDocumentStatus,
    deleteDocument,
  } = useDocumentStore();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      await deleteDocument(documentId);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading documents..." />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Manage Documents
        </h1>
        <p className="text-gray-600">
          View and manage all submitted reports and documents
        </p>
      </div>

      <DocumentFilters filters={filters} onFilterChange={updateFilters} />

      <DocumentTable
        documents={filteredDocuments}
        onStatusUpdate={updateDocumentStatus}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ManageDocuments;
