import { sampleUserList } from "./sampleUserList";
import { sampleReports } from "./sampleReports";
import { optionsLogActionTypes } from "../options/optionsLogActionTypes";

// Helper function to generate random dates within last 30 days
const getRandomDate = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// List of sample devices and browsers for login/logout details
const devices = ['Desktop', 'Mobile', 'Tablet'];
const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];

// Generate 100 sample logs
export const sampleLogs = Array.from({ length: 100 }, (_, index) => {
  const actionType = Object.values(optionsLogActionTypes)[Math.floor(Math.random() * Object.values(optionsLogActionTypes).length)];
  const user = sampleUserList[Math.floor(Math.random() * sampleUserList.length)];
  const timestamp = getRandomDate();
  
  let details = "";
  switch (actionType) {
    case optionsLogActionTypes.USER_CREATED:
    case optionsLogActionTypes.USER_UPDATED:
    case optionsLogActionTypes.USER_DELETED:
      const targetUser = sampleUserList[Math.floor(Math.random() * sampleUserList.length)];
      details = `User ID: ${targetUser._id}`;
      break;
    case optionsLogActionTypes.REPORT_SUBMITTED:
    case optionsLogActionTypes.REPORT_APPROVED:
    case optionsLogActionTypes.REPORT_REJECTED:
      const report = sampleReports[Math.floor(Math.random() * sampleReports.length)];
      details = `Report ID: ${report._id}, Type: ${report.reportType}`;
      break;
    case optionsLogActionTypes.NOTIFICATION_SENT:
      details = `Recipients: ${Math.floor(Math.random() * 10) + 1} users`;
      break;
    case optionsLogActionTypes.USER_LOGIN:
    case optionsLogActionTypes.USER_LOGOUT:
      const device = devices[Math.floor(Math.random() * devices.length)];
      const browser = browsers[Math.floor(Math.random() * browsers.length)];
      details = `Device: ${device}, Browser: ${browser}`;
      break;
    case optionsLogActionTypes.PASSWORD_CHANGED:
      details = "Password updated successfully";
      break;
    default:
      details = "No additional details";
  }

  return {
    _id: `log${(index + 1).toString().padStart(3, '0')}`,
    action: actionType,
    userId: user._id,
    userName: `${user.firstName} ${user.lastName}`,
    userEmail: user.email,
    timestamp: timestamp.toISOString(),
    details
  };
}).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by timestamp descending

export const logActionTypes = Object.values(optionsLogActionTypes);