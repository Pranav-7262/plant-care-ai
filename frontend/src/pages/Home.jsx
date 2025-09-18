import React from "react";
import { Link } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { TypeAnimation } from "react-type-animation";
import plant from "../assets/plant.jpg";
import Features from "./Features";

const Home = () => {
  return (
    <div className="bg-[#f0f9f3] min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#d4f7dc] via-[#b6f0c2] to-[#9ad6a6] text-black flex flex-col md:flex-row items-center justify-between w-full z-50 px-[4vw] lg:px-[12vw] py-[10vh] font-sans">
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-6">
          <p className="text-[#3b8254] text-lg font-semibold tracking-wide uppercase">
            Welcome to
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1a382e] leading-tight drop-shadow-md">
            PlantBot
          </h1>

          {/* Animated Typing Subheading */}
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#5a428a]">
            <TypeAnimation
              sequence={[
                "Your AI Gardening Companion!",
                2000,
                "Smart Plant Care, Made Simple!",
                2000,
                "Track and Watch Your Plants Thrive!",
                2000,
                "Notes, Watering Logs, and Insights!",
                2000,
              ]}
              speed={60}
              repeat={Infinity}
              wrapper="span"
              className="inline-block min-h-[2.5rem]"
            />
          </p>

          <p className="text-gray-700 text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
            Track your plants, get AI-powered gardening advice, and chat anytime
            for support. With secure login, a sleek dashboard, and smart
            insights — PlantBot is your green thumb's best friend.
          </p>

          <Link to="/features">
            <button className="mt-6 inline-block px-8 py-3 bg-[#3a684b] text-white text-lg font-semibold rounded-full shadow-lg transition duration-300 ease-in-out hover:bg-[#2a4d3a] hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-[#629c78]">
              Learn More
            </button>
          </Link>
        </div>

        {/* Right Side - Tilt Image */}
        <div className="md:w-1/2 mt-14 md:mt-0 flex justify-center relative">
          {/* Background Glow */}
          <div className="absolute -z-10 w-[22rem] h-[22rem] bg-[#a9e4b9] blur-[150px] opacity-60 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" />

          {/* Tilt Card */}
          <Tilt
            className="w-40 h-40 sm:w-56 sm:h-56 md:w-[22rem] md:h-[32rem] rounded-full border-4 border-[#3a684b] shadow-xl transition-all duration-500 hover:border-[#629c78]"
            tiltMaxAngleX={15}
            tiltMaxAngleY={15}
            perspective={1200}
            scale={1.05}
            transitionSpeed={1000}
            gyroscope={true}
          >
            <img
              src={plant}
              alt="Plant"
              className="w-full h-full object-cover rounded-full drop-shadow-[0_15px_30px_rgba(42,77,58,0.3)] hover:drop-shadow-[0_20px_40px_rgba(42,77,58,0.5)] transition-shadow duration-300"
            />
          </Tilt>
        </div>
      </section>

      {/* Features Section */}
      <Features />
    </div>
  );
};

export default Home;
