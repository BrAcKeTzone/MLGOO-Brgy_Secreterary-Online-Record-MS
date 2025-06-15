import React, { useState } from 'react';

const NotificationComposer = ({ onSend, disabled }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(message, title, 'info', priority);
    setTitle('');
    setMessage('');
    setPriority('normal');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Compose Notification
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification Title"
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div className="mb-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full p-2 border rounded-lg h-32 resize-none"
            required
          />
        </div>

        <div className="mb-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="normal">Normal Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={disabled}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
          `}
        >
          Send Notification
        </button>
      </form>
    </div>
  );
};

export default NotificationComposer;