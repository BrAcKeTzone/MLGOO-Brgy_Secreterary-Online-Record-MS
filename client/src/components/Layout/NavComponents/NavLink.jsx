import React from "react";
import { Link } from "react-router-dom";

const NavLink = ({ to, children, className = "", onClick }) => (
  <Link
    to={to}
    className={`hover:text-gray-300 ${className}`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default NavLink;
