import React from "react";
import {
  CheckCircle,
  Shield,
  Users,
  MessageCircle,
} from "lucide-react";

/* Reusable Card Component */
const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white/60 backdrop-blur-sm border border-[#e8dfd6] rounded-3xl p-8 text-center hover:shadow-lg hover:-translate-y-2 transition duration-300">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#efe6de] flex items-center justify-center">
        <Icon className="text-[#7a1f2b]" size={28} />
      </div>

      <h3 className="text-xl font-semibold text-[#4b1e23] mb-4">
        {title}
      </h3>

      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const WhyChooseUs = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Verified Profiles",
      description:
        "Every profile is manually reviewed to ensure authenticity and genuine intent for matrimonial purposes.",
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description:
        "Your privacy is our priority. We handle all information with complete confidentiality and respect.",
    },
    {
      icon: Users,
      title: "Community Specific",
      description:
        "Exclusively dedicated to Dhangar, Baghel & Pal communities — preserving our rich cultural heritage.",
    },
    {
      icon: MessageCircle,
      title: "Easy WhatsApp Support",
      description:
        "Connect directly through WhatsApp for quick, personal, and convenient communication anytime.",
    },
  ];

  return (
    <section className="w-full bg-[#f5f1eb] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="text-yellow-600 font-semibold tracking-widest text-sm uppercase mb-3">
            Why Choose Us
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4b1e23]">
            Why ShubhVivah Matrimony?
          </h2>

          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            We understand the values and traditions of our communities deeply.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <FeatureCard
              key={index}
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
