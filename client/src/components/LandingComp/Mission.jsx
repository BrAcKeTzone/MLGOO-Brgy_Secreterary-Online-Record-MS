import React from "react";
import { motion } from "framer-motion";
import tabinaLogo from "../../assets/tabina.png";

const Mission = () => {
  return (
    <div className="relative py-20 bg-gradient-to-br from-blue-900 to-indigo-900 text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundSize: "30px" }}
      ></div>

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          backgroundImage: `url(${tabinaLogo})`,
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          opacity: 0.15,
          filter: "brightness(150%)",
        }}
      ></div>

      <div className="container relative z-20 mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-8">Our Mission</h2>
          <p className="text-xl leading-relaxed text-blue-100">
            Empowering local communities through seamless governance by
            providing an efficient and accessible digital platform that
            strengthens collaboration between barangay secretaries and MLGOO
            staff, fostering enhanced public service and community development
            in Tabina, Zamboanga del Sur.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Mission;
