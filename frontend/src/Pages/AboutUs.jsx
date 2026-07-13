import React from "react";
import {
  Heart,
  Users,
  Target,
  Award,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const { t } = useTranslation();

  const values = t("about.values.items", {
    returnObjects: true,
  });

  const communities = t("about.communities.items", {
    returnObjects: true,
  });

  const valueIcons = [
    <Heart className="text-orange-600" />,
    <Users className="text-orange-600" />,
    <Target className="text-orange-600" />,
    <Award className="text-orange-600" />,
  ];

  return (
    <div className="w-full bg-[#f5f1eb] text-[#2d2a26]">

      {/* ================= HERO ================= */}
      <section className="text-center py-24 px-6 bg-[#e9e2d8]">
        <p className="text-orange-600 font-semibold uppercase tracking-widest text-sm mb-3">
          {t("about.pageTitle")}
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          {t("about.hero.title")}{" "}
          <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            {t("about.hero.highlight")}
          </span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-gray-600 text-lg">
          {t("about.hero.description")}
        </p>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="max-w-7xl mx-auto py-24 px-6 grid lg:grid-cols-2 gap-16 items-center">

        <div>
          <p className="text-orange-600 font-semibold uppercase text-sm mb-3">
            {t("about.ourStory.title")}
          </p>

          <h2 className="text-3xl font-bold mb-6">
            {t("about.ourStory.subtitle")}
          </h2>

          <p className="text-gray-600 mb-4">
            {t("about.ourStory.description1")}
          </p>

          <p className="text-gray-600 mb-4">
            {t("about.ourStory.description2")}
          </p>

          <p className="text-gray-600">
            {t("about.ourStory.description3")}
          </p>

          <div className="items-center gap-2 mt-6">
            <h3 className="font-semibold text-lg">
              {t("about.ourStory.founder.name")}
            </h3>

            <p className="text-gray-500 text-sm">
              ({t("about.ourStory.founder.designation")})
            </p>
          </div>
        </div>

        {/* Founder Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-[#e8dfd6]">
          <div className="items-center gap-4">
            <div className="rounded-3xl bg-cover bg-center">
              <img
                src="./founder-new.png"
                alt={t("about.ourStory.founder.name")}
                className="rounded-3xl"
              />
            </div>
          </div>
        </div>

      </section>

      {/* ================= VALUES ================= */}
      <section className="py-24 bg-[#e9e2d8] text-center px-6">
        <p className="text-orange-600 font-semibold uppercase text-sm mb-3">
          {t("about.values.title")}
        </p>

        <h2 className="text-3xl font-bold mb-16">
          {t("about.values.subtitle")}
        </h2>

        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {Array.isArray(values) &&
            values.map((item, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300"
              >
                <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-orange-100 flex items-center justify-center">
                  {valueIcons[index]}
                </div>

                <h3 className="font-semibold text-lg mb-3">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
            ))}

        </div>
      </section>

      {/* ================= COMMUNITIES ================= */}
      <section className="py-24 text-center px-6">
        <p className="text-orange-600 font-semibold uppercase text-sm mb-3">
          {t("about.communities.title")}
        </p>

        <h2 className="text-3xl font-bold mb-6">
          {t("about.communities.subtitle")}
        </h2>

        <p className="text-gray-600 mb-12">
          {t("about.communities.description")}
        </p>

        <div className="flex flex-wrap justify-center gap-8">

          {Array.isArray(communities) &&
            communities.map((community, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-10 py-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300"
              >
                <h3 className="font-semibold text-lg">
                  {community.name}
                </h3>

                <p className="text-sm opacity-90">
                  {community.description}
                </p>
              </div>
            ))}

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-[#e9e2d8] text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          {t("about.cta.title")}
        </h2>

        <p className="text-gray-600 mb-8">
          {t("about.cta.description")}
        </p>

        <button
          onClick={() =>
            window.open(
              "https://wa.me/917017225698?text=Hello%20Apna%20Vivah,%20I%20want%20to%20register%20for%20free.%20Please%20guide%20me.",
              "_blank"
            )
          }
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
          aria-label="Contact Apna Vivah on WhatsApp"
        >
          <ArrowRight size={18} />
        </button>
      </section>

    </div>
  );
};

export default AboutUs;