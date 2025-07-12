import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import heroImage from "../../assets/logo1.png";
import ModalLogin from "./Modal/ModalLogin";
import ModalSignup from "./Modal/ModalSignup";
import ModalForgotPass from "./Modal/ModalForgotPass";
import SignupSuccessModal from "../Auth/Modals/SignupSuccessModal";

const Hero = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
    setShowForgotPass(false);
  };

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowLogin(false);
    setShowForgotPass(false);
  };

  const handleForgotPassClick = () => {
    setShowForgotPass(true);
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleBackToLogin = () => {
    setShowLogin(true);
    setShowForgotPass(false);
  };

  const handleClose = () => {
    setShowLogin(false);
    setShowSignup(false);
    setShowForgotPass(false);
    setShowSignupSuccess(false);
  };

  const handleSignupSuccess = () => {
    setShowSignup(false);
    setShowSignupSuccess(true);
  };

  const handleSuccessModalClose = () => {
    setShowSignupSuccess(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-900 via-indigo-900 to-gray-900 text-white flex items-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Logo background */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.2,
        }}
      ></div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            MLGOO and Barangay Secretaries
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text">
              Online Record Management System
            </span>
          </h1>
          {/* <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto">
            Digitizing local governance for the Municipality of Tabina,
            Zamboanga del Sur
          </p> */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            {/* Login Button */}
            <motion.button
              onClick={handleLoginClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center justify-center px-8 py-3 sm:py-4 overflow-hidden font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-out hover:from-blue-700 hover:to-blue-800 min-w-[160px]"
            >
              <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
              <FaSignInAlt className="mr-2 text-lg" />
              <span className="relative">Login</span>
            </motion.button>

            {/* Signup Button */}
            <motion.button
              onClick={handleSignupClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center justify-center px-8 py-3 sm:py-4 overflow-hidden font-medium text-blue-600 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-out hover:text-white min-w-[160px]"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-100"></span>
              <span className="absolute w-full h-full transition-all duration-300 ease-out transform translate-y-full rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 group-hover:translate-y-0"></span>
              <FaUserPlus className="mr-2 text-lg relative z-10" />
              <span className="relative z-10">Register</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Modal components with responsive positioning */}
      <AnimatePresence>
        {showLogin && (
          <div
            className={`fixed z-50 pointer-events-none ${
              isMobile
                ? "inset-0 flex items-center justify-center overflow-y-auto"
                : "inset-y-0 left-0 flex items-center md:pl-6 pl-2"
            }`}
          >
            <div
              className={`pointer-events-auto ${
                isMobile ? "w-full h-full" : "w-full max-w-md"
              }`}
            >
              <ModalLogin
                onClose={handleClose}
                onForgotPasswordClick={handleForgotPassClick}
                onRegisterClick={handleSignupClick}
                isOpen={showLogin}
                isMobile={isMobile}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSignup && (
          <div
            className={`fixed z-50 pointer-events-none ${
              isMobile
                ? "inset-0 flex items-center justify-center overflow-y-auto"
                : "inset-y-0 right-0 flex items-center md:pr-6 pr-2"
            }`}
          >
            <div
              className={`pointer-events-auto ${
                isMobile
                  ? "w-full h-full"
                  : "w-full max-w-md max-h-screen overflow-y-auto"
              }`}
            >
              <ModalSignup
                onClose={handleClose}
                onLoginClick={handleLoginClick}
                isOpen={showSignup}
                isMobile={isMobile}
                onSignupSuccess={handleSignupSuccess}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSignupSuccess && (
          <div className="fixed z-50 inset-0 overflow-y-auto pointer-events-none">
            <div className="flex items-center justify-center min-h-screen pointer-events-auto">
              <SignupSuccessModal onClose={handleSuccessModalClose} />
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForgotPass && (
          <div
            className={`fixed z-50 pointer-events-none ${
              isMobile
                ? "inset-0 flex items-center justify-center overflow-y-auto"
                : "inset-0 flex items-center justify-center"
            }`}
          >
            <div
              className={`pointer-events-auto ${
                isMobile ? "w-full h-full" : "w-full max-w-md"
              }`}
            >
              <ModalForgotPass
                onClose={handleClose}
                onBackToLogin={handleBackToLogin}
                isOpen={showForgotPass}
                isMobile={isMobile}
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;
