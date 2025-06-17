import React from "react";
import { motion } from "framer-motion";
import logo1 from "../../assets/logo1.png";

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-900 via-indigo-900 to-gray-900 flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Logo background */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          backgroundImage: `url(${logo1})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.2,
        }}
      ></div>

      {/* Loading Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center"
      >
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-xl text-white font-medium">{message}</div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;