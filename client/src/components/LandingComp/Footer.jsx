import React, { useState } from "react";
import { FaFacebook, FaEnvelope } from "react-icons/fa";
import Modal from "./ModalPPandTOS";

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
    <div className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-6 text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <a
            href="mailto:mlgoo.office@example.com"
            className="hover:text-blue-300 transition-colors"
          >
            <FaEnvelope className="inline-block mr-2" />
            Contact Us
          </a>
          <a
            href="https://www.facebook.com/LGUExample"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition-colors"
          >
            <FaFacebook className="inline-block mr-2" />
            LGU Facebook Page
          </a>
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => openModal("privacy")}
            className="hover:text-blue-300 transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => openModal("terms")}
            className="hover:text-blue-300 transition-colors"
          >
            Terms of Service
          </button>
        </div>
        <p>
          &copy; {new Date().getFullYear()} MLGOO ORMS. All rights reserved.
        </p>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} type={modalType} />
    </div>
  );
};

export default Footer;
