import React from "react";
import { Quote } from "lucide-react";
import { useTranslation } from "react-i18next";

const TestimonialCard = ({ item }) => {
  return (
    <div
      className="flex-shrink-0 w-[320px] md:w-[400px] mx-4
      bg-white rounded-3xl p-8 border border-[#e6ddd4]
      shadow-sm hover:shadow-xl hover:-translate-y-2
      transition duration-300"
    >
      <Quote className="text-yellow-600 mb-4" size={28} />

      <p className="text-gray-700 leading-relaxed mb-6 break-words">
        "{item.text}"
      </p>

      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full bg-[#8b1d2c] text-white
          flex items-center justify-center font-semibold"
        >
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
  const { t } = useTranslation();

  const testimonials = t("home.successStories.stories", {
    returnObjects: true,
  });

  return (
    <section className="w-full bg-[#f5f1eb] py-24 overflow-hidden">
      <div className="text-center mb-16">
        <p className="text-yellow-600 font-semibold uppercase text-sm mb-3">
          {t("home.successStories.badge")}
        </p>

        <h2 className="text-4xl sm:text-5xl font-bold text-[#4b1e23]">
          {t("home.successStories.title")}
        </h2>

        <p className="mt-4 text-gray-600 text-lg">
          {t("home.successStories.subtitle")}
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {Array.isArray(testimonials) &&
            [...testimonials, ...testimonials].map((item, index) => (
              <TestimonialCard key={index} item={item} />
            ))}
        </div>
      </div>

      <style>
        {`
          @keyframes marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
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