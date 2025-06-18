export const optionsRoles = [
  { 
    _id: "BARANGAY_SECRETARY", 
    name: "Barangay Secretary",
    routes: [
      { path: "/home", name: "Dashboard" },
      { path: "/submit-report", name: "Submit Report" },
      { path: "/my-reports", name: "My Reports" },
      { path: "/notifications", name: "Notifications" },
      { path: "/profile", name: "Profile" }
    ]
  },
  { 
    _id: "MLGOO_STAFF", 
    name: "MLGOO Staff",
    routes: [
      { path: "/dashboard", name: "Dashboard" },
      { path: "/manage-users", name: "Manage Users" },
      { path: "/manage-documents", name: "Manage Documents" },
      { path: "/notifications", name: "Notifications" },
      { path: "/logs", name: "Logs" },
      { path: "/profile", name: "Profile" },
      { path: "/settings", name: "Settings" }
    ]
  }
];