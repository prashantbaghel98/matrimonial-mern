import React from "react";
import { FileText, Search, MessageCircle, ArrowRight } from "lucide-react";

const StepCard = ({ icon: Icon, step, title, description }) => {
  return (
    <div className="relative text-center group">
      {/* Icon Circle */}
      <div className="relative mx-auto w-24 h-24 rounded-full bg-[#8b1d2c] flex items-center justify-center shadow-lg 
                      transition-all duration-300 group-hover:-translate-y-3 group-hover:shadow-2xl">
        <Icon className="text-white" size={34} />

        {/* Step Number */}
        <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black 
                        w-8 h-8 rounded-full flex items-center justify-center 
                        text-sm font-bold shadow">
          {step}
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-8 text-2xl font-semibold text-[#4b1e23]">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-4 text-gray-600 max-w-xs mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      step: 1,
      title: "Register Your Profile",
      description:
        "Chat with us on WhatsApp and share your details. We'll create your profile for free — no forms, no hassle.",
    },
    {
      icon: Search,
      step: 2,
      title: "Browse Profiles",
      description:
        "Explore hundreds of verified matrimonial profiles from the Dhangar, Baghel & Pal community.",
    },
    {
      icon: MessageCircle,
      step: 3,
      title: "Connect via WhatsApp",
      description:
        "Found someone interesting? Connect directly through WhatsApp and let families get acquainted.",
    },
  ];

  return (
    <section className="w-full bg-[#efe6d3] py-24 relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-yellow-600 font-semibold tracking-widest uppercase text-sm mb-3">
            Simple Process
          </p>

          <h2 className="text-4xl sm:text-5xl font-bold text-[#4b1e23]">
            How It Works
          </h2>

          <p className="mt-4 text-gray-600 text-lg">
            Finding your life partner is just 3 simple steps away.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-12 items-start">

          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-yellow-500/40"></div>

          {steps.map((item, index) => (
            <StepCard
              key={index}
              icon={item.icon}
              step={item.step}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <button className="inline-flex items-center gap-3 bg-green-600 text-white px-10 py-4 rounded-full 
                             font-semibold text-lg shadow-lg 
                             hover:bg-green-700 hover:scale-105 transition duration-300">
            <MessageCircle size={22} /> <a target="blank" href="https://wa.me/917017225698">
            Chat on WhatsApp</a>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};


export default HowItWorks;
