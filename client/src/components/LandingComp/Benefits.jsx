import React from "react";
import { motion } from "framer-motion";
import {
  FaUserTie,
  FaUsers,
  FaClock,
  FaFileAlt,
  FaChartLine,
  FaComments,
  FaDatabase,
  FaCheckCircle,
} from "react-icons/fa";

const Benefits = () => {
  const benefitsList = {
    secretary: [
      { icon: <FaClock />, text: "Reduced travel time and costs" },
      { icon: <FaFileAlt />, text: "Quick and easy document submission" },
      { icon: <FaChartLine />, text: "Real-time status updates" },
      { icon: <FaDatabase />, text: "Organized record keeping" },
    ],
    mlgoo: [
      { icon: <FaCheckCircle />, text: "Streamlined document processing" },
      { icon: <FaChartLine />, text: "Improved tracking and monitoring" },
      { icon: <FaComments />, text: "Enhanced communication" },
      { icon: <FaDatabase />, text: "Efficient record management" },
    ],
  };

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Benefits
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaUsers className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold ml-4 text-gray-800">
                For Barangay Secretaries
              </h3>
            </div>
            <div className="space-y-4">
              {benefitsList.secretary.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <div className="text-blue-600 text-xl">{benefit.icon}</div>
                  <p className="ml-4 text-gray-700">{benefit.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FaUserTie className="text-3xl text-indigo-600" />
              </div>
              <h3 className="text-2xl font-semibold ml-4 text-gray-800">
                For MLGOO Staff
              </h3>
            </div>
            <div className="space-y-4">
              {benefitsList.mlgoo.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                >
                  <div className="text-indigo-600 text-xl">{benefit.icon}</div>
                  <p className="ml-4 text-gray-700">{benefit.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
