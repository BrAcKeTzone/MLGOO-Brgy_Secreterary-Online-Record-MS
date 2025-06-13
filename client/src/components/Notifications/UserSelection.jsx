import React from 'react';
import FormInput from '../Common/FormInput';

const UserSelection = ({ users, selectedUsers, onUserSelect, onSearchChange, searchTerm }) => {
  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      onUserSelect([]);
    } else {
      onUserSelect(users.map(user => user._id));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Users</h2>
      
      <FormInput
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="mb-4"
      />

      <div className="mb-4">
        <label className="flex items-center text-sm">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-blue-600"
            checked={selectedUsers.length === users.length}
            onChange={handleSelectAll}
          />
          <span className="ml-2">Select All</span>
        </label>
      </div>

      <div className="max-h-60 overflow-y-auto">
        {users.map((user) => (
          <label key={user._id} className="flex items-center py-2 hover:bg-gray-50">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600"
              checked={selectedUsers.includes(user._id)}
              onChange={() => {
                if (selectedUsers.includes(user._id)) {
                  onUserSelect(selectedUsers.filter(id => id !== user._id));
                } else {
                  onUserSelect([...selectedUsers, user._id]);
                }
              }}
            />
            <span className="ml-2">
              <span className="font-medium">{user.firstName} {user.lastName}</span>
              <span className="text-sm text-gray-500 ml-2">({user.email})</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default UserSelection;