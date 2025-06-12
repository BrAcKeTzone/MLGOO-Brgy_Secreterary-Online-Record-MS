export const sampleRoles = [
  { 
    _id: "role001", 
    name: "Barangay Secretary",
    routes: [
      { path: "/", name: "Home" },
      { path: "/submit-report", name: "Submit Report" },
      { path: "/my-reports", name: "My Reports" },
      { path: "/notifications", name: "Notifications" },
      { path: "/profile", name: "Profile" }
    ]
  },
  { 
    _id: "role002", 
    name: "MLGOO Staff",
    routes: [
      { path: "/dashboard", name: "Dashboard" },
      { path: "/manage-users", name: "Manage Users" },
      { path: "/manage-documents", name: "Manage Documents" },
      { path: "/notifications", name: "Notifications" },
      { path: "/logs", name: "Logs" },
      { path: "/profile", name: "Profile" }
    ]
  }
];