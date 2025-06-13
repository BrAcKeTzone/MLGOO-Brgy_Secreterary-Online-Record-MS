// filepath: d:\Projects\MyWebProjects\MLGOO and Barangay Secretaries Online Record Management System\client\src\components\Layout\NavComponents\DesktopNav.jsx
import React from "react";
import NavLink from "./NavLink";

const DesktopNav = ({ user, navItems, handleLogout }) => (
  <div className="hidden md:flex md:items-center md:space-x-6">
    {user ? (
      <>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="py-2 px-3 rounded-md transition-colors duration-200"
          >
            {item.name}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="text-gray-300 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer py-2 px-3 rounded-md"
        >
          Logout
        </button>
      </>
    ) : (
      <NavLink to="/login" className="transition-colors duration-200">
        Login
      </NavLink>
    )}
  </div>
);

export default DesktopNav;