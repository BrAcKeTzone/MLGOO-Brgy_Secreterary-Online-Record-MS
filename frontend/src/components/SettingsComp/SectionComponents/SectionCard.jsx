import React from "react";
import {
  FaEdit,
  FaSave,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
} from "react-icons/fa";
import FormInput from "../../Common/FormInput";
import FormTextbox from "../../Common/FormTextbox";

const SectionCard = ({
  section,
  isEditing,
  formData,
  onChange,
  onSave,
  onCancelEdit,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  loading
}) => {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between bg-gray-100 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <button
              onClick={onMoveUp}
              disabled={isFirst || loading}
              className={`text-gray-500 hover:text-gray-700 ${
                isFirst || loading
                  ? "opacity-30 cursor-not-allowed"
                  : ""
              }`}
              aria-label="Move section up"
            >
              <FaArrowUp />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast || loading}
              className={`text-gray-500 hover:text-gray-700 ${
                isLast || loading
                  ? "opacity-30 cursor-not-allowed"
                  : ""
              }`}
              aria-label="Move section down"
            >
              <FaArrowDown />
            </button>
          </div>
          <h3 className="font-medium">
            {section.title}{" "}
            <span className="text-xs text-gray-500">
              (Order: {section.order})
            </span>
          </h3>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={onCancelEdit}
                className="p-1 text-gray-500 hover:text-gray-700"
                aria-label="Cancel edit"
                disabled={loading}
              >
                <FaTimes />
              </button>
              <button
                onClick={onSave}
                className="p-1 text-green-600 hover:text-green-800"
                aria-label="Save changes"
                disabled={loading}
              >
                <FaSave />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="p-1 text-blue-600 hover:text-blue-800"
                aria-label="Edit section"
                disabled={loading}
              >
                <FaEdit />
              </button>
              <button
                onClick={onDelete}
                className="p-1 text-red-600 hover:text-red-800"
                aria-label="Delete section"
                disabled={loading}
              >
                <FaTrash />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-4">
        {isEditing ? (
          <div className="space-y-4">
            <FormInput
              label="Title"
              name="title"
              value={formData.title}
              onChange={onChange}
              required
            />
            <FormTextbox
              label="Content"
              name="content"
              value={formData.content}
              onChange={onChange}
              required
              rows={6}
            />
            <FormInput
              label="Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={onChange}
              required
              min={1}
              disabled={true}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: section.content.replace(/\n/g, "<br>"),
              }}
            />
            <div className="text-sm text-gray-500">
              <p>
                Last updated:{" "}
                {section.updatedAt &&
                  new Date(section.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionCard;