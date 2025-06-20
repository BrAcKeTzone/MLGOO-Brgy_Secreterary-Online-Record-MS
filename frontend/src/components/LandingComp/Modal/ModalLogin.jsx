import React from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import LoginForm from "../../Auth/LoginForm";

const ModalLogin = ({
  isOpen,
  onClose,
  onForgotPasswordClick,
  onRegisterClick,
  isMobile
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, x: -50 }}
      animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, x: 0 }}
      exit={isMobile ? { opacity: 0, y: 20 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className={`${
        isMobile 
          ? "bg-black/90 h-full w-full flex flex-col justify-center" 
          : "bg-black/30 backdrop-blur-md p-8 rounded-lg shadow-xl w-full max-w-md"
      }`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100/20 z-10 text-white"
      >
        <FaTimes />
      </button>

      <div className={`${isMobile ? "px-6 py-8" : "p-6"}`}>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Login to Your Account
        </h2>

        <LoginForm />

        <div className="mt-6 space-y-2">
          <p className="text-center text-sm text-gray-300">
            Don't have an account?{" "}
            <button
              onClick={onRegisterClick}
              className="text-blue-500 hover:underline bg-transparent border-none p-0 inline cursor-pointer"
            >
              Sign up
            </button>
          </p>
          <p className="text-center text-sm text-gray-300">
            Forgot your password?{" "}
            <button
              onClick={onForgotPasswordClick}
              className="text-blue-500 hover:underline bg-transparent border-none p-0 inline cursor-pointer"
            >
              Reset it here
            </button>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ModalLogin;
