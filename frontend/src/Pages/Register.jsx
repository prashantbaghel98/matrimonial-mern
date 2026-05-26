import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // ================= HANDLE SUBMIT =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    try {

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/register`,
        formData
      );

      setSuccess(res.data.message);

      // Redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Registration failed"
      );

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >

        <h2 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h2>

        {/* Success Message */}
        {success && (
          <p className="text-green-600 text-sm mb-4 text-center">
            {success}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 outline-none focus:border-red-500"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 outline-none focus:border-red-500"
          value={formData.username}
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 outline-none focus:border-red-500"
          value={formData.email}
          onChange={handleChange}
          required
        />

        {/* Mobile */}
        <input
          type="number"
          name="mobile"
          placeholder="Mobile Number"
          className="w-full border border-gray-300 p-3 rounded-lg mb-4 outline-none focus:border-red-500"
          value={formData.mobile}
          onChange={handleChange}
          required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded-lg mb-6 outline-none focus:border-red-500"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg transition"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p className="text-center text-sm mt-5">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-red-500 font-semibold"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
};

export default Register;