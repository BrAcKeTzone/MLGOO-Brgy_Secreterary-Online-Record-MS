import React from "react";
import { motion } from "framer-motion";
import { 
  FaFileUpload, 
  FaChartLine, 
  FaBell, 
  FaArchive 
} from "react-icons/fa";

const features = [
  {
    title: "Digital Submission",
    description: "Submit documents electronically with ease. No more paper forms or physical submissions needed.",
    icon: <FaFileUpload className="text-blue-600" />,
    emoji: "🧾"
  },
  {
    title: "Real-Time Status Tracking",
    description: "Track your document's journey from submission to approval in real-time. Stay informed at every step.",
    icon: <FaChartLine className="text-blue-600" />,
    emoji: "🕓"
  },
  {
    title: "Approval Notifications",
    description: "Receive instant notifications when your documents are reviewed, approved, or need revisions.",
    icon: <FaBell className="text-blue-600" />,
    emoji: "✅"
  },
  {
    title: "Archive Management",
    description: "Access and manage your historical documents with our organized digital archive system.",
    icon: <FaArchive className="text-blue-600" />,
    emoji: "🗂"
  }
];

const Features = () => {
  return (
    <div id="features" className="py-20 bg-gradient-to-b from-white to-gray-50">
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
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Streamline your document management process with our comprehensive feature set
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mt-8"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
            >
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl">{feature.emoji}</span>
                <div className="text-2xl text-blue-600">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
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
