
import React from "react";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const HelpCTA = () => {
  const { t } = useTranslation();

  return (
    <section className="relative w-full py-24 overflow-hidden">

      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#9b1c2f] via-[#c92a2a] to-[#ff7a18]"></div>

      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-4xl mx-auto px-6 text-center text-white">

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          {t("membership.helpCTA.title")}
        </h2>

        {/* Description */}
        <p className="text-lg sm:text-xl text-white/90 mb-10">
          {t("membership.helpCTA.description")}
        </p>

        {/* Button */}
        <button
          onClick={() =>
            window.open(
              "https://wa.me/917017225698?text=Hello%20Apna%20Vivah,%20I%20need%20help%20choosing%20a%20membership%20plan.",
              "_blank"
            )
          }
          className="group inline-flex items-center gap-3
          bg-gradient-to-r from-yellow-400 to-yellow-500
          text-black px-10 py-4 rounded-xl font-semibold text-lg
          shadow-xl hover:shadow-2xl hover:scale-105
          transition duration-300"
        >
          {t("membership.helpCTA.button")}

          <ArrowRight
            className="group-hover:translate-x-2 transition"
            size={20}
          />
        </button>

      </div>
    </section>
  );
};

export default HelpCTA;

