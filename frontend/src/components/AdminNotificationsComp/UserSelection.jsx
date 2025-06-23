import React from 'react';
import FormInput from '../Common/FormInput';

const UserSelection = ({ secretaries, selectedSecretaryIds, onSecretarySelect, onSearchChange, searchTerm }) => {
  const handleSelectAll = () => {
    if (selectedSecretaryIds.length === secretaries.length) {
      onSecretarySelect([]);
    } else {
      onSecretarySelect(secretaries.map(secretary => secretary.id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Barangay Secretaries</h2>
      
      <FormInput
        placeholder="Search by name, email or barangay..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-4"
      />

      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600"
            checked={selectedSecretaryIds.length === secretaries.length && secretaries.length > 0}
            onChange={handleSelectAll}
          />
          <span className="ml-2">Select All</span>
        </label>
        <span className="text-sm text-gray-500">
          {selectedSecretaryIds.length} of {secretaries.length} selected
        </span>
      </div>

      <div className="max-h-60 overflow-y-auto border rounded-md">
        {secretaries.length > 0 ? (
          secretaries.map((secretary) => (
            <label key={secretary.id} className="flex items-center py-2 px-3 hover:bg-gray-50 border-b">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
                checked={selectedSecretaryIds.includes(secretary.id)}
                onChange={() => {
                  if (selectedSecretaryIds.includes(secretary.id)) {
                    onSecretarySelect(selectedSecretaryIds.filter(id => id !== secretary.id));
                  } else {
                    onSecretarySelect([...selectedSecretaryIds, secretary.id]);
                  }
                }}
              />
              <div className="ml-2 flex-1">
                <div className="font-medium">{secretary.firstName} {secretary.lastName}</div>
                <div className="text-xs text-gray-500">{secretary.email}</div>
                {secretary.assignedBrgy && (
                  <div className="text-xs text-blue-600">
                    Barangay {secretary.assignedBrgy.name}
                  </div>
                )}
              </div>
            </label>
          ))
        ) : (
          <div className="py-4 text-center text-gray-500">No barangay secretaries found</div>
        )}
      </div>
    </div>
  );
};

export default UserSelection;