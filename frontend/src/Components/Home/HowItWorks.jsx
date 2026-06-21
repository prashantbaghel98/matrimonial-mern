import React from "react";
import { FileText, Search, MessageCircle, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const StepCard = ({ icon: Icon, step, title, description }) => {
  return (
    <div className="relative text-center group">
      <div
        className="relative mx-auto w-24 h-24 rounded-full bg-[#8b1d2c] flex items-center justify-center shadow-lg
        transition-all duration-300 group-hover:-translate-y-3 group-hover:shadow-2xl"
      >
        <Icon className="text-white" size={34} />

        <div
          className="absolute -bottom-2 -right-2 bg-yellow-500 text-black
          w-8 h-8 rounded-full flex items-center justify-center
          text-sm font-bold shadow"
        >
          {step}
        </div>
      </div>

      <h3 className="mt-8 text-2xl font-semibold text-[#4b1e23]">
        {title}
      </h3>

      <p className="mt-4 text-gray-600 max-w-xs mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const HowItWorks = () => {
  const { t } = useTranslation();

  const icons = [FileText, Search, MessageCircle];

  const steps = t("home.howItWorks.steps", {
    returnObjects: true,
  });

  return (
    <section className="w-full bg-[#efe6d3] py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-yellow-600 font-semibold tracking-widest uppercase text-sm mb-3">
            {t("home.howItWorks.badge")}
          </p>

          <h2 className="text-4xl sm:text-5xl font-bold text-[#4b1e23]">
            {t("home.howItWorks.title")}
          </h2>

          <p className="mt-4 text-gray-600 text-lg">
            {t("home.howItWorks.subtitle")}
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-12 items-start">
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-yellow-500/40"></div>

          {Array.isArray(steps) &&
            steps.map((item, index) => (
              <StepCard
                key={index}
                icon={icons[index]}
                step={item.number}
                title={item.title}
                description={item.description}
              />
            ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <button
            className="inline-flex items-center gap-3 bg-green-600 text-white px-10 py-4 rounded-full
            font-semibold text-lg shadow-lg
            hover:bg-green-700 hover:scale-105 transition duration-300"
          >
            <MessageCircle size={22} />

            <a
              href="https://wa.me/917017225698"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("home.howItWorks.button")}
            </a>

            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;