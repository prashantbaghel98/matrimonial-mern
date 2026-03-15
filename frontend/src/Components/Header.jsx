import React, { useState, useEffect, useContext } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  // Close menu on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Disable scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      <header className="w-full bg-white fixed top-0 left-0 z-50 shadow-sm">
        <div className="max-w-9xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="Apna Vivah"
                className="w-32 sm:w-36 md:w-40 object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center  gap-8 text-sm lg:text-base font-medium text-gray-700">
              <Link to="/" className="hover:text-red-600">Home</Link>
              <Link to="/browse-profile" className="hover:text-red-600">Browse Profile</Link>

              {/* Auth Buttons */}
              {user ? (
                <>
                  <Link to="/profile-create" className="hover:text-red-600">Create Profile</Link>
                  <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                
                  <Link to="/about" className="hover:text-red-600">About</Link>
                  <Link to="/membership" className="hover:text-red-600">Membership</Link>
                  <Link to="/success-stories" className="hover:text-red-600">Success Stories</Link>
                  <Link to="/contact" className="hover:text-red-600">Contact</Link>
                    <Link
                    to="/login"
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Login
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Toggle */}
            <button
              className="md:hidden text-gray-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        onClick={closeMenu}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="font-semibold text-lg text-gray-800">Menu</h2>
          <button onClick={closeMenu}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-6 p-6 text-base font-medium text-gray-700">
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/browse-profile" onClick={closeMenu}>Browse Profile</Link>

          {/* Auth Buttons Mobile */}
          {user ? (
            <>
              <Link to="/profile-create" className="hover:text-red-600">Create Profile</Link>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/about" onClick={closeMenu}>About</Link>
              <Link to="/membership" onClick={closeMenu}>Membership</Link>
              <Link to="/success-stories" onClick={closeMenu}>Success Stories</Link>
              <Link to="/contact" onClick={closeMenu}>Contact</Link>
              <Link
                to="/login"
                onClick={closeMenu}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-center"
              >
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
};

export default Header;