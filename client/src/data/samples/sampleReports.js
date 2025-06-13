import { sampleBarangays } from './sampleBarangays';
import { optionsReportTypes } from '../options/optionsReportTypes';

// Helper function to generate random dates within a range
const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate 50 sample reports
export const sampleReports = Array.from({ length: 50 }, (_, index) => {
  const reportType = optionsReportTypes[Math.floor(Math.random() * optionsReportTypes.length)];
  const barangay = sampleBarangays[Math.floor(Math.random() * sampleBarangays.length)];
  const statuses = ["Pending", "Approved", "Rejected"];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  const submittedDate = randomDate(
    new Date(2025, 0, 1), // January 1, 2025
    new Date(2025, 5, 13)  // June 13, 2025
  );

  return {
    _id: `REP${(index + 1).toString().padStart(3, '0')}`,
    reportType: reportType._id,
    reportName: reportType.name,
    status,
    submittedDate: submittedDate.toISOString(),
    barangayId: barangay._id,
    barangayName: barangay.name,
    fileName: `${reportType.shortName}_${barangay.name}_${submittedDate.toISOString().split('T')[0]}.pdf`,
    fileSize: Math.floor(Math.random() * 5000000) + 500000, // Random size between 500KB and 5MB
    comments: status === "Rejected" ? "Please revise and resubmit with updated information." : "",
    updatedAt: status !== "Pending" ? 
      new Date(submittedDate.getTime() + 86400000).toISOString() : // 1 day after submission
      null
  };
});