import React from "react";
import {
  Shield,
  Lock,
  Database,
  UserCheck,
  Phone,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const icons = [
  Shield,
  Database,
  UserCheck,
  Lock,
  Shield,
  Phone,
];

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const sections = t("privacy.sections", {
    returnObjects: true,
  });

  const contact = t("privacy.contact", {
    returnObjects: true,
  });

  return (
    <div className="w-full bg-[#f5f1eb] text-[#2d2a26]">

      {/* Hero */}

      <section className="bg-[#e9e2d8] py-24 px-6 text-center">

        <p className="text-orange-600 uppercase text-sm font-semibold mb-3">
          {t("privacy.pageTitle")}
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold">
          {t("privacy.hero.title")}
        </h1>

        <p className="max-w-3xl mx-auto mt-6 text-gray-600">
          {t("privacy.hero.subtitle")}
        </p>

      </section>

      {/* Sections */}

      <section className="max-w-6xl mx-auto px-6 py-20">

        <div className="space-y-8">

          {sections.map((section, index) => {

            const Icon = icons[index] || Shield;

            return (

              <div
                key={index}
                className="bg-white rounded-3xl border border-[#e6ddd4] shadow-sm p-8 hover:shadow-lg transition"
              >

                <div className="flex items-center gap-4 mb-6">

                  <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center">

                    <Icon className="text-orange-600" />

                  </div>

                  <h2 className="text-2xl font-semibold">
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
                        className="flex items-start gap-3 bg-[#faf7f2] rounded-xl p-4"
                      >

                        <ChevronRight
                          className="text-orange-600 mt-1"
                          size={18}
                        />

                        <span>{item}</span>

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

export default PrivacyPolicy;