import React from "react";
import Hero from "../components/LandingComp/Hero";
import LandingLayout from "../components/LandingComp/LandingLayout";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-r from-blue-900 via-indigo-900 to-gray-900 text-white">
      <div className="flex-grow relative z-10">
        <Hero />
        {/* <LandingLayout /> */}
      </div>
    </div>
  );
};

export default Landing;
