import { sampleUserList } from "./sampleUserList";

// Helper function to get random users
const getRandomUsers = (count) => {
  const shuffled = [...sampleUserList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const sampleNotifications = [
  {
    _id: "notif001",
    title: "Monthly Report Reminder",
    message: "Please submit your Monthly Accomplishment Report for June 2025 before the deadline.",
    type: "reminder",
    sentTo: getRandomUsers(3).map(user => ({
      userId: user._id,
      userEmail: user.email,
      read: Math.random() > 0.5
    })),
    dateSent: "2025-06-10T08:00:00.000Z",
    priority: "high"
  },
  {
    _id: "notif002",
    title: "System Maintenance",
    message: "The system will undergo maintenance on June 15, 2025 from 10:00 PM to 11:00 PM.",
    type: "system",
    sentTo: sampleUserList.map(user => ({
      userId: user._id,
      userEmail: user.email,
      read: Math.random() > 0.5
    })),
    dateSent: "2025-06-08T15:30:00.000Z",
    priority: "medium"
  },
  {
    _id: "notif003",
    title: "Report Approval",
    message: "Your Monthly Accomplishment Report for May 2025 has been approved.",
    type: "success",
    sentTo: [
      {
        userId: "user001",
        userEmail: "secretary@brgy.gov.ph",
        read: true
      }
    ],
    dateSent: "2025-06-05T10:15:00.000Z",
    priority: "normal"
  },
  {
    _id: "notif004",
    title: "Document Revision Required",
    message: "Please revise your submitted BaRCO Report. Additional details needed in Section 3.",
    type: "alert",
    sentTo: [
      {
        userId: "user005",
        userEmail: "carlo.cruz@brgy.gov.ph",
        read: false
      }
    ],
    dateSent: "2025-06-07T14:20:00.000Z",
    priority: "high"
  },
  {
    _id: "notif005",
    title: "New Policy Update",
    message: "New guidelines for Barangay Full Disclosure Policy (BFDP) Reports have been released.",
    type: "info",
    sentTo: getRandomUsers(5).map(user => ({
      userId: user._id,
      userEmail: user.email,
      read: false
    })),
    dateSent: "2025-06-09T11:45:00.000Z",
    priority: "medium"
  },
  {
    _id: "notif006",
    title: "Account Status Update",
    message: "Your account has been successfully activated. You can now access all system features.",
    type: "success",
    sentTo: [
      {
        userId: "user003",
        userEmail: "pedro.garcia@brgy.gov.ph",
        read: true
      }
    ],
    dateSent: "2025-06-01T09:00:00.000Z",
    priority: "normal"
  },
  {
    _id: "notif007",
    title: "Training Session",
    message: "Mandatory online training session on new reporting system features on June 20, 2025.",
    type: "event",
    sentTo: getRandomUsers(4).map(user => ({
      userId: user._id,
      userEmail: user.email,
      read: Math.random() > 0.5
    })),
    dateSent: "2025-06-11T13:30:00.000Z",
    priority: "high"
  }
];