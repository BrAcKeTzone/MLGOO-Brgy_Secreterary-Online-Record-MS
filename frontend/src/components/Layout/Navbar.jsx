import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { optionsRoles } from "../../data/options/optionsRoles";
import DesktopNav from "./NavComponents/DesktopNav";
import MobileNav from "./NavComponents/MobileNav";
import MenuButton from "./NavComponents/MenuButton";
import LogoutModal from "./NavComponents/LogoutModal";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuthStore();

  const handleToggle = () => setMenuOpen((prev) => !prev);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setMenuOpen(false);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const getNavItems = () => {
    if (!user) return [];
    const roleData = optionsRoles.find((role) => role._id === user.role);
    return roleData ? roleData.routes : [];
  };

  const navItems = getNavItems();

  return (
    <>
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
              handleLogout={handleLogoutClick}
            />
          </div>
        </div>

        <MobileNav
          isOpen={menuOpen}
          user={user}
          navItems={navItems}
          handleToggle={handleToggle}
          handleLogout={handleLogoutClick}
        />
      </nav>

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </>
  );
};

export default Navbar;
