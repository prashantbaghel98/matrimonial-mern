import React from "react";
import {
  TriangleAlert,
  ShieldAlert,
  UserCheck,
  MessageCircleWarning,
  Shield,
  Phone,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const icons = [
  TriangleAlert,
  ShieldAlert,
  UserCheck,
  Shield,
  MessageCircleWarning,
  Phone,
  TriangleAlert,
  Shield,
  Phone,
];

const Disclaimer = () => {
  const { t } = useTranslation();

  const sections = t("disclaimer.sections", {
    returnObjects: true,
  });

  const contact = t("disclaimer.contact", {
    returnObjects: true,
  });

  return (
    <div className="w-full bg-[#f5f1eb] text-[#2d2a26]">

      {/* Hero */}
      <section className="bg-[#e9e2d8] py-24 px-6 text-center">

        <p className="text-orange-600 uppercase tracking-widest text-sm font-semibold mb-3">
          {t("disclaimer.pageTitle")}
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold">
          {t("disclaimer.hero.title")}
        </h1>

        <p className="mt-6 max-w-3xl mx-auto text-gray-600 leading-8">
          {t("disclaimer.hero.subtitle")}
        </p>

      </section>

      {/* Sections */}
      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="space-y-8">

          {sections.map((section, index) => {

            const Icon = icons[index] || TriangleAlert;

            return (

              <div
                key={index}
                className="bg-white rounded-3xl border border-[#e6ddd4] shadow-sm hover:shadow-lg transition-all duration-300 p-8"
              >

                <div className="flex items-center gap-4 mb-6">

                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">

                    <Icon
                      className="text-orange-600"
                      size={28}
                    />

                  </div>

                  <h2 className="text-2xl font-bold">
                    {section.title}
                  </h2>

                </div>

                {section.paragraph && (
                  <p className="text-gray-600 leading-8">
                    {section.paragraph}
                  </p>
                )}

                {section.content && (

                  <div className="grid md:grid-cols-2 gap-4 mt-6">

                    {section.content.map((item, i) => (

                      <div
                        key={i}
                        className="flex items-start gap-3 bg-[#faf7f2] border border-[#ece4da] rounded-xl p-4"
                      >

                        <ChevronRight
                          size={18}
                          className="text-orange-600 mt-1 flex-shrink-0"
                        />

                        <span className="text-gray-700">
                          {item}
                        </span>

                      </div>

                    ))}

                  </div>

                )}

              </div>

            );

          })}

        </div>

      </section>

   

    </div>
  );
};

export default Disclaimer;