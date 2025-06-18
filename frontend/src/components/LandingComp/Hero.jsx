import React from "react";
import { motion } from "framer-motion";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/logo1.png";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-900 via-indigo-900 to-gray-900 text-white flex items-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Logo background - Updated to match AuthLayout */}
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
          <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-3xl mx-auto">
            Digitizing local governance for the Municipality of Tabina,
            Zamboanga del Sur
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            {/* Login Button */}
            <motion.button
              onClick={() => navigate("/login")}
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
              onClick={() => navigate("/signup")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="group relative inline-flex items-center justify-center px-8 py-3 sm:py-4 overflow-hidden font-medium text-blue-600 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-out hover:text-white min-w-[160px]"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-100"></span>
              <span className="absolute w-full h-full transition-all duration-300 ease-out transform translate-y-full rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 group-hover:translate-y-0"></span>
              <FaUserPlus className="mr-2 text-lg relative z-10" />
              <span className="relative z-10">Sign Up</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
