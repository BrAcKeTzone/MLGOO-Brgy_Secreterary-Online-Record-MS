import React from "react";
import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import MenuButton from "./MenuButton";

const MobileNav = ({ isOpen, user, navItems, handleToggle, handleLogout }) => {
  const location = useLocation();

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
          <span className="text-xl font-bold">Menu</span>
          <MenuButton isOpen={true} onClick={handleToggle} />
        </div>
        <div className="flex flex-col px-4 py-4 space-y-2">
          <NavLink
            to="/"
            className="block px-3 py-2 rounded-md hover:bg-gray-800"
            onClick={() => handleToggle(false)}
          >
            Home
          </NavLink>
          {user ? (
            <>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                    location.pathname === item.path
                      ? "bg-gray-800 text-blue-400"
                      : "hover:bg-gray-800"
                  }`}
                  onClick={() => handleToggle(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="block px-3 py-2 rounded-md hover:bg-gray-800"
                onClick={() => handleToggle(false)}
              >
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => handleToggle(false)}
        />
      )}
    </>
  );
};

export default MobileNav;
