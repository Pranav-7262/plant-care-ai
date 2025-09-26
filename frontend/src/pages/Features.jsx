import React from "react";
import { motion } from "framer-motion";

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 10,
      },
    },
  };

  // Updated feature data with better, descriptive SVG icon paths (Lucide-like)
  const features = [
    {
      title: "AI-Powered Guidance",
      description:
        "Get instant plant care help with our smart AI — from watering to problem-solving. Your personalized botanical expert.",
      // Icon: Bot
      iconPath:
        "M12 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zM18 10v4c0 1.66-1.34 3-3 3h-6c-1.66 0-3-1.34-3-3v-4",
    },
    {
      title: "Your Personal Dashboard",
      description:
        "Track your plant's health, watering schedule, and growth history — all in one clean, centralized place.",
      // Icon: Layout Dashboard
      iconPath: "M3 3h18v18H3zM9 12h6M9 8h2",
    },
    {
      title: "Explore Plant Library",
      description:
        "Discover plant types, detailed care instructions, and ideal growing conditions in a beautiful, searchable collection.",
      // Icon: Library
      iconPath:
        "M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM9 20h6",
    },
    {
      title: "Smart Reminders",
      description:
        "Get automated notifications when it's time to water, fertilize, or mist your plants — never miss a beat again.",
      // Icon: Alarm Clock
      iconPath: "M10 6L6 2v4M18 6L22 2v4M12 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    },
    {
      title: "Secure Data & Login",
      description:
        "Log in to your personal plant care dashboard and access your data anytime, safely, with industry-standard encryption.",
      // Icon: Lock
      iconPath:
        "M12 2a4 4 0 0 0-4 4v2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-4V6a4 4 0 0 0-4-4z",
    },
    {
      title: "Comprehensive Growth Tracking",
      description:
        "Keep notes, photos, and logs of your plant's journey to monitor its progress and identify patterns over time.",
      // Icon: Trending Up/Chart
      iconPath: "M16 4h4v4M16 4L9 11M3 20l4-4 4 4 4-4 7 7",
    },
  ];

  return (
    <section className="bg-gray-50/90 backdrop-blur-sm px-4 md:px-8 lg:px-16 py-20 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <motion.h2
          className="text-5xl font-extrabold text-center text-green-800 mb-6 tracking-tight"
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          Why Choose PlantCareAI?
        </motion.h2>
        <motion.p
          className="text-center text-xl text-gray-600 mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Your plants deserve the best. We combine smart technology with expert
          botanical knowledge to make gardening easy and rewarding.
        </motion.p>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center bg-white rounded-3xl p-8 shadow-xl border border-gray-100/50 
                         hover:shadow-2xl hover:shadow-green-200/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
              variants={itemVariants}
            >
              {/* Icon Container */}
              <div className="bg-green-50 p-5 rounded-full mb-6 shadow-md transition-all duration-300 group-hover:bg-green-100">
                <svg
                  className="w-9 h-9 text-green-700 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={feature.iconPath}
                  />
                </svg>
              </div>

              {/* Title and Description */}
              <h3 className="text-xl font-bold text-green-800 group-hover:text-green-700 transition-colors duration-300 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
