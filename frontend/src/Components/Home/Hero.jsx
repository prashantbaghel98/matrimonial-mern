import React from "react";
import { Heart, ShieldCheck, Users, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Hero = () => {
  const navigate = useNavigate();


  return (
    <section className="w-full bg-[#faf7f5] pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT CONTENT */}
          <div>

            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart size={16} />
              Trusted by 1000+ Families
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Find Your Perfect{" "}
              <span className="text-red-600">Life</span> <br />
              <span className="text-orange-600">Partner</span> with{" "}
              <span className="text-red-600">Apna Vivah</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-gray-600 text-lg max-w-xl">
              Exclusive matrimonial services for <b>Pal, Baghel,</b> and{" "}
              <b>Dhangar</b> communities. We unite hearts with tradition and trust.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button onClick={()=>(navigate('/contact'))} className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 w-full sm:w-[40%] py-3 rounded-xl font-semibold shadow-md hover:scale-105 transition">
                Register Now Free →
              </button>

              <button onClick={()=>(navigate('/membership'))} className="border-2 border-orange-500 text-orange-600 px-8 py-3 w-full sm:w-[40%] rounded-xl font-semibold hover:bg-orange-50 transition">
                View Plans
              </button>
            </div>

            {/* Bottom Features */}
            <div className="flex flex-wrap gap-8 mt-10 text-gray-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-red-500" size={20} />
                100% Verified Profiles
              </div>

              <div className="flex items-center gap-2">
                <Users className="text-orange-500" size={20} />
                5000+ Active Members
              </div>
            </div>
          </div>

          {/* RIGHT SIDE CARD */}
          <div className=" flex justify-center h-fit">
               <img src="./banner-image.png" alt="" className="relative rounded-xl"/>  
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
