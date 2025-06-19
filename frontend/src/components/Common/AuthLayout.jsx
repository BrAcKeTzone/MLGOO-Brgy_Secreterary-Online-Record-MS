import React from "react";
import { motion } from "framer-motion";

const AuthLayout = ({ children, title }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-900 to-indigo-900  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

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
