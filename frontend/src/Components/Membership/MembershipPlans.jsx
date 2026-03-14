import React from "react";
import { Check } from "lucide-react";

const WHATSAPP_NUMBER = "917017225698"; // <-- replace with your number

const plans = [
  {
    name: "Basic",
    price: "₹999",
    duration: "3 Months",
    features: [
      "Verified Profiles Access",
      "Community Specific Matches",
      "WhatsApp Support",
      "Limited Profile Views",
    ],
    popular: false,
  },
  {
    name: "Premium",
    price: "₹1999",
    duration: "6 Months",
    features: [
      "Unlimited Profile Views",
      "Priority Match Suggestions",
      "Direct WhatsApp Connection",
      "Profile Highlight",
      "Premium Support",
    ],
    popular: true,
  },
  {
    name: "Elite",
    price: "₹2999",
    duration: "12 Months",
    features: [
      "All Premium Features",
      "Dedicated Relationship Manager",
      "Top Search Placement",
      "Early Access to New Profiles",
      "VIP WhatsApp Assistance",
    ],
    popular: false,
  },
];

const PlanCard = ({ plan }) => {
  const handleChoosePlan = () => {
    const message = `Hello Apna Vivah Team,

I am interested in the ${plan.name} Plan.

Plan Details:
• Price: ${plan.price}
• Duration: ${plan.duration}

Please guide me with the next steps.`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-3xl p-8 border transition duration-300 h-full
      ${
        plan.popular
          ? "bg-white shadow-2xl scale-105 border-orange-500"
          : "bg-white border-[#e8dfd6] hover:shadow-xl hover:-translate-y-3"
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 
                        bg-gradient-to-r from-red-600 to-orange-500 
                        text-white text-xs px-4 py-1 rounded-full shadow">
          Most Popular
        </div>
      )}

      <div>
        <h3 className="text-2xl font-semibold text-[#4b1e23] mb-2">
          {plan.name}
        </h3>

        <p className="text-gray-500 mb-6">{plan.duration}</p>

        {/* Price */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl blur-md opacity-60"></div>
          <div className="relative bg-white rounded-xl py-6 shadow-sm">
            <div className="flex items-end justify-center gap-2">
              <span className="text-5xl font-bold text-[#2d2a26]">
                {plan.price}
              </span>
            </div>
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-600">
              <Check size={18} className="text-green-500 mt-1" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* WhatsApp Button */}
      <button
        onClick={handleChoosePlan}
        className={`w-full py-3 rounded-xl font-semibold transition duration-300
        ${
          plan.popular
            ? "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:shadow-lg hover:scale-105"
            : "border border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white"
        }`}
      >
        Choose Plan
      </button>
    </div>
  );
};

const MembershipPlans = () => {
  return (
    <section className="w-full bg-[#f5f1eb] py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <p className="text-orange-600 font-semibold tracking-widest uppercase text-sm mb-3">
          Membership Plans
        </p>

        <h2 className="text-4xl sm:text-5xl font-bold text-[#2d2a26] mb-6">
          Choose Your Perfect{" "}
          <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            Plan
          </span>
        </h2>

        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-16">
          Flexible membership options designed to help you find your life partner.
          All plans include verified profiles and WhatsApp support.
        </p>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <PlanCard key={index} plan={plan} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default MembershipPlans;
