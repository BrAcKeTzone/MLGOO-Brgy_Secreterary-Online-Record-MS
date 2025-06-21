import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPowerOff,
  FaPlus,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import FormInput from "../Common/FormInput";
import FormTextbox from "../Common/FormTextbox";

const ValidIDTypesPanel = ({ validIDTypes, useSettingsStore }) => {
  const {
    createValidIDType,
    updateValidIDType,
    deleteValidIDType,
    toggleValidIDTypeStatus,
    loading,
  } = useSettingsStore();

  const [editingIdType, setEditingIdType] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    isActive: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isAdding) {
        // Add new ID type
        await createValidIDType(formData);
        setIsAdding(false);
        resetForm();
      } else {
        // Update existing ID type
        await updateValidIDType(formData.id, formData);
        setEditingIdType(null);
        resetForm();
      }
    } catch (error) {
      console.error("Error saving ID type:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      isActive: true,
    });
    setEditingIdType(null);
  };

  const handleToggleStatus = async (id) => {
    try {
      await toggleValidIDTypeStatus(id);
    } catch (error) {
      console.error("Error toggling ID type status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this ID type? This action cannot be undone."
      )
    ) {
      try {
        console.log("Attempting to delete ID:", id);
        await deleteValidIDType(id);
      } catch (error) {
        console.error("Error deleting ID type:", error);
        alert(`Failed to delete: ${error.message || "Unknown error"}`);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Valid ID Types</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <FaPlus />
          <span className="hidden md:inline-block md:text-sm">
            Add Valid ID Type
          </span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Add New ID Type Form */}
        {isAdding && (
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <FormInput
                  label="ID Type Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter ID type name (e.g. National ID)"
                />

                <FormTextbox
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description or requirements"
                  rows={3}
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-gray-700">
                    Active
                  </label>
                </div>
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

        {/* Existing ID Types */}
        {validIDTypes.map((idType) => (
          <div
            key={idType.id}
            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                {/* Always show form fields like in ReportTypesPanel */}
                <FormInput
                  label="ID Type Name"
                  name="name"
                  value={
                    editingIdType?.id === idType.id
                      ? formData.name
                      : idType.name
                  }
                  onChange={handleInputChange}
                  disabled={editingIdType?.id !== idType.id}
                  required
                />

                <FormTextbox
                  label="Description"
                  name="description"
                  value={
                    editingIdType?.id === idType.id
                      ? formData.description
                      : idType.description || ""
                  }
                  onChange={handleInputChange}
                  disabled={editingIdType?.id !== idType.id}
                  rows={3}
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`isActive-${idType.id}`}
                    name="isActive"
                    checked={
                      editingIdType?.id === idType.id
                        ? formData.isActive
                        : idType.isActive
                    }
                    onChange={handleInputChange}
                    disabled={editingIdType?.id !== idType.id}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label
                    htmlFor={`isActive-${idType.id}`}
                    className="ml-2 text-gray-700"
                  >
                    Active
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                {editingIdType?.id === idType.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditingIdType(null)}
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
                        setEditingIdType(idType);
                        setFormData({
                          id: idType.id,
                          name: idType.name,
                          description: idType.description || "",
                          isActive: idType.isActive,
                        });
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(idType.id)}
                      className={`${
                        idType.isActive
                          ? "text-red-600 hover:text-red-900"
                          : "text-green-600 hover:text-green-900"
                      }`}
                    >
                      <FaPowerOff className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(idType.id)}
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        ))}

        {validIDTypes.length === 0 && !isAdding && (
          <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500 md:col-span-2">
            No valid ID types found. Add some to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidIDTypesPanel;
