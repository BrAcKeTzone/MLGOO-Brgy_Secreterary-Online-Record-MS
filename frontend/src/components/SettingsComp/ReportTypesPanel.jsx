import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import FormInput from "../Common/FormInput";

const ReportTypesPanel = ({ reportTypes, useSettingsStore }) => {
  const {
    createReportType,
    updateReportType,
    deleteReportType,
    loading,
  } = useSettingsStore();

  const [editingType, setEditingType] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    shortName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAdding) {
        // Add new report type
        await createReportType({
          name: formData.name,
          shortName: formData.shortName,
        });
        setIsAdding(false);
        resetForm();
      } else {
        // Update existing report type
        await updateReportType(formData.id, {
          name: formData.name,
          shortName: formData.shortName,
        });
        setEditingType(null);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving report type:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      shortName: "",
    });
    setEditingType(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report type?")) {
      try {
        await deleteReportType(id);
      } catch (error) {
        console.error("Error deleting report type:", error);
        alert(`Failed to delete: ${error.message || "Unknown error"}`);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Report Types</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <FaPlus />
          <span className="hidden md:inline-block md:text-sm">
            Add Report Type
          </span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Add New Report Type Form */}
        {isAdding && (
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full report name"
                />
                <FormInput
                  label="Short Name"
                  name="shortName"
                  value={formData.shortName}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter short name"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    resetForm();
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="text-green-600 hover:text-green-900"
                >
                  <FaSave className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Existing Report Types */}
        {reportTypes.map((type) => (
          <div key={type.id} className="bg-gray-50 p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <FormInput
                  label="Full Name"
                  name="name"
                  value={
                    editingType?.id === type.id ? formData.name : type.name
                  }
                  onChange={handleInputChange}
                  disabled={editingType?.id !== type.id}
                  required
                />
                <FormInput
                  label="Short Name"
                  name="shortName"
                  value={
                    editingType?.id === type.id
                      ? formData.shortName
                      : type.shortName
                  }
                  onChange={handleInputChange}
                  disabled={editingType?.id !== type.id}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                {editingType?.id === type.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditingType(null)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="text-green-600 hover:text-green-900"
                    >
                      <FaSave className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingType(type);
                        setFormData({
                          id: type.id,
                          name: type.name,
                          shortName: type.shortName,
                        });
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(type.id)}
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        ))}

        {reportTypes.length === 0 && !isAdding && (
          <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500 md:col-span-2">
            No report types found. Add some to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportTypesPanel;
