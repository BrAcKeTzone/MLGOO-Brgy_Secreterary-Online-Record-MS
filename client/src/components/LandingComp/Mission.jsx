import React from 'react';
import { motion } from 'framer-motion';

const Mission = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{ backgroundSize: '30px' }}
      ></div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl leading-relaxed text-blue-100">
            To revolutionize local governance by providing an efficient,
            accessible, and user-friendly digital platform that streamlines
            document management between barangay secretaries and MLGOO staff,
            ultimately contributing to better public service delivery in
            Tabina, Zamboanga del Sur.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Mission;