import React from "react";
import { motion } from "framer-motion";
import logo1 from "../../assets/logo1.png";

const AuthLayout = ({ children, title }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-900 via-indigo-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-xl"
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-white">
            {title}
          </h1>
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
