import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import FormTextbox from "../Common/FormTextbox";
import useSettingsStore from "../../store/SettingsStore";
import LoadingScreen from "../Common/LoadingScreen";

const PrivacyPanel = () => {
  const { privacyPolicy, loading, error, fetchPrivacyPolicy, updatePrivacyPolicy } = useSettingsStore();
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchPrivacyPolicy();
  }, [fetchPrivacyPolicy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePrivacyPolicy({ ...privacyPolicy, [editingSection]: formData[editingSection] });
    setEditingSection(null);
    setFormData({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <LoadingScreen message="Loading Privacy Policy..." />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Privacy Policy Settings</h2>

      <div className="space-y-6">
        {Object.entries(privacyPolicy).map(([key, value]) => (
          <div key={key} className="bg-gray-50 p-4 rounded-lg">
            <form onSubmit={handleSubmit}>
              <FormTextbox
                label={key.replace(/([A-Z])/g, " $1").trim()}
                name={key}
                value={editingSection === key ? formData[key] : value}
                onChange={handleChange}
                disabled={editingSection !== key}
                rows={6}
              />

              <div className="flex justify-end gap-2 mt-4">
                {editingSection === key ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSection(null);
                        setFormData({});
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
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSection(key);
                      setFormData({ [key]: value });
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <FaEdit className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPanel;
