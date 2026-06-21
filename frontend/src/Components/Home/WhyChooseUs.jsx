import React from "react";
import {
  CheckCircle,
  Shield,
  Users,
  MessageCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const icons = [
    CheckCircle,
    Shield,
    Users,
    MessageCircle,
  ];

  const featureItems = t("home.whyChooseUs.items", {
    returnObjects: true,
  });


  return (
    <section className="w-full bg-[#f5f1eb] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-yellow-600 font-semibold tracking-widest text-sm uppercase mb-3">
            {t("home.whyChooseUs.badge")}
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4b1e23]">
            {t("home.whyChooseUs.title")}
          </h2>

          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            {t("home.whyChooseUs.subtitle")}
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.isArray(featureItems) &&
            featureItems.map((item, index) => (
              <FeatureCard
                key={index}
                icon={icons[index]}
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