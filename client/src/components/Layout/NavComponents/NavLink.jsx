import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavLink = ({ to, children, className = "", onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`transition-colors duration-200 ${
        isActive
          ? "text-blue-400 hover:text-blue-300"
          : "text-gray-300 hover:text-white"
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;
