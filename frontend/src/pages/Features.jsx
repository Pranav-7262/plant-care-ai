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
      },
    },
  };

  const features = [
    {
      title: "AI-Powered Guidance",
      description:
        "Get instant plant care help with our smart AI — from watering to problem-solving.",
      iconPath: "M12 8c0-4 4-6 4-6s-4 0-4 6c0 0-4-2-4-6s4 6 4 6z",
    },
    {
      title: "Your Personal Dashboard",
      description:
        "Track your plant's health, watering schedule, and growth history — all in one place.",
      iconPath:
        "M12 3v2m0 4v10m0-10H6.5a4.5 4.5 0 000 9H12m0-9h5.5a4.5 4.5 0 010 9H12",
    },
    {
      title: "Explore Plant Library",
      description:
        "Discover plant types, care instructions, and ideal growing conditions — in a beautiful card layout.",
      iconPath:
        "M12 6v6l4 2M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z",
    },
    {
      title: "Smart Reminders",
      description:
        "Get notified when it's time to water or care for your plants — never miss a step again.",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Secure Login",
      description:
        "Log in to your personal plant care dashboard and access your data anytime, safely.",
      iconPath:
        "M12 11c1.38 0 2.5-1.12 2.5-2.5S13.38 6 12 6s-2.5 1.12-2.5 2.5S10.62 11 12 11zM4 20v-2a4 4 0 014-4h8a4 4 0 014 4v2",
    },
    {
      title: "Track Growth",
      description:
        "Keep notes, photos, and logs of your plant's journey and monitor its progress over time.",
      iconPath: "M5 13l4 4L19 7",
    },
  ];

  return (
    <section className="px-[3vw] bg-white/60 backdrop-blur-md rounded-xl text-center text-gray-800 shadow-inner justify-between items-center md:px-[3vw] lg:px-[10vw] py-[9vh] font-sans">
      <motion.h2
        className="text-4xl font-bold text-green-900 mb-14"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        Why PlantBot?
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center bg-white rounded-xl p-6 shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 cursor-pointer group"
            variants={itemVariants}
          >
            <div className="bg-gray-100 p-5 rounded-full mb-4 transition-all duration-300 group-hover:bg-green-100">
              <svg
                className="w-8 h-8 text-green-800 group-hover:text-green-900 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={feature.iconPath}
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-900 group-hover:text-green-800 transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-gray-600 mt-2 max-w-xs">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;
