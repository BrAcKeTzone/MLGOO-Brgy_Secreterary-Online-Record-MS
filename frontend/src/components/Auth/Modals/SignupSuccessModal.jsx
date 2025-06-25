import React from "react";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

const SignupSuccessModal = ({ onClose }) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-[100]"
        style={{
          opacity: 0.5,
        }}
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-[100]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white p-10 rounded-lg shadow-xl w-[90%] max-w-lg mx-auto"
        >
          <div className="text-center">
            <FaCheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Account Created Successfully!
            </h3>
            <p className="text-lg text-gray-700 mb-8">
              Your account has been created and is pending approval from the
              administrator. You will receive an email once your account is
              approved.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white text-lg py-4 px-6 rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              Okay
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SignupSuccessModal;
