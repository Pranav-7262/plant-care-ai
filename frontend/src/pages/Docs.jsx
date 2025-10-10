import React from "react";
import {
  Brain,
  LayoutDashboard,
  Leaf,
  BellRing,
  Lock,
  LineChart,
} from "lucide-react";
import BackButton from "../components/BackButton";

// Define the core feature data
const features = [
  {
    icon: Brain,
    title: "AI-Powered Guidance Engine",
    description:
      "Our smart AI uses vast botanical knowledge to instantly diagnose plant problems and provide **step-by-step solutions**. It's like having a plant expert in your pocket, ready to offer advice on watering, pests, and light.",
    color: "text-green-700 bg-green-100",
  },
  {
    icon: LayoutDashboard,
    title: "Centralized User Dashboard",
    description:
      "The dashboard provides a simple, clean interface to manage your entire plant collection. **Quickly check their health status, view upcoming tasks**, and access all your plant records from one easy-to-use place.",
    color: "text-blue-700 bg-blue-100",
  },
  {
    icon: Leaf,
    title: "Comprehensive Plant Library",
    description:
      "Access our detailed and continuously updated database featuring thousands of species. Find **verified care instructions, ideal growth parameters, and regional suitability** information to ensure optimal plant health.",
    color: "text-amber-700 bg-amber-100",
  },
  {
    icon: BellRing,
    title: "Proactive Smart Reminders",
    description:
      "Utilize our smart notification system to schedule and receive automated reminders for critical tasks such as **watering cycles, nutrient application, and preventative treatment**. Customize alerts based on specific plant needs.",
    color: "text-indigo-700 bg-indigo-100",
  },
  {
    icon: LineChart,
    title: "Longitudinal Growth Tracking",
    description:
      "Document and analyze your plant's development over time. Features include timestamped notes, photographic logs, and a history timeline to **monitor progress, identify environmental patterns, and confirm care efficacy**.",
    color: "text-pink-700 bg-pink-100",
  },
  {
    icon: Lock,
    title: "Secure Data & Authentication",
    description:
      "Your botanical data is protected using **industry-standard end-to-end encryption**. Secure login protocols ensure private access to your personalized plant care history and management tools at all times.",
    color: "text-gray-700 bg-gray-100",
  },
];

const Docs = () => {
  return (
    // Main container with professional, minimal background
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      {/* --- Document Header --- */}
      <div className="max-w-7xl mx-auto border-b border-gray-200 pb-8 mb-12">
        <p className="text-sm font-medium text-green-600 uppercase tracking-widest">
          DOCUMENTATION
        </p>
        <h1 className="mt-1 text-5xl font-extrabold tracking-tight text-gray-900">
          PlantCareAi Documentation
        </h1>
      </div>

      {/* --- Section: How It Works --- */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-green-500 pl-3">
          How It Works: Simplifying Plant Care
        </h2>
        <div className="bg-gray-50 p-6 rounded-xl shadow-inner border border-gray-100">
          <p className="text-lg text-gray-700 mb-4">
            PlantCareAi is designed to be your intuitive partner in gardening.
            We focus on making expert care simple and accessible.
          </p>
          <ol className="list-decimal list-inside space-y-3 text-gray-600 ml-4">
            <li>
              <span className="font-semibold text-gray-800">
                Smart AI Assistant (Plant Bot):
              </span>{" "}
              Ask anything about your plant’s health, care, or needs—Plant Bot
              delivers instant, expert guidance tailored just for you.
            </li>

            <li>
              <span className="font-semibold text-gray-800">
                Manage Your Collection:
              </span>{" "}
              Our system organizes your plants into a simple list, allowing you
              to update care logs and schedule future actions with a few taps.
            </li>
            <li>
              <span className="font-semibold text-gray-800">
                Receive Automated Alerts:
              </span>{" "}
              Our Smart Reminders track your schedule and push timely
              notifications, ensuring watering and fertilizing happen exactly
              when needed.
            </li>
            <li>
              <span className="font-semibold text-gray-800">
                Review and Improve:
              </span>{" "}
              Use the tracking tools to look back at your plant's history, learn
              from past care, and continuously improve your results.
            </li>
          </ol>
        </div>
      </div>

      {/* --- Section: Key Features --- */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-green-500 pl-3">
          Key Features: System Capabilities
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${feature.color} mb-4`}
              >
                <feature.icon className="w-6 h-6" aria-hidden="true" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto text-center mt-20 pt-10 border-t border-gray-200">
        <p className="text-2xl font-semibold text-gray-800 mb-4">
          Ready to experience hassle-free plant care?
        </p>
        <a
          href="/auth"
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-green-600 hover:bg-green-700 transition-colors transform hover:scale-[1.02]"
        >
          Access PlantCareAi
        </a>
      </div>
      <a
        href="/"
        className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium transition-colors duration-200 underline underline-offset-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to home page
      </a>
    </div>
  );
};

export default Docs;
