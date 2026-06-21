
import React from "react";
import { MapPin, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const StoryCard = ({ story, photo }) => {
  return (
    <div className="bg-[#f1ece6] rounded-3xl shadow-md overflow-hidden border border-[#e6ddd4] hover:shadow-xl transition">
      <div className="relative bg-gradient-to-r from-[#9b1c2f] to-[#ff7a18] h-60 flex items-center justify-center">

        <img
          src={photo}
          alt={story.couple}
          className="w-full h-full object-cover"
        />

        <span className="absolute -bottom-5 left-4 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full font-medium">
          {story.community}
        </span>
      </div>

      <div className="p-6 mt-10">
        <h3 className="text-lg font-semibold text-[#2d2a26]">
          {story.couple}
        </h3>

        <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
          <MapPin size={14} />
          {story.location}
        </div>

        <p className="text-gray-600 mt-4 text-sm leading-relaxed">
          "{story.story}"
        </p>
      </div>
    </div>
  );
};

const SuccessStoriesPage = () => {
  const { t } = useTranslation();

  const stories = t("successStoriesPage.stories", {
    returnObjects: true,
  });

  const statistics = t("successStoriesPage.statistics", {
    returnObjects: true,
  });

  const photos = [
    "/success-story-1.jpg",
    "/success-story-2.jpg",
    "/success-story-3.jpg",
    "/success-story-4.jpg",
    "/success-story-5.jpg",
    "/success-story-6.jpg",
  ];

  return (
    <div className="bg-[#f5f1eb]">

      {/* Hero */}
      <section className="text-center py-24 bg-[#e9e2d8] px-6">

        <p className="text-orange-600 uppercase text-sm font-semibold mb-3">
          {t("successStoriesPage.pageTitle")}
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold text-[#2d2a26]">
          {t("successStoriesPage.hero.title")}
        </h1>

        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          {t("successStoriesPage.hero.description")}
        </p>

      </section>

      {/* Stories */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 lg:grid-cols-3 gap-10">

        {stories.map((story, index) => (
          <StoryCard
            key={index}
            story={story}
            photo={photos[index]}
          />
        ))}

      </section>

      {/* Statistics */}
      <section className="bg-gradient-to-r from-[#9b1c2f] to-[#ff7a18] text-white py-14">

        <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 text-center gap-8">

          {statistics.map((item, index) => (
            <div key={index}>
              <h2 className="text-3xl font-bold">
                {item.number}
              </h2>

              <p className="text-sm mt-1">
                {item.label}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="text-center py-24 bg-[#e9e2d8] px-6">

        <h2 className="text-3xl font-bold text-[#2d2a26]">
          {t("successStoriesPage.cta.title")}
        </h2>

        <p className="text-gray-600 mt-4 mb-8">
          {t("successStoriesPage.cta.description")}
        </p>

        <button
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition"
          onClick={() =>
            window.open(
              "https://wa.me/917017225698?text=Hello%20Apna%20Vivah,%20I%20want%20to%20start%20my%20journey%20and%20register.",
              "_blank"
            )
          }
        >
          {t("successStoriesPage.cta.button")}
          <ArrowRight size={18} />
        </button>

      </section>

    </div>
  );
};

export default SuccessStoriesPage;
