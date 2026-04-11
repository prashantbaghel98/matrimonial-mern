import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#7a0f22] via-[#8b1d2c] to-[#a32334] text-white pt-20 pb-8 overflow-hidden">

      {/* Decorative Glow */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Top Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/20">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-2xl font-semibold tracking-wide">
                Apna Vivah
              </h3>
            </div>

            <p className="text-white/80 leading-relaxed">
              A trusted matrimonial platform exclusively for Pal, Baghel,
              and Dhangar communities. We build lasting relationships
              based on trust and tradition.
            </p>

            {/* Social Icons */}
            {/* <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-yellow-400 hover:text-black transition"
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-yellow-400 hover:text-black transition"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-yellow-400 hover:text-black transition"
              >
                <Twitter size={18} />
              </a>
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-yellow-400">
              Quick Links
            </h4>

            <ul className="space-y-3 text-white/80">
              <li>
                <Link to="/" className="hover:text-yellow-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-yellow-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/membership" className="hover:text-yellow-400 transition">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="hover:text-yellow-400 transition">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-400 transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Communities */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-yellow-400">
              Our Communities
            </h4>

            <ul className="space-y-3 text-white/80">
              <li className="hover:text-yellow-400 transition">
                Pal Community
              </li>
              <li className="hover:text-yellow-400 transition">
                Baghel Community
              </li>
              <li className="hover:text-yellow-400 transition">
                Dhangar Community
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-yellow-400">
              Contact Us
            </h4>

            <div className="space-y-4 text-white/80">

              <a
                href="tel:+917017225698"
                className="flex items-start gap-3 hover:text-yellow-400 transition"
              >
                <Phone size={18} className="text-yellow-400 mt-1" />
                <span>+91 7017225698</span>
              </a>

              <a
                href="mailto:info@apnavivah.com"
                className="flex items-start gap-3 hover:text-yellow-400 transition"
              >
                <Mail size={18} className="text-yellow-400 mt-1" />
                <span>contact@apnavivah.com</span>
              </a>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-yellow-400 mt-1" />
                <span>Ghaziabad, India</span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-8 text-white/70 text-sm">

          <p>
            © {new Date().getFullYear()} Apna Vivah. All rights reserved. Developed By{" "}
            <a
              href="https://worldtricks4u.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "white", textDecoration: "none", fontWeight: "500" }}
            >
              Worldtricks4u
            </a>
          </p>

          <p className="mt-4 md:mt-0">
            Managed by{" "}
            <span className="text-yellow-400 font-medium">
              Vinod Kumar Baghel
            </span>
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
