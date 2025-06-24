import React, { useState } from "react";
import {
  FaFacebook,
  FaEnvelope,
  FaShieldAlt,
  FaFileContract,
} from "react-icons/fa";
import Modal from "../Common/ModalPPandTOS";

const Footer = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Contact Links */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:mlgoo.office@example.com"
              className="hover:text-blue-400 transition-colors flex items-center group"
            >
              <FaEnvelope className="mr-2 group-hover:scale-110 transition-transform" />
              Contact
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://www.facebook.com/LGUExample"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center group"
            >
              <FaFacebook className="mr-2 group-hover:scale-110 transition-transform" />
              Facebook
            </a>
          </div>

          {/* Center: Copyright */}
          <p className="text-sm text-gray-400 order-3 sm:order-2">
            &copy; {new Date().getFullYear()} MLGOO ORMS. All Rights Reserved.
          </p>

          {/* Right: Legal Links - Updated with icons */}
          <div className="flex items-center gap-4 order-2 sm:order-3">
            <button
              onClick={() => openModal("privacy")}
              className="text-sm hover:text-blue-400 transition-colors flex items-center group"
            >
              <FaShieldAlt className="mr-2 group-hover:scale-110 transition-transform" />
              Privacy
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => openModal("terms")}
              className="text-sm hover:text-blue-400 transition-colors flex items-center group"
            >
              <FaFileContract className="mr-2 group-hover:scale-110 transition-transform" />
              Terms
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} type={modalType} />
    </footer>
  );
};

export default Footer;
