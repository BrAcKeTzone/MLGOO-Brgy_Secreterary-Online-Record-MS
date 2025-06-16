import React from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/logo1.png";

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-[calc(100vh-136px)] bg-gradient-to-r from-blue-900 via-indigo-900 to-gray-900 text-white flex items-center">
      <div className="absolute inset-0 bg-black opacity-40"></div>

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
            {/* <button
              onClick={() =>
                document
                  .getElementById("features")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="w-full sm:w-auto bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold transition duration-300 border border-white/30"
            >
              Learn More
            </button> */}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
