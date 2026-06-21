import React, { useState, useEffect, useContext } from "react";
import { Menu, X } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const navLinkClass = ({ isActive }) =>
    `pb-1 transition-all duration-300 ${
      isActive
        ? "text-red-600 border-b-2 border-red-600 font-semibold"
        : "text-gray-700 hover:text-red-600"
    }`;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="h-20 flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="Apna Vivah"
                className="h-14 w-auto object-contain"
              />
            </Link>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">

              <NavLink to="/" className={navLinkClass}>
                {t("navbar.home")}
              </NavLink>

              <NavLink
                to="/browse-profile"
                className={navLinkClass}
              >
                {t("navbar.browseProfile")}
              </NavLink>

              <NavLink
                to="/membership"
                className={navLinkClass}
              >
                {t("navbar.membership")}
              </NavLink>

              <NavLink
                to="/success-stories"
                className={navLinkClass}
              >
                {t("navbar.successStories")}
              </NavLink>

              <NavLink
                to="/contact"
                className={navLinkClass}
              >
                {t("navbar.contact")}
              </NavLink>

            </nav>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-4">

              <LanguageSwitcher />

              {user ? (
                <>
                  {user?.role === "user" && (
                    <NavLink
                      to="/user/dashboard"
                      className="text-gray-700 hover:text-red-600"
                    >
                      {t("navbar.dashboard")}
                    </NavLink>
                  )}

                  {user?.role === "admin" && (
                    <>
                      <NavLink
                        to="/admin/dashboard"
                        className="text-gray-700 hover:text-red-600"
                      >
                        {t("navbar.dashboard")}
                      </NavLink>

                      <NavLink
                        to="/admin/membership"
                        className="text-gray-700 hover:text-red-600"
                      >
                        Membership
                      </NavLink>
                    </>
                  )}

                  <button
                    onClick={logout}
                    className="px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    {t("navbar.logout")}
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:scale-105 transition duration-300"
                >
                  {t("navbar.login")}
                </NavLink>
              )}
            </div>

            {/* Mobile Right */}
            <div className="md:hidden flex items-center gap-3">

              <LanguageSwitcher />

              <button
                onClick={() => setIsOpen(true)}
                className="text-gray-700"
              >
                <Menu size={28} />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        onClick={closeMenu}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transition-transform duration-300 ${
          isOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-5 border-b">

          <img
            src="/logo.png"
            alt="logo"
            className="h-12"
          />

          <button onClick={closeMenu}>
            <X size={24} />
          </button>

        </div>

        {/* Mobile Nav */}
        <nav className="flex flex-col p-6 gap-6 text-base font-medium">

          <NavLink
            to="/"
            onClick={closeMenu}
            className={navLinkClass}
          >
            {t("navbar.home")}
          </NavLink>

          <NavLink
            to="/browse-profile"
            onClick={closeMenu}
            className={navLinkClass}
          >
            {t("navbar.browseProfile")}
          </NavLink>

          <NavLink
            to="/membership"
            onClick={closeMenu}
            className={navLinkClass}
          >
            {t("navbar.membership")}
          </NavLink>

          <NavLink
            to="/success-stories"
            onClick={closeMenu}
            className={navLinkClass}
          >
            {t("navbar.successStories")}
          </NavLink>

          <NavLink
            to="/about"
            onClick={closeMenu}
            className={navLinkClass}
          >
            {t("navbar.about")}
          </NavLink>

          <NavLink
            to="/contact"
            onClick={closeMenu}
            className={navLinkClass}
          >
            {t("navbar.contact")}
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/profile-create"
                onClick={closeMenu}
                className={navLinkClass}
              >
                Create Profile
              </NavLink>

              {user?.role === "user" && (
                <NavLink
                  to="/user/dashboard"
                  onClick={closeMenu}
                  className={navLinkClass}
                >
                  Dashboard
                </NavLink>
              )}

              {user?.role === "admin" && (
                <NavLink
                  to="/admin/dashboard"
                  onClick={closeMenu}
                  className={navLinkClass}
                >
                  Dashboard
                </NavLink>
              )}

              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="bg-red-600 text-white py-3 rounded-xl"
              >
                {t("navbar.logout")}
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={closeMenu}
              className="bg-red-600 text-white text-center py-3 rounded-xl"
            >
              {t("navbar.login")}
            </NavLink>
          )}
        </nav>
      </div>

      {/* Header Spacer */}
      <div className="h-20"></div>
    </>
  );
};

export default Header;