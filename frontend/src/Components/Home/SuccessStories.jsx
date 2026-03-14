import React from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh & Sunita Dhangar",
    community: "Dhangar · Married 2022",
    text: "ShubhVivah helped us find each other through a simple WhatsApp conversation. The process was transparent and smooth. Truly a blessing!",
    initials: "RS",
  },
  {
    name: "Amit & Rekha Baghel",
    community: "Baghel · Married 2023",
    text: "Everything felt genuine and verified. Our families connected instantly.",
    initials: "AR",
  },
  {
    name: "Suresh & Meena Pal",
    community: "Pal · Married 2023",
    text: "Within 3 months we found our soulmate. Highly recommended.",
    initials: "SM",
  },
  {
    name: "Vikas & Pooja",
    community: "Dhangar · Married 2024",
    text: "Safe, simple and community focused experience.",
    initials: "VP",
  },
  {
    name: "Rohit & Anjali",
    community: "Baghel · Married 2022",
    text: "Profiles were verified and authentic.",
    initials: "RA",
  },
  {
    name: "Deepak & Kavita",
    community: "Pal · Married 2023",
    text: "Families connected comfortably through WhatsApp.",
    initials: "DK",
  },
  {
    name: "Mahesh & Ritu",
    community: "Dhangar · Married 2024",
    text: "Trustworthy service with genuine profiles.",
    initials: "MR",
  },
  {
    name: "Nitin & Shalini",
    community: "Baghel · Married 2022",
    text: "We found our match faster than expected.",
    initials: "NS",
  },
  {
    name: "Karan & Sneha",
    community: "Pal · Married 2023",
    text: "Respectful communication and strong community values.",
    initials: "KS",
  },
  {
    name: "Arjun & Priya",
    community: "Dhangar · Married 2024",
    text: "Reliable and community-centered matrimony service.",
    initials: "AP",
  },
];

const TestimonialCard = ({ item }) => {
  return (
    <div className="flex-shrink-0 w-[320px] md:w-[400px] mx-4 
                    bg-white rounded-3xl p-8 border border-[#e6ddd4]
                    shadow-sm hover:shadow-xl hover:-translate-y-2 
                    transition duration-300">

      <Quote className="text-yellow-600 mb-4" size={28} />

      <p className="text-gray-700 leading-relaxed mb-6 break-words">
        "{item.text}"
      </p>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#8b1d2c] text-white 
                        flex items-center justify-center font-semibold">
          {item.initials}
        </div>
        <div>
          <h4 className="font-semibold text-[#4b1e23]">
            {item.name}
          </h4>
          <p className="text-sm text-gray-500">
            {item.community}
          </p>
        </div>
      </div>
    </div>
  );
};

const SuccessStories = () => {
  return (
    <section className="w-full bg-[#f5f1eb] py-24 overflow-hidden">

      <div className="text-center mb-16">
        <p className="text-yellow-600 font-semibold uppercase text-sm mb-3">
          Success Stories
        </p>

        <h2 className="text-4xl sm:text-5xl font-bold text-[#4b1e23]">
          Happy Couples, Happy Families
        </h2>

        <p className="mt-4 text-gray-600 text-lg">
          Real stories from couples who found their perfect match.
        </p>
      </div>

      {/* Scroll Wrapper */}
      <div className="relative overflow-hidden">

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[...testimonials, ...testimonials].map((item, index) => (
            <TestimonialCard key={index} item={item} />
          ))}
        </div>

      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }

          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
        `}
      </style>

    </section>
  );
};

export default SuccessStories;
