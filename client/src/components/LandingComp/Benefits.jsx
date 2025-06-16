import React from "react";
import { motion } from "framer-motion";
import {
  FaUserFriends,
  FaFileUpload,
  FaChartLine,
  FaDesktop,
  FaComments,
  FaTasks,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";

const benefitsList = {
  secretary: [
    {
      icon: <FaFileUpload />,
      emoji: "📥",
      title: "Easy Online Submission",
      text: "Submit reports digitally in just a few clicks - no more paper forms.",
    },
    {
      icon: <FaUserFriends />,
      emoji: "📦",
      title: "Save Time & Resources",
      text: "Spend more time on community initiatives instead of paperwork.",
    },
    {
      icon: <FaChartLine />,
      emoji: "📶",
      title: "Real-Time Tracking",
      text: "Get instant status updates — no need to follow up.",
    },
  ],
  mlgoo: [
    {
      icon: <FaDesktop />,
      emoji: "📑",
      title: "Streamlined Document Flow",
      text: "Review and approve submissions faster than ever.",
    },
    {
      icon: <FaTasks />,
      emoji: "🛰️",
      title: "Improved Monitoring",
      text: "Monitor all barangay activities from one dashboard.",
    },
    {
      icon: <FaComments />,
      emoji: "💬",
      title: "Enhanced Communication",
      text: "Collaborate with barangays without physical meetings.",
    },
  ],
};

const BenefitCard = ({ data, type }) => {
  const isSecretary = type === "secretary";
  const bgColor = isSecretary ? "bg-blue-50" : "bg-indigo-50";
  const iconColor = isSecretary ? "text-blue-600" : "text-indigo-600";
  const hoverBg = isSecretary ? "hover:bg-blue-100" : "hover:bg-indigo-100";

  return (
    <motion.div
      initial={{ opacity: 0, x: isSecretary ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      <div className={`flex items-center p-6 ${bgColor}`}>
        <div className="text-4xl mr-4">{data[0].emoji}</div>
        <h3 className="text-2xl font-semibold text-gray-800">
          {type === "secretary"
            ? "For Barangay Secretaries"
            : "For MLGOO Staff"}
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {data.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg ${hoverBg} transition-all duration-200 transform hover:scale-105`}
          >
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">{benefit.emoji}</span>
              <div className={`text-xl ${iconColor}`}>{benefit.icon}</div>
              <h4 className="text-lg font-semibold text-gray-800 ml-3">
                {benefit.title}
              </h4>
            </div>
            <p className="text-gray-600 ml-12">{benefit.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Benefits = () => {
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
              Transform Your Workflow
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Experience the benefits of our digital record management system
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-8"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BenefitCard data={benefitsList.secretary} type="secretary" />
          <BenefitCard data={benefitsList.mlgoo} type="mlgoo" />
        </div>
      </div>
    </div>
  );
};

export default Benefits;
