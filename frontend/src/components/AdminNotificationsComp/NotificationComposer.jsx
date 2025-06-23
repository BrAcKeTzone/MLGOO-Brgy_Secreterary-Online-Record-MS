import React, { useState } from 'react';

const NotificationComposer = ({ onSend, disabled }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [priority, setPriority] = useState('normal');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const notificationData = {
      title,
      message,
      type,
      priority
    };
    
    onSend(notificationData);
    setTitle('');
    setMessage('');
    setType('info');
    setPriority('normal');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Compose Notification
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full p-2 border rounded-lg h-32 resize-none"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="info">Information</option>
              <option value="reminder">Reminder</option>
              <option value="alert">Alert</option>
              <option value="success">Success</option>
              <option value="system">System</option>
              <option value="event">Event</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
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