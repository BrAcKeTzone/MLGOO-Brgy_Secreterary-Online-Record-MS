import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
} from "react-icons/fa";
import FormInput from "../Common/FormInput";
import FormTextbox from "../Common/FormTextbox";
import LoadingScreen from "../Common/LoadingScreen";
import ConfirmationModal from "../Common/ConfirmationModal";
import SectionForm from "./SectionComponents/SectionForm";
import SectionCard from "./SectionComponents/SectionCard";

const TermsPanel = ({ termsOfService, useSettingsStore }) => {
  const {
    fetchTermsOfService,
    updateTermsOfServiceSection,
    createTermsOfServiceSection,
    reorderTermsOfServiceSections,
    deleteTermsOfServiceSection,
    loading,
    error,
  } = useSettingsStore();

  const [sections, setSections] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSection, setNewSection] = useState({
    title: "",
    content: "",
    order: 1,
  });
  const [formData, setFormData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    // Sort sections by order when termsOfService changes
    if (termsOfService && termsOfService.length > 0) {
      const sortedSections = [...termsOfService].sort(
        (a, b) => a.order - b.order
      );
      setSections(sortedSections);
    } else {
      setSections([]);
    }
  }, [termsOfService]);

  useEffect(() => {
    fetchTermsOfService();
  }, [fetchTermsOfService]);

  const handleEditSave = async (id) => {
    try {
      await updateTermsOfServiceSection(id, formData);
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error("Failed to update section:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewSectionChange = (e) => {
    const { name, value } = e.target;
    setNewSection((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSection = async () => {
    try {
      await createTermsOfServiceSection(newSection);
      // Reset form
      setNewSection({
        title: "",
        content: "",
        order:
          sections.length > 0
            ? Math.max(...sections.map((s) => s.order)) + 1
            : 1,
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add section:", error);
    }
  };

  const handleMoveSection = async (section, direction) => {
    const currentIndex = sections.findIndex((s) => s.id === section.id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === sections.length - 1)
    ) {
      return; // Can't move beyond bounds
    }

    const newSections = [...sections];
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    // Swap order values
    const temp = newSections[targetIndex].order;
    newSections[targetIndex].order = newSections[currentIndex].order;
    newSections[currentIndex].order = temp;

    // Prepare data for API call
    const sectionsToUpdate = [
      {
        id: newSections[targetIndex].id,
        order: newSections[targetIndex].order,
      },
      {
        id: newSections[currentIndex].id,
        order: newSections[currentIndex].order,
      },
    ];

    try {
      await reorderTermsOfServiceSections(sectionsToUpdate);
    } catch (error) {
      console.error("Failed to reorder sections:", error);
    }
  };

  const handleDeleteSection = async (id) => {
    try {
      await deleteTermsOfServiceSection(id);
      setConfirmDelete(null);
    } catch (error) {
      console.error("Failed to delete section:", error);
    }
  };

  const handleStartEdit = (section) => {
    setEditingId(section.id);
    setFormData({
      title: section.title,
      content: section.content,
      order: section.order,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  if (loading && sections.length === 0) {
    return <LoadingScreen message="Loading Terms of Service..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Terms of Service Settings</h2>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setNewSection({
              title: "",
              content: "",
              order:
                sections.length > 0
                  ? Math.max(...sections.map((s) => s.order)) + 1
                  : 1,
            });
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus /> Add Section
        </button>
      </div>

      {showAddForm && (
        <SectionForm
          section={newSection}
          onChange={handleNewSectionChange}
          onSubmit={handleAddSection}
          onCancel={() => setShowAddForm(false)}
          loading={loading}
          title="Add New Section"
          submitLabel={loading ? "Adding..." : "Add Section"}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!confirmDelete}
        title="Confirm Deletion"
        message={
          confirmDelete
            ? `Are you sure you want to delete the section "${confirmDelete.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel={loading ? "Deleting..." : "Delete"}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        onConfirm={() => handleDeleteSection(confirmDelete?.id)}
        onCancel={() => setConfirmDelete(null)}
      />

      <div className="space-y-4">
        {sections.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No terms of service sections found. Add your first section.
            </p>
          </div>
        ) : (
          sections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isEditing={editingId === section.id}
              formData={formData}
              onChange={handleChange}
              onSave={() => handleEditSave(section.id)}
              onCancelEdit={handleCancelEdit}
              onEdit={() => handleStartEdit(section)}
              onDelete={() => setConfirmDelete(section)}
              onMoveUp={() => handleMoveSection(section, "up")}
              onMoveDown={() => handleMoveSection(section, "down")}
              isFirst={sections.indexOf(section) === 0}
              isLast={sections.indexOf(section) === sections.length - 1}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TermsPanel;
