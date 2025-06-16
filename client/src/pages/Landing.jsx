import React from "react";
import Hero from "../components/LandingComp/Hero";
import Stats from "../components/LandingComp/Stats";
import Features from "../components/LandingComp/Features";
import Mission from "../components/LandingComp/Mission";
import Benefits from "../components/LandingComp/Benefits";
import Footer from "../components/LandingComp/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Stats />
      <Features />
      <Mission />
      <Benefits />
      <Footer />
    </div>
  );
};

export default Landing;
