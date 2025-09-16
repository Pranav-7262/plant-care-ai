import React from "react";
import { Link } from "react-router-dom";
import Tilt from "react-parallax-tilt";
import { TypeAnimation } from "react-type-animation";
import plant from "../assets/plant.jpg";
import Features from "./Features";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#b6f0c0] via-[#a1e2b4] to-[#7ed9a0] text-black flex flex-col md:flex-row items-center justify-between w-full z-50 px-[4vw] lg:px-[12vw] py-[10vh]  font-sans ">
        {/* Left Side - Text Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-5">
          <p className="text-green-700 text-lg font-semibold tracking-wide uppercase">
            Welcome to
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold text-green-900 leading-tight drop-shadow-md">
            PlantBot
          </h1>

          {/* Animated Typing Subheading */}
          <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-purple-600">
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

          <p className="text-gray-800 text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
            Track your plants, get AI-powered gardening advice, and chat anytime
            for support. With secure login, a sleek dashboard, and smart
            insights — PlantBot is your green thumb's best friend.
          </p>

          <Link to="/features">
            <button className="mt-6 inline-block px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-full shadow-md transition duration-300 ease-in-out hover:bg-green-700 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400">
              Learn More
            </button>
          </Link>
        </div>

        {/* Right Side - Tilt Image */}
        <div className="md:w-1/2 mt-14 md:mt-0 flex justify-center relative">
          {/* Background Glow */}
          <div className="absolute -z-10 w-[20rem] h-[20rem] bg-purple-300 blur-[120px] opacity-40 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />

          {/* Tilt Card */}
          <Tilt
            className="w-40 h-40 sm:w-56 sm:h-56 md:w-[20rem] md:h-[30rem] rounded-full border-4 border-purple-500 shadow-xl transition-all duration-500"
            tiltMaxAngleX={20}
            tiltMaxAngleY={20}
            perspective={1200}
            scale={1.07}
            transitionSpeed={1000}
            gyroscope={true}
          >
            <img
              src={plant}
              alt="Plant"
              className="w-full h-full object-cover rounded-full drop-shadow-[0_10px_20px_rgba(130,69,236,0.5)] hover:shadow-2xl transition-shadow duration-300"
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
