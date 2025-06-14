import React, { useEffect } from "react";
import useDocumentStore from "../store/documentStore";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import DocumentFilters from "../components/DocumentManagementComp/DocumentFilters";
import DocumentTable from "../components/DocumentManagementComp/DocumentTable";

const ManageDocuments = () => {
  const { documents, loading, error, filters, fetchDocuments, updateFilters } =
    useDocumentStore();

  // Initial fetch with default filters
  useEffect(() => {
    fetchDocuments(filters);
  }, []);

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

      <DocumentTable documents={documents} />
    </div>
  );
};

export default ManageDocuments;
