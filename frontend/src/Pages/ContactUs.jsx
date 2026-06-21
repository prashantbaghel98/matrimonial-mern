
import React from "react";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const WHATSAPP_NUMBER = "917017225698";

const ContactUs = () => {
  const { t } = useTranslation();

  const contactMethods = t("contact.contactMethods", {
    returnObjects: true,
  });

  const openWhatsApp = (message) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full bg-[#f5f1eb] text-[#2d2a26]">

      {/* Hero */}
      <section className="text-center py-24 bg-[#e9e2d8] px-6">
        <p className="text-orange-600 uppercase text-sm font-semibold mb-3">
          {t("contact.pageTitle")}
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold">
          {t("contact.hero.title")}
        </h1>

        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          {t("contact.hero.description")}
        </p>
      </section>

      {/* WhatsApp Card */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-green-50 border border-green-400 rounded-3xl p-12 text-center shadow-md">

          <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
            <MessageCircle className="text-white" size={30} />
          </div>

          <h2 className="text-xl font-semibold mb-3">
            {contactMethods[0].title}
          </h2>

          <p className="text-gray-600 mb-8">
            {t("contact.hero.description")}
          </p>

          <button
            onClick={() =>
              openWhatsApp(
                "Hello Apna Vivah Team, I would like to know more about your services."
              )
            }
            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            {contactMethods[0].button}
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e6ddd4] hover:shadow-lg transition">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
            <Phone className="text-orange-600" />
          </div>

          <h3 className="font-semibold mb-2">
            {contactMethods[1].title}
          </h3>

          <p className="text-orange-600 font-medium">
            {contactMethods[1].value}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e6ddd4] hover:shadow-lg transition">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
            <Mail className="text-orange-600" />
          </div>

          <h3 className="font-semibold mb-2">
            {contactMethods[2].title}
          </h3>

          <p className="text-orange-600 font-medium">
            {contactMethods[2].value}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e6ddd4] hover:shadow-lg transition">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
            <Clock className="text-orange-600" />
          </div>

          <h3 className="font-semibold mb-2">
            {t("contact.availableHours")}
          </h3>

          <p className="font-medium">
{t("contact.workingHours")}
          </p>
        </div>

      </section>

      {/* Founder */}
      <section className="bg-[#e9e2d8] py-24 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 shadow-md border border-[#e6ddd4]">

          <div className="flex flex-col sm:flex-row items-center gap-8">

            <div className="sm:w-54 sm:h-34">
              <img
                src="/founder.png"
                alt="Founder"
                className="rounded-2xl"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                {t("contact.founder.name")}
              </h3>

              <p className="text-orange-600 text-sm mb-3">
                {t("contact.founder.designation")}
              </p>

              <p className="text-gray-600 mb-6">
                {t("contact.founder.description")}
              </p>

              <button
                onClick={() =>
                  openWhatsApp(
                    "Hello Vinod Ji, I would like to discuss matrimonial services."
                  )
                }
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-xl font-semibold hover:scale-105 transition"
              >
                {t("contact.founder.button")}
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Location */}
      <section className="text-center py-24 px-6">

        <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <MapPin className="text-orange-600" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          {t("contact.location.title")}
        </h2>

        <p className="text-gray-600 mb-3">
          {t("contact.location.subtitle")}
        </p>

        <p className="font-medium text-lg mb-4">
          {t("contact.location.city")}
        </p>

        <p className="text-gray-500 max-w-xl mx-auto">
          {t("contact.location.description")}
        </p>

      </section>

    </div>
  );
};

export default ContactUs;
