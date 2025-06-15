import React from 'react';
import useSubmitReportStore from '../../store/submitReportStore';

const ReportForm = () => {
  const { reportType, formData, handleInputChange } = useSubmitReportStore();

  switch (reportType) {
    case "KP":
      return (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="kpCaseNumber"
              className="block text-sm font-medium text-gray-700"
            >
              KP Case Number:
            </label>
            <input
              type="text"
              id="kpCaseNumber"
              name="kpCaseNumber"
              value={formData.kpCaseNumber || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Add more KP-specific fields here */}
        </div>
      );
    case "MBCRS":
      return (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="councilMeetingDate"
              className="block text-sm font-medium text-gray-700"
            >
              Council Meeting Date:
            </label>
            <input
              type="date"
              id="councilMeetingDate"
              name="councilMeetingDate"
              value={formData.councilMeetingDate || ""}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          {/* Add more MBCRS-specific fields here */}
        </div>
      );
    default:
      return (
        <p className="text-gray-500">Select a report type to see the form.</p>
      );
  }
};

export default ReportForm;