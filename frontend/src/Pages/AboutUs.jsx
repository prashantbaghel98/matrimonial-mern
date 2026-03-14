import React from "react";
import { Heart, Users, Target, Award, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-[#f5f1eb] text-[#2d2a26]">

      {/* ================= HERO ================= */}
      <section className="text-center py-24 px-6 bg-[#e9e2d8]">
        <p className="text-orange-600 font-semibold uppercase tracking-widest text-sm mb-3">
          About Us
        </p>

        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Building Families with{" "}
          <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            Trust & Tradition
          </span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-gray-600 text-lg">
          Apna Vivah is a dedicated matrimonial platform serving the Pal,
          Baghel, and Dhangar communities with personalized matchmaking services.
        </p>
      </section>

      {/* ================= OUR STORY ================= */}
      <section className="max-w-7xl mx-auto py-24 px-6 grid lg:grid-cols-2 gap-16 items-center">

        <div>
          <p className="text-orange-600 font-semibold uppercase text-sm mb-3">
            Our Story
          </p>

          <h2 className="text-3xl font-bold mb-6">
            A Vision for Community Matrimony
          </h2>

          <p className="text-gray-600 mb-4">
            Apna Vivah was founded with a simple yet powerful vision —
            to help families from Pal, Baghel, and Dhangar communities
            find suitable life partners while preserving our rich cultural values.
          </p>

          <p className="text-gray-600 mb-4">
            Under the leadership of <strong>Vinod Kumar Baghel</strong>,
            we have successfully connected hundreds of families and
            created lasting bonds of love and companionship.
          </p>

          <p className="text-gray-600">
            We take a personalized approach to every match,
            ensuring compatibility at every level.
          </p>

          <div className="items-center gap-2 mt-6">
              <h3 className="font-semibold text-lg">
                Vinod Kumar Baghel
              </h3>
              <p className="text-gray-500 text-sm">
                (Founder & Director)
              </p>
            </div>
        </div>

        {/* Founder Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-[#e8dfd6]">
          <div className=" items-center gap-4">
  <div className="rounded-3xl  bg-cover bg-center ">
<img src="./founder-new.png" alt="" className="rounded-3xl" />
  </div>
            {/* <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600 text-xl">
              VB
            </div> */}
            
          </div>

          {/* <p className="text-gray-600 italic">
            "My mission is to help every family in our community find the perfect match for their children.
            Marriage is a sacred bond, and I am committed to making this journey smooth and successful for everyone."
          </p> */}
        </div>
      </section>

      {/* ================= VALUES ================= */}
      <section className="py-24 bg-[#e9e2d8] text-center px-6">
        <p className="text-orange-600 font-semibold uppercase text-sm mb-3">
          Our Values
        </p>

        <h2 className="text-3xl font-bold mb-16">
          What We Stand For
        </h2>

        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {[
            {
              icon: <Heart className="text-orange-600" />,
              title: "Trust",
              desc: "Building relationships based on transparency and honesty.",
            },
            {
              icon: <Users className="text-orange-600" />,
              title: "Community",
              desc: "Serving our communities with dedication and respect.",
            },
            {
              icon: <Target className="text-orange-600" />,
              title: "Commitment",
              desc: "Going above and beyond to find the perfect match.",
            },
            {
              icon: <Award className="text-orange-600" />,
              title: "Excellence",
              desc: "Maintaining high standards in every interaction.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300"
            >
              <div className="w-14 h-14 mx-auto mb-6 rounded-xl bg-orange-100 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}

        </div>
      </section>

      {/* ================= COMMUNITIES ================= */}
      <section className="py-24 text-center px-6">
        <p className="text-orange-600 font-semibold uppercase text-sm mb-3">
          Our Communities
        </p>

        <h2 className="text-3xl font-bold mb-6">
          Proudly Serving
        </h2>

        <p className="text-gray-600 mb-12">
          We exclusively serve these vibrant communities with deep understanding of their traditions.
        </p>

        <div className="flex flex-wrap justify-center gap-8">

          {["Pal Community", "Baghel Community", "Dhangar Community"].map(
            (community, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-10 py-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300"
              >
                <h3 className="font-semibold text-lg">{community}</h3>
                <p className="text-sm opacity-90">
                  Dedicated matchmaking services
                </p>
              </div>
            )
          )}

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 bg-[#e9e2d8] text-center px-6">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Start Your Journey?
        </h2>

        <p className="text-gray-600 mb-8">
          Connect with us today and let us help you find your perfect life partner.
        </p>

        <button onClick={() =>
    window.open(
      "https://wa.me/917017225698?text=Hello%20Apna%20Vivah,%20I%20want%20to%20register%20for%20free.%20Please%20guide%20me.",
      "_blank"
    )
  }  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition">
          <ArrowRight size={18} />
        </button>
      </section>

    </div>
  );
};

export default AboutUs;
