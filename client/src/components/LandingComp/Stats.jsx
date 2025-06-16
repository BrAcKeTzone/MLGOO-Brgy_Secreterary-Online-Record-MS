import React from 'react';
import { motion } from 'framer-motion';
import { FaFileAlt, FaChartLine, FaShieldAlt, FaClock } from 'react-icons/fa';

const stats = [
  { icon: <FaClock />, stat: "75%", label: "Faster Processing", color: "bg-blue-100" },
  { icon: <FaChartLine />, stat: "90%", label: "Reduced Travel", color: "bg-green-100" },
  { icon: <FaFileAlt />, stat: "100%", label: "Digital Records", color: "bg-purple-100" },
  { icon: <FaShieldAlt />, stat: "24/7", label: "System Access", color: "bg-orange-100" }
];

const Stats = () => {
  return (
    <div className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 -mt-32 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className={`inline-flex p-4 rounded-full ${item.color} mb-4`}>
                <div className="text-3xl text-blue-600">{item.icon}</div>
              </div>
              <p className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                {item.stat}
              </p>
              <p className="text-gray-600 font-medium">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;