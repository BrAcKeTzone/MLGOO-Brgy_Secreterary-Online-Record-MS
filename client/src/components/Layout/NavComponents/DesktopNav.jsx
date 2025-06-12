// filepath: d:\Projects\MyWebProjects\MLGOO and Barangay Secretaries Online Record Management System\client\src\components\Layout\NavComponents\DesktopNav.jsx
import React from "react";
import NavLink from "./NavLink";

const DesktopNav = ({ user, navItems, handleLogout }) => (
  <div className="hidden md:flex md:items-center md:space-x-6">
    {user ? (
      <>
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path}>
            {item.name}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="hover:text-gray-300 bg-transparent border-none cursor-pointer"
        >
          Logout
        </button>
      </>
    ) : (
      <NavLink to="/login">Login</NavLink>
    )}
  </div>
);

export default DesktopNav;