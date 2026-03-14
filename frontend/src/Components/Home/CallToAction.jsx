import React from "react";
import { Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";


const CallToAction = () => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full bg-[#f3ede5] py-24 overflow-hidden">

      {/* Soft Background Glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-orange-300/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-red-400/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">

        {/* Icon */}
        {/* <div className="w-20 h-20 mx-auto mb-8 rounded-full 
                        bg-white shadow-lg flex items-center justify-center
                        animate-pulse">
          <Heart className="text-orange-600" size={36} />
        </div> */}

        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-bold text-[#2d2a26] leading-tight">
          Ready to Find Your{" "}
          <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
            Life Partner?
          </span>
        </h2>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Join thousands of happy families from Pal, Baghel, and Dhangar communities.
          Register today and take the first step towards your perfect match.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-6">

          <button className="group relative px-10 py-4 rounded-xl font-semibold text-white 
                             bg-gradient-to-r from-red-600 to-orange-500
                             shadow-lg hover:shadow-2xl hover:scale-105
                             transition duration-300">

            <span className="flex items-center gap-3"><a target="blank" href="https://wa.me/917017225698?text=Hello%20Apna%20Vivah,%20I%20want%20to%20register%20for%20free.%20Please%20guide%20me.
">            Register Free on WhatsApp</a>
              <ArrowRight className="group-hover:translate-x-2 transition" size={18} />
            </span>
          </button>

          <button onClick={()=>navigate('/contact')} className="px-10 py-4 rounded-xl font-semibold 
                             border-2 border-orange-500 text-orange-600
                             hover:bg-orange-500 hover:text-white
                             transition duration-300">
            Contact Us
          </button>

        </div>

        {/* Bottom Info */}
        <p className="mt-8 text-sm text-gray-500">
          Free registration • No hidden charges • 100% verified profiles
        </p>

      </div>
    </section>
  );
};

export default CallToAction;
