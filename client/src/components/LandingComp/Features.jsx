import React from 'react';
import { motion } from 'framer-motion';
import { FaFileAlt, FaChartLine, FaShieldAlt } from 'react-icons/fa';

const features = [
  {
    title: "Digital Submission",
    description: "Submit and manage documents electronically, eliminating the need for physical paperwork",
    icon: <FaFileAlt className="text-blue-600" />
  },
  {
    title: "Real-time Tracking",
    description: "Monitor document status and receive instant updates on submissions and approvals",
    icon: <FaChartLine className="text-blue-600" />
  },
  {
    title: "Secure Storage",
    description: "Safe and organized storage of all municipal records with easy retrieval",
    icon: <FaShieldAlt className="text-blue-600" />
  }
];

const Features = () => {
  return (
    <div id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              Key Features
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
            >
              <div className="mb-6 text-4xl">{feature.icon}</div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;