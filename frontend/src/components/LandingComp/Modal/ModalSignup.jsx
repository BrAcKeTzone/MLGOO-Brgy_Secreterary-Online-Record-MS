import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import SignupForm from "../../Auth/SignupForm";

const ModalSignup = ({
  isOpen,
  onClose,
  onLoginClick,
  isMobile,
  onSignupSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, x: 50 }}
      animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
      exit={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className={`${
        isMobile
          ? "bg-black/90 h-full w-full flex flex-col justify-center overflow-y-auto"
          : "bg-black/30 backdrop-blur-md p-8 rounded-lg shadow-xl w-full max-w-md"
      }`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100/20 z-10 text-white"
      >
        <FaTimes />
      </button>

      <div
        className={`${isMobile ? "px-6 py-8" : "p-6"} ${
          isMobile ? "overflow-y-auto" : ""
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Create an Account
        </h2>

        <SignupForm
          onLoginClick={onLoginClick}
          onSignupSuccess={onSignupSuccess}
        />

        <div className="mt-6">
          <p className="text-center text-sm text-gray-300">
            Already have an account?{" "}
            <button
              onClick={onLoginClick}
              className="text-blue-500 hover:underline bg-transparent border-none p-0 inline cursor-pointer"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ModalSignup;
