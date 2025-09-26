import React from "react";
import { Link } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { TypeAnimation } from "react-type-animation";
import Features from "./Features";
import TestimonialsSection from "../components/TestimonialsSection"; // Import the new component
import { Sprout } from "lucide-react"; // Importing an icon for the brand

import plant from "../assets/plant.jpg";

const Home = () => {
  return (
    <div className="bg-white min-h-screen font-sans">
      <section className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 text-black flex flex-col-reverse md:flex-row items-center justify-between w-full z-10 px-6 lg:px-16 xl:px-32 py-20 lg:py-24">
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-5 lg:space-y-7 mt-12 md:mt-0">
          <p className="text-emerald-700 text-lg font-bold tracking-wide flex items-center justify-center md:justify-start gap-2">
            <Sprout className="w-5 h-5 fill-emerald-600" />
            Welcome to
          </p>

          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight drop-shadow-sm">
            PlantBot
          </h1>

          {/* Animated Typing Subheading */}
          <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-indigo-700 min-h-[4rem] md:min-h-[2.5rem]">
            <TypeAnimation
              sequence={[
                "Your AI Gardening Companion!",
                2000,
                "Smart Plant Care, Made Simple!",
                2020,
                "Track and Watch Your Plants Thrive!",
                2020,
                "Notes, Watering Logs, and Insights!",
                2020,
              ]}
              speed={50}
              repeat={Infinity}
              wrapper="span"
            />
          </div>

          <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
            Track your plants, get **AI-powered gardening advice**, and chat
            anytime for support. With secure login, a sleek dashboard, and smart
            insights — PlantBot is your green thumb's best friend.
          </p>

          <Link to="/features">
            <button className="mt-8 inline-flex items-center px-10 py-3 bg-emerald-600 text-white text-xl font-bold rounded-xl shadow-lg shadow-emerald-300 transition duration-300 ease-in-out hover:bg-emerald-700 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-emerald-500">
              Get Started Now
            </button>
          </Link>
        </div>

        <div className="md:w-1/2 flex justify-center items-center relative z-0 p-4">
          {/* Background Glow (Simplified, modern circle) */}
          <div className="absolute -z-10 w-[24rem] h-[24rem] bg-emerald-300 opacity-30 blur-[100px] rounded-full" />

          <Tilt
            className="w-full max-w-xs lg:max-w-sm aspect-[3/4] rounded-3xl border-4 border-white shadow-2xl transition-all duration-500 overflow-hidden"
            tiltMaxAngleX={8}
            tiltMaxAngleY={8}
            perspective={1000}
            scale={1.03}
            transitionSpeed={800}
            gyroscope={true}
          >
            <img
              src={plant}
              alt="A healthy houseplant"
              className="w-full h-full object-cover drop-shadow-xl"
            />
          </Tilt>
        </div>
      </section>
      <Features />

      <TestimonialsSection />
      <section className="bg-emerald-700 py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Grow Your Green Thumb?
          </h2>
          <p className="text-emerald-100 text-lg mb-8">
            Join thousands of happy plant parents and make plant care
            effortless.
          </p>
          <Link to="/auth">
            <button className="inline-block px-12 py-3 bg-white text-emerald-700 text-xl font-bold rounded-xl shadow-xl transition hover:bg-gray-100 hover:scale-[1.05]">
              Sign Up for Free
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
