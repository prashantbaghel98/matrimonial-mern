import React from "react";
import { Heart, MapPin, Calendar, ArrowRight } from "lucide-react";

const stories = [
  {
    photo:"./success-story-1.jpg",
    community: "Baghel Community",
    name: "Rahul & Neha",
    location: "Indore, MP",
    date: "December 2023",
    text: "We both were looking for someone who understood our values and traditions. Apna Vivah connected us, and within three months, our families met. Today, we are happily married and grateful for this platform.",
  },
  {
    photo:"./success-story-2.jpg",
    community: "Pal Community",
    name: "Vijay & Priyanka",
    location: "Bhopal, MP",
    date: "August 2023",
    text: "After searching for two years on other platforms, we found each other through Apna Vivah. The personal attention from Vinod ji made all the difference.",
  },
  {
    photo:"./success-story-3.jpg",
    community: "Dhangar Community",
    name: "Sunil & Meena",
    location: "Ujjain, MP",
    date: "March 2024",
    text: "What we loved about Apna Vivah was how they understood our community values. The matching was perfect.",
  },
  {
    photo:"./success-story-4.jpg",
    community: "Baghel Community",
    name: "Deepak & Anita",
    location: "Gwalior, MP",
    date: "January 2024",
    text: "The premium membership was worth every rupee. We got personal recommendations that truly matched our preferences.",
  },
  {
    photo:"./success-story-5.jpg",
    community: "Pal Community",
    name: "Arun & Sunita",
    location: "Jabalpur, MP",
    date: "October 2023",
    text: "Our parents were worried about finding a suitable match. Apna Vivah’s verification process gave them confidence.",
  },
  {
    photo:"./success-story-6.jpg",
    community: "Dhangar Community",
    name: "Kiran & Rekha",
    location: "Ratlam, MP",
    date: "June 2024",
    text: "Quick, efficient and trustworthy. Within weeks of registering, we found our perfect match.",
  },
];

const StoryCard = ({ story }) => {
  return (
    <div className="bg-[#f1ece6] rounded-3xl shadow-md overflow-hidden border border-[#e6ddd4] hover:shadow-xl transition">

      {/* Top Gradient */}
      <div className="relative bg-gradient-to-r from-[#9b1c2f] to-[#ff7a18] h-60 flex items-center justify-center">
      <img src={story.photo} alt="" className=""/>

        {/* Community Badge */}
        <span className="absolute -bottom-5 left-4 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-medium">
          {story.community}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 mt-10">
        <h3 className="text-lg font-semibold text-[#2d2a26]">
          {story.name}
        </h3>

        <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            {story.location}
          </div>
          {/* <div className="flex items-center gap-1">
            <Calendar size={14} />
            {story.date}
          </div> */}
        </div>

        <p className="text-gray-600 mt-4 text-sm leading-relaxed">
          "{story.text}"
        </p>
      </div>
    </div>
  );
};

const SuccessStoriesPage = () => {
  return (
    <div className="bg-[#f5f1eb]">

      {/* ===== HERO ===== */}
      <section className="text-center py-24 bg-[#e9e2d8] px-6">
        <p className="text-orange-600 uppercase text-sm font-semibold mb-3">
          Success Stories
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold text-[#2d2a26]">
          Real Love, Real{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
            Happy Endings
          </span>
        </h1>

        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          These beautiful couples found their life partners through Apna Vivah.
          Their stories inspire us to continue our mission.
        </p>
      </section>

      {/* ===== STORIES GRID ===== */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {stories.map((story, index) => (
          <StoryCard key={index} story={story} />
        ))}
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="bg-gradient-to-r from-[#9b1c2f] to-[#ff7a18] text-white py-14">
        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 text-center gap-8">
          <div>
            <h2 className="text-3xl font-bold">500+</h2>
            <p className="text-sm mt-1">Happy Marriages</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">3</h2>
            <p className="text-sm mt-1">Communities Served</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">10+</h2>
            <p className="text-sm mt-1">Years of Trust</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">98%</h2>
            <p className="text-sm mt-1">Success Rate</p>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="text-center py-24 bg-[#e9e2d8] px-6">
        <h2 className="text-3xl font-bold text-[#2d2a26]">
          Your Story Could Be Next!
        </h2>

        <p className="text-gray-600 mt-4 mb-8">
          Join Apna Vivah today and take the first step towards finding your perfect life partner.
        </p>

        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition">
          <a target="blank" href="https://wa.me/919827383728?text=Hello%20Apna%20Vivah,%20I%20want%20to%20start%20my%20journey%20and%20register.
">Start Your Journey</a>
          <ArrowRight size={18} />
        </button>
      </section>

    </div>
  );
};

export default SuccessStoriesPage;
