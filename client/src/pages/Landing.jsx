import React from "react";
import Hero from "../components/LandingComp/Hero";
import Footer from "../components/LandingComp/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <Hero />
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
