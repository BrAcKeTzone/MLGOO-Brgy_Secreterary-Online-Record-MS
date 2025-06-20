import React from "react";
import FormInput from "../../Common/FormInput";
import FormTextbox from "../../Common/FormTextbox";

const SectionForm = ({
  section,
  onChange,
  onSubmit,
  onCancel,
  loading,
  title = "Section Form",
  submitLabel = "Save",
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <FormInput
              label="Section Title"
              name="title"
              value={section.title}
              onChange={onChange}
              required
            />
          </div>
          <div className="md:w-1/5">
            <FormInput
              label="Order"
              name="order"
              type="number"
              value={section.order}
              onChange={onChange}
              required
              min={1}
              disabled={true}
            />
          </div>
        </div>

        <FormTextbox
          label="Content"
          name="content"
          value={section.content}
          onChange={onChange}
          required
          rows={6}
        />

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={!section.title || !section.content || loading}
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SectionForm;
