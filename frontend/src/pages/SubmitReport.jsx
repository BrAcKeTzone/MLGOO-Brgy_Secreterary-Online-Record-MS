import React from "react";
import { optionsReportTypes } from "../data/options/optionsReportTypes";
import FormSelect from "../components/Common/FormSelect";
import FileUploader from "../components/Common/FileUploader";
import Button from "../components/Common/Button";
import ReportForm from "../components/SubmitReportComp/ReportForm";
import useSubmitReportStore from "../store/submitReportStore";

const SubmitReport = () => {
  const {
    reportType,
    setReportType,
    selectedFiles,
    setSelectedFiles,
    submitReport,
    saveDraft,
  } = useSubmitReportStore();

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const handleFileSelect = (files) => {
    setSelectedFiles(files);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-12">
      <div className="relative py-3 sm:max-w-3xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg sm:rounded-3xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Submit Report
          </h1>

          <div className="mb-4">
            <label
              htmlFor="reportType"
              className="block text-sm font-medium text-gray-700"
            >
              Report Type:
            </label>
            <FormSelect
              id="reportType"
              value={reportType}
              onChange={handleReportTypeChange}
              options={optionsReportTypes}
              placeholder="Select Report Type"
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <ReportForm />
          </div>

          <div className="mb-4">
            <label
              htmlFor="files"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Documents:
            </label>
            <FileUploader
              onFileSelect={handleFileSelect}
              selectedFiles={selectedFiles}
            />
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Button onClick={saveDraft} className="mr-2" secondary>
              Save Draft
            </Button>
            <Button onClick={submitReport} primary>
              Submit Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitReport;
