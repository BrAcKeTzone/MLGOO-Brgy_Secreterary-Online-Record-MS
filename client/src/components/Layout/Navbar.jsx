import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { sampleRoles } from "../../data/sampleRoles";
import DesktopNav from "./NavComponents/DesktopNav";
import MobileNav from "./NavComponents/MobileNav";
import MenuButton from "./NavComponents/MenuButton";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const handleToggle = () => setMenuOpen((prev) => !prev);
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const getNavItems = () => {
    if (!user) return [];
    const roleData = sampleRoles.find((role) => role._id === user.role);
    return roleData ? roleData.routes : [];
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold">
            MLGOO ORMS
          </Link>

          <div className="flex md:hidden">
            <MenuButton isOpen={menuOpen} onClick={handleToggle} />
          </div>

          <DesktopNav
            user={user}
            navItems={navItems}
            handleLogout={handleLogout}
          />
        </div>
      </div>

      <MobileNav
        isOpen={menuOpen}
        user={user}
        navItems={navItems}
        handleToggle={handleToggle}
        handleLogout={handleLogout}
      />
    </nav>
  );
};

export default Navbar;
