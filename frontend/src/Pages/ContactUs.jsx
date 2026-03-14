import React from "react";
import {
  Phone,
  Mail,
  Clock,
  MapPin,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const WHATSAPP_NUMBER = "917017225698"; // replace

const ContactUs = () => {
  const openWhatsApp = (message) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full bg-[#f5f1eb] text-[#2d2a26]">

      {/* ================= HERO ================= */}
      <section className="text-center py-24 bg-[#e9e2d8] px-6">
        <p className="text-orange-600 uppercase text-sm font-semibold mb-3">
          Contact Us
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold">
          We're Here to{" "}
          <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            Help You
          </span>
        </h1>

        <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
          Have questions about our matrimonial services? Reach out to us directly via WhatsApp for the fastest response.
        </p>
      </section>

      {/* ================= WHATSAPP CARD ================= */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-green-50 border border-green-400 rounded-3xl p-12 text-center shadow-md">

          <div className="w-16 h-16 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
            <MessageCircle className="text-white" size={30} />
          </div>

          <h2 className="text-xl font-semibold mb-3">
            WhatsApp - Fastest Way to Connect
          </h2>

          <p className="text-gray-600 mb-8">
            Click below to instantly message us on WhatsApp. We typically respond within minutes!
          </p>

          <button
            onClick={() =>
              openWhatsApp("Hello Apna Vivah Team, I would like to know more about your services.")
            }
            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Chat on WhatsApp
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ================= CONTACT CARDS ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">

        {/* Call */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e6ddd4] hover:shadow-lg transition">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
            <Phone className="text-orange-600" />
          </div>
          <h3 className="font-semibold mb-2">Call Us</h3>
          <p className="text-gray-500 text-sm mb-3">
            Prefer talking? Give us a call directly.
          </p>
          <p className="text-orange-600 font-medium">+91 7017225698</p>
        </div>

        {/* Email */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e6ddd4] hover:shadow-lg transition">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
            <Mail className="text-orange-600" />
          </div>
          <h3 className="font-semibold mb-2">Email Us</h3>
          <p className="text-gray-500 text-sm mb-3">
            Send us detailed inquiries via email.
          </p>
          <p className="text-orange-600 font-medium">contact@apnavivah.com</p>
        </div>

        {/* Hours */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#e6ddd4] hover:shadow-lg transition">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
            <Clock className="text-orange-600" />
          </div>
          <h3 className="font-semibold mb-2">Available Hours</h3>
          <p className="text-gray-500 text-sm mb-3">
            We're here to help you.
          </p>
          <p className="font-medium">Mon - Sun: 9AM - 9PM</p>
        </div>

      </section>

      {/* ================= FOUNDER SECTION ================= */}
      <section className="bg-[#e9e2d8] py-24 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-10 shadow-md border border-[#e6ddd4]">

          <div className="flex flex-col sm:flex-row items-center gap-8">

            <div className="sm:w-54 sm:h-34 rounded-full flex items-center justify-center text-2xl font-bold text-orange-600">
              <img src="./founder.png" alt="" className="rounded-2xl" />
            </div>

            <div>
              <h3 className="text-xl font-semibold">
                Vinod Kumar Baghel
              </h3>
              <p className="text-orange-600 text-sm mb-3">
                Founder & Personal Manager
              </p>

              <p className="text-gray-600 mb-6">
                With over 10 years of experience in community matrimonial services,
                I personally oversee every match and ensure that families find
                the perfect connection. Your trust is my priority.
              </p>

              <button
                onClick={() =>
                  openWhatsApp("Hello Vinod Ji, I would like to discuss about matrimonial services.")
                }
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-xl font-semibold hover:scale-105 transition"
              >
                Message Vinod Ji
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ================= LOCATION ================= */}
      <section className="text-center py-24 px-6">
        <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <MapPin className="text-orange-600" />
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          Our Location
        </h2>

        <p className="text-gray-600 mb-3">
          Serving communities across
        </p>

        <p className="font-medium text-lg mb-4">
          Ghaziabad, India
        </p>

        <p className="text-gray-500 max-w-xl mx-auto">
          We operate primarily online through WhatsApp for your convenience.
          Home visits can be arranged for premium members.
        </p>
      </section>

    </div>
  );
};

export default ContactUs;
