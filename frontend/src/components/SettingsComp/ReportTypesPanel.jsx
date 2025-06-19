import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import FormInput from "../Common/FormInput";
import useSettingsStore from "../../store/settingsStore";

const ReportTypesPanel = ({ reportTypes, onUpdate }) => {
  const createReportType = useSettingsStore((state) => state.createReportType);
  const deleteReportType = useSettingsStore((state) => state.deleteReportType);
  const [editingType, setEditingType] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    shortName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
      // Add new report type
      await createReportType({ name: formData.name, shortName: formData.shortName });
      setIsAdding(false);
      setFormData({ id: "", name: "", shortName: "" });
    } else {
      // Update existing report type
      onUpdate(formData.id, { name: formData.name, shortName: formData.shortName });
      setEditingType(null);
      setFormData({ id: "", name: "", shortName: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          <span className="hidden md:inline-block md:text-sm">Report Type</span>
        </button>
      </div>

      <div className="grid gap-4">
        {/* Add New Report Type Form */}
        {isAdding && (
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full report name"
                />
                <FormInput
                  label="Short Name"
                  name="shortName"
                  value={formData.shortName}
                  onChange={handleChange}
                  required
                  placeholder="Enter short name"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setFormData({ id: "", name: "", shortName: "" });
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
                <button
                  type="submit"
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
              <div className="grid md:grid-cols-3 gap-4">
                <FormInput
                  label="Full Name"
                  name="name"
                  value={
                    editingType?.id === type.id ? formData.name : type.name
                  }
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to delete this report type?")) {
                          await deleteReportType(type.id);
                        }
                      }}
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportTypesPanel;
