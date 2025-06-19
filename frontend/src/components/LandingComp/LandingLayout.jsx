import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSignInAlt, FaUserPlus, FaTimes } from "react-icons/fa";
import heroImage from "../../assets/logo1.png";
import Login from "../../pages/Login";
import Signup from "../../pages/Signup";
import ForgotPass from "../../pages/ForgotPass";

const LandingLayout = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
    setShowForgotPass(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
    setShowForgotPass(false);
  };

  const handleForgotPassClick = () => {
    setShowForgotPass(true);
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleClose = () => {
    setShowLogin(false);
    setShowRegister(false);
    setShowForgotPass(false);
  };

  const handleBackToLogin = () => {
    setShowLogin(true);
    setShowForgotPass(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-900 relative overflow-hidden">
      {/* Container for the main content and sliding panels */}
      <div className="flex w-full h-screen relative">
        {/* Login Panel */}
        <AnimatePresence>
          {showLogin && (
            <motion.div
              className={`absolute top-0 ${
                isMobile ? "inset-0 w-full" : "left-0 w-1/2"
              } h-full bg-white shadow-lg z-20`}
              initial={{
                x: isMobile ? "0" : "-100%",
                opacity: isMobile ? 0 : 1,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: isMobile ? "0" : "-100%",
                opacity: isMobile ? 0 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <button
                onClick={handleClose}
                className={`absolute top-4 ${
                  isMobile ? "right-4" : "right-4"
                } p-2 rounded-full hover:bg-gray-100 z-50`}
              >
                <FaTimes className="text-gray-600 text-xl" />
              </button>
              <div className="h-full">
                {/* <LoginComponent /> */}
                <Login
                  onForgotPasswordClick={handleForgotPassClick}
                  onRegisterClick={handleRegisterClick}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Password Panel */}
        <AnimatePresence>
          {showForgotPass && (
            <motion.div
              className={`absolute top-0 ${
                isMobile ? "inset-0 w-full" : "left-0 w-1/2"
              } h-full bg-white shadow-lg z-20`}
              initial={{
                x: isMobile ? "0" : "-100%",
                opacity: isMobile ? 0 : 1,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: isMobile ? "0" : "-100%",
                opacity: isMobile ? 0 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <button
                onClick={handleClose}
                className={`absolute top-4 ${
                  isMobile ? "right-4" : "right-4"
                } p-2 rounded-full hover:bg-gray-100 z-50`}
              >
                <FaTimes className="text-gray-600 text-xl" />
              </button>
              <div className="h-full">
                <ForgotPass onBackToLogin={handleBackToLogin} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content container */}
        <motion.div
          className="flex items-center justify-center w-full h-full"
          animate={
            isMobile
              ? { width: "100%" }
              : {
                  width:
                    showLogin || showRegister || showForgotPass
                      ? "50%"
                      : "100%",
                  marginLeft: showLogin || showForgotPass ? "50%" : "0%",
                  marginRight: showRegister ? "50%" : "0%",
                }
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          style={{
            display:
              isMobile && (showLogin || showRegister || showForgotPass)
                ? "none"
                : "flex",
          }}
        >
          {/* Background Image Layer */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.15,
            }}
          ></div>

          {/* Foreground Content */}
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                MLGOO and Barangay Secretaries
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 text-transparent bg-clip-text drop-shadow-lg">
                  Online Record Management System
                </span>
              </h1>
              <p className="text-lg md:text-2xl mb-12 text-white max-w-3xl mx-auto drop-shadow">
                Digitizing local governance for the Municipality of Tabina,
                Zamboanga del Sur
              </p>
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

                {/* Register Button */}
                <motion.button
                  onClick={handleRegisterClick}
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
        </motion.div>

        {/* Register Panel - Right Side */}
        <AnimatePresence>
          {showRegister && (
            <motion.div
              className={`absolute top-0 ${
                isMobile ? "inset-0 w-full" : "right-0 w-1/2"
              } h-full bg-white shadow-lg z-20`}
              initial={{
                x: isMobile ? "0" : "100%",
                opacity: isMobile ? 0 : 1,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: isMobile ? "0" : "100%",
                opacity: isMobile ? 0 : 1,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <button
                onClick={handleClose}
                className={`absolute top-4 ${
                  isMobile ? "right-4" : "left-4"
                } p-2 rounded-full hover:bg-gray-100 z-50`}
              >
                <FaTimes className="text-gray-600 text-xl" />
              </button>
              <div className="h-full">
                <Signup onLoginClick={handleLoginClick} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LandingLayout;
