import React, { useRef } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { motion } from "framer-motion";
import {
  FaFileAlt,
  FaChartLine,
  FaShieldAlt,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

const Landing = () => {
  const navigate = useNavigate(); // Add this hook
  const featuresRef = useRef(null);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stats = [
    {
      icon: <FaClock />,
      stat: "75%",
      label: "Faster Processing",
      color: "bg-blue-100",
    },
    {
      icon: <FaChartLine />,
      stat: "90%",
      label: "Reduced Travel",
      color: "bg-green-100",
    },
    {
      icon: <FaFileAlt />,
      stat: "100%",
      label: "Digital Records",
      color: "bg-purple-100",
    },
    {
      icon: <FaShieldAlt />,
      stat: "24/7",
      label: "System Access",
      color: "bg-orange-100",
    },
  ];

  const features = [
    {
      title: "Digital Submission",
      description:
        "Submit and manage documents electronically, eliminating the need for physical paperwork",
      icon: <FaFileAlt className="text-blue-600" />,
    },
    {
      title: "Real-time Tracking",
      description:
        "Monitor document status and receive instant updates on submissions and approvals",
      icon: <FaChartLine className="text-blue-600" />,
    },
    {
      title: "Secure Storage",
      description:
        "Safe and organized storage of all municipal records with easy retrieval",
      icon: <FaShieldAlt className="text-blue-600" />,
    },
  ];

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-gray-900 text-white py-32">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('path/to/pattern.svg')",
            opacity: 0.1,
          }}
        ></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
              <button 
                onClick={handleGetStarted}
                className="w-full sm:w-auto group bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition duration-300 flex items-center justify-center gap-2"
              >
                Get Started
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToFeatures}
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition duration-300 border border-white/30"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
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
                <div
                  className={`inline-flex p-4 rounded-full ${item.color} mb-4`}
                >
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

      {/* Features Section - Enhanced with Icons and Better Cards */}
      <div ref={featuresRef} className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={fadeIn}
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

      {/* Mission Section - Enhanced with Background Effect */}
      <div className="py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('path/to/pattern.svg')] opacity-10"
          style={{ backgroundSize: "30px" }}
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

      {/* Benefits Section */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                For Barangay Secretaries
              </h3>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Reduced travel time and costs</li>
                <li>Quick and easy document submission</li>
                <li>Real-time status updates</li>
                <li>Organized record keeping</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">For MLGOO Staff</h3>
              <ul className="list-disc pl-5 text-gray-600">
                <li>Streamlined document processing</li>
                <li>Improved tracking and monitoring</li>
                <li>Enhanced communication</li>
                <li>Efficient record management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; 2025 MLGOO ORMS. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
