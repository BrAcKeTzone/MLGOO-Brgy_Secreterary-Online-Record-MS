import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import FormInput from "../Common/FormInput";
import useSettingsStore from "../../store/settingsStore";

const BarangaysPanel = ({ barangays, onUpdate }) => {
  const createBarangay = useSettingsStore((state) => state.createBarangay);
  const deleteBarangay = useSettingsStore((state) => state.deleteBarangay);
  const [editingBarangay, setEditingBarangay] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdding) {
      // Add new barangay
      await createBarangay({ name: formData.name });
      setIsAdding(false);
      setFormData({ id: "", name: "" });
    } else {
      // Update existing barangay
      onUpdate(formData.id, { name: formData.name });
      setEditingBarangay(null);
      setFormData({ id: "", name: "" });
    }
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
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <FaPlus />
          <span className="hidden md:inline-block md:text-sm">
            Add Barangay
          </span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Add New Barangay Form */}
        {isAdding && (
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <FormInput
                  label="Barangay Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter barangay name"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setFormData({ id: "", name: "" });
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

        {/* Existing Barangays */}
        {barangays.map((barangay) => (
          <div key={barangay.id} className="bg-gray-50 p-4 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4">
                <FormInput
                  label="Barangay Name"
                  name="name"
                  value={
                    editingBarangay?.id === barangay.id
                      ? formData.name
                      : barangay.name
                  }
                  onChange={handleChange}
                  disabled={editingBarangay?.id !== barangay.id}
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                {editingBarangay?.id === barangay.id ? (
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
                          id: barangay.id,
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
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this barangay?"
                          )
                        ) {
                          await deleteBarangay(barangay.id);
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

export default BarangaysPanel;
