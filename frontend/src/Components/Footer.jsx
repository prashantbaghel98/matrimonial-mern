
import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = t("footer.quickLinks", {
    returnObjects: true,
  });

  const communities = t("footer.communities", {
    returnObjects: true,
  });

  const contact = t("footer.contact", {
    returnObjects: true,
  });

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
                {t("footer.title")}
              </h3>
            </div>

            <p className="text-white/80 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-yellow-400">
              Quick Links
            </h4>

            <ul className="space-y-3 text-white/80">
              {Array.isArray(quickLinks) &&
                quickLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="hover:text-yellow-400 transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Communities */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-yellow-400">
              Our Communities
            </h4>

            <ul className="space-y-3 text-white/80">
              {Array.isArray(communities) &&
                communities.map((community, index) => (
                  <li
                    key={index}
                    className="hover:text-yellow-400 transition"
                  >
                    {community}
                  </li>
                ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-yellow-400">
              Contact Us
            </h4>

            <div className="space-y-4 text-white/80">
              <a
                href={`tel:${contact?.phone}`}
                className="flex items-start gap-3 hover:text-yellow-400 transition"
              >
                <Phone size={18} className="text-yellow-400 mt-1" />
                <span>{contact?.phone}</span>
              </a>

              <a
                href={`mailto:${contact?.email}`}
                className="flex items-start gap-3 hover:text-yellow-400 transition"
              >
                <Mail size={18} className="text-yellow-400 mt-1" />
                <span>{contact?.email}</span>
              </a>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-yellow-400 mt-1" />
                <span>{contact?.address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}

        <div className="flex mt-5 -mb-5 flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">

          {/* Copyright */}
          <p className="text-sm text-white/70 leading-6">
            {t("footer.copyright")}{" "}
            <a
              href="https://worldtricks4u.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white hover:text-yellow-400 transition-colors duration-300"
            >
              Worldtricks4u
            </a>
          </p>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-2 text-sm">
            <a
              href="/"
              className="text-white/70 hover:text-yellow-400 transition-colors duration-300"
            >
              {t("footer.links.home")}
            </a>

            <a
              href="/privacy-policy"
              className="text-white/70 hover:text-yellow-400 transition-colors duration-300"
            >
              {t("footer.links.privacyPolicy")}
            </a>

            <a
              href="/terms"
              className="text-white/70 hover:text-yellow-400 transition-colors duration-300"
            >
              {t("footer.links.termsConditions")}
            </a>

            <a
              href="/disclaimer"
              className="text-white/70 hover:text-yellow-400 transition-colors duration-300"
            >
              {t("footer.links.disclaimer")}
            </a>

            <a
              href="/refund"
              className="text-white/70 hover:text-yellow-400 transition-colors duration-300"
            >
              {t("footer.links.refundPolicy")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
