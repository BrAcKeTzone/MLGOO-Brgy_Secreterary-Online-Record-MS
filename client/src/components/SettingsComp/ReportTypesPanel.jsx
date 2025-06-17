import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import FormInput from "../Common/FormInput";

const ReportTypesPanel = ({ reportTypes, onUpdate }) => {
  const [editingType, setEditingType] = useState(null);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    shortName: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editingType?._id ? { ...editingType, ...formData } : formData);
    setEditingType(null);
    setFormData({ _id: "", name: "", shortName: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Report Types</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          onClick={() => setEditingType({})}
        >
          <FaPlus /> Add Report Type
        </button>
      </div>

      <div className="grid gap-4">
        {reportTypes.map((type) => (
          <div key={type._id} className="bg-gray-50 p-4 rounded-lg">
            <form 
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <FormInput
                  label="ID"
                  name="_id"
                  value={editingType?._id === type._id ? formData._id : type._id}
                  onChange={handleChange}
                  disabled={editingType?._id !== type._id}
                  required
                />
                <FormInput
                  label="Full Name"
                  name="name"
                  value={editingType?._id === type._id ? formData.name : type.name}
                  onChange={handleChange}
                  disabled={editingType?._id !== type._id}
                  required
                />
                <FormInput
                  label="Short Name"
                  name="shortName"
                  value={editingType?._id === type._id ? formData.shortName : type.shortName}
                  onChange={handleChange}
                  disabled={editingType?._id !== type._id}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                {editingType?._id === type._id ? (
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
                          _id: type._id,
                          name: type.name,
                          shortName: type.shortName
                        });
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button 
                      type="button"
                      className="text-red-600 hover:text-red-900"
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

      {/* Add New Report Type Modal */}
      {editingType && !editingType._id && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Report Type</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="ID"
                name="_id"
                value={formData._id}
                onChange={handleChange}
                required
                placeholder="e.g., KP, MBCRS"
              />
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
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setEditingType(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTypesPanel;