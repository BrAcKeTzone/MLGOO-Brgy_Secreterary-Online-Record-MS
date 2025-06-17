import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import FormInput from "../Common/FormInput";

const BarangaysPanel = ({ barangays, onUpdate }) => {
  const [editingBarangay, setEditingBarangay] = useState(null);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(
      editingBarangay?._id ? { ...editingBarangay, ...formData } : formData
    );
    setEditingBarangay(null);
    setFormData({ _id: "", name: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Barangay Management</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          onClick={() => setEditingBarangay({})}
        >
          <FaPlus />{" "}
          <span className="hidden md:inline-block md:text-sm">
            Add Barangay
          </span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {barangays.map((barangay) => (
          <div key={barangay._id} className="bg-gray-50 p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <FormInput
                  label="Barangay ID"
                  name="_id"
                  value={
                    editingBarangay?._id === barangay._id
                      ? formData._id
                      : barangay._id
                  }
                  onChange={handleChange}
                  disabled={editingBarangay?._id !== barangay._id}
                  required
                />
                <FormInput
                  label="Barangay Name"
                  name="name"
                  value={
                    editingBarangay?._id === barangay._id
                      ? formData.name
                      : barangay.name
                  }
                  onChange={handleChange}
                  disabled={editingBarangay?._id !== barangay._id}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                {editingBarangay?._id === barangay._id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditingBarangay(null)}
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
                        setEditingBarangay(barangay);
                        setFormData({
                          _id: barangay._id,
                          name: barangay.name,
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

      {/* Add New Barangay Modal */}
      {editingBarangay && !editingBarangay._id && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Barangay</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                label="Barangay ID"
                name="_id"
                value={formData._id}
                onChange={handleChange}
                required
                placeholder="e.g., brgy001"
              />
              <FormInput
                label="Barangay Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter barangay name"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBarangay(null)}
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

export default BarangaysPanel;
