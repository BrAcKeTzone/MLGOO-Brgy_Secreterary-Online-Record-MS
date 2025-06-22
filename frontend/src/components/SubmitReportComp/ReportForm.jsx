import React from "react";
import FormInput from "../Common/FormInput";
import FormTextbox from "../Common/FormTextbox";
import useSubmitReportStore from "../../store/submitReportStore";

const ReportForm = () => {
  // Get state and actions from the store
  const { reportName, setReportName, comments, setComments, resetForm } =
    useSubmitReportStore();

  const handleReportNameChange = (e) => {
    setReportName(e.target.value);
  };

  const handleCommentsChange = (e) => {
    setComments(e.target.value);
  };

  return (
    <div className="space-y-4">
      <FormInput
        label="Report Name"
        name="reportName"
        value={reportName}
        onChange={handleReportNameChange}
        placeholder="Enter a descriptive name for the report"
        required={true}
      />

      <FormTextbox
        label="Comments or Description"
        name="comments"
        value={comments}
        onChange={handleCommentsChange}
        placeholder="Enter any additional comments or description for this report"
        rows={4}
        maxLength={500} // Add a character limit
      />
    </div>
  );
};

export default ReportForm;
