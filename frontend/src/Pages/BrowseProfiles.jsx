import React, { useState, useEffect, useContext } from "react";
import {
  Filter,
  X,
  Search,
  Users,
  MapPin,
  Calendar,
  IndianRupee,
  Heart,
  RotateCcw,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const BrowseProfiles = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [incomeRange, setIncomeRange] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Calculate Age
  const calculateAge = (dob) => {
    if (!dob) return 0;

    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);

    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  useEffect(() => {
    const savedFilters = sessionStorage.getItem("browseFilters");

    if (savedFilters) {
      const filters = JSON.parse(savedFilters);

      setGender(filters.gender || "");
      setCity(filters.city || "");
      setMaritalStatus(filters.maritalStatus || "");
      setAgeRange(filters.ageRange || "");
      setIncomeRange(filters.incomeRange || "");
      setCurrentPage(filters.currentPage || 1);
    }
  }, []);




  useEffect(() => {
    sessionStorage.setItem(
      "browseFilters",
      JSON.stringify({
        gender,
        city,
        maritalStatus,
        ageRange,
        incomeRange,
        currentPage,
      })
    );
  }, [
    gender,
    city,
    maritalStatus,
    ageRange,
    incomeRange,
    currentPage,
  ]);


  // Same Profile Open When Back 
  useEffect(() => {
    const savedPosition = sessionStorage.getItem(
      "browseScrollPosition"
    );

    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, Number(savedPosition));
      }, 100);
    }
  }, [profiles]);


  // Fetch Profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profile?page=${currentPage}`
        );

        setProfiles(res.data.profiles || []);
        setTotalPages(res.data.totalPages || 1);

      } catch (err) {

        console.error(err);

        setError(
          err.response?.data?.message ||
          "Failed to load profiles"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [currentPage]);

  // Delete Profile
  const handleDelete = async (profileId) => {

    if (
      !window.confirm(
        "Are you sure you want to delete this profile?"
      )
    ) {
      return;
    }

    try {

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/profile/delete/${profileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfiles((prev) =>
        prev.filter((p) => p._id !== profileId)
      );

      toast.success("Profile deleted successfully!");

    } catch (err) {

      console.error(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to delete profile"
      );
    }
  };

  // Age Filter
  const checkAgeRange = (age) => {
    if (!ageRange) return true;

    const [min, max] = ageRange.split("-").map(Number);

    return age >= min && age <= max;
  };

  // Income Filter
  const checkIncomeRange = (income) => {
    if (!incomeRange) return true;

    const [min, max] = incomeRange.split("-").map(Number);

    return (
      Number(income) >= min &&
      Number(income) <= max
    );
  };

  // Filter Profiles
  const filteredProfiles = profiles.filter((profile) => {

    const age = calculateAge(profile.dob);

    return (
      (gender === "" ||
        profile.gender === gender) &&

      (city === "" ||
        profile.city
          ?.toLowerCase()
          .includes(city.toLowerCase())) &&

      (maritalStatus === "" ||
        profile.maritalStatus === maritalStatus) &&

      checkAgeRange(age) &&
      checkIncomeRange(profile.income)
    );
  });

  // Loading
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <p className="text-center mt-20 text-red-600">
        {error}
      </p>
    );
  }

  return (
    <section className="min-h-screen py-10 max-w-7xl mx-auto  px-4 md:px-6">




      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <h2 className="text-2xl lg:text-3xl font-bold">
            Browse Matches
          </h2>

          <p className="text-gray-500 mt-0">
            {/* {filteredProfiles.length} Profiles Found */}
          </p>

        </div>

        <button
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg transition"
        >
          <Filter size={20} />
          Filters
        </button>

      </div>


      {/* Filter Popup */}

      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Filter Profiles
                </h2>
                <p className="text-sm text-gray-500">
                  Find your perfect match
                </p>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Gender */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Users size={16} />
                    Gender
                  </label>

                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <MapPin size={16} />
                    City
                  </label>

                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Search City"
                      className="w-full h-10 rounded-lg border border-gray-300 pl-9 pr-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Calendar size={16} />
                    Age
                  </label>

                  <select
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  >
                    <option value="">Select Age</option>
                    <option value="18-20">18-20</option>
                    <option value="21-25">21-25</option>
                    <option value="26-30">26-30</option>
                    <option value="31-35">31-35</option>
                    <option value="36-40">36-40</option>
                  </select>
                </div>

                {/* Salary */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <IndianRupee size={16} />
                    Salary
                  </label>

                  <select
                    value={incomeRange}
                    onChange={(e) => setIncomeRange(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  >
                    <option value="">Select Salary</option>
                    <option value="200000-500000">2 LPA - 5 LPA</option>
                    <option value="600000-1000000">6 LPA - 10 LPA</option>
                    <option value="1100000-1500000">11 LPA - 15 LPA</option>
                    <option value="1600000-2000000">16 LPA - 20 LPA</option>
                    <option value="2100000-2500000">21 LPA - 25 LPA</option>
                    <option value="2600000-3000000">26 LPA - 30 LPA</option>
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Heart size={16} />
                    Marital Status
                  </label>

                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  >
                    <option value="">Select Status</option>
                    <option value="Unmarried">Unmarried</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>

              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6 pt-5 border-t">

                <button
                  onClick={() => {
                    setGender("");
                    setCity("");
                    setAgeRange("");
                    setIncomeRange("");
                    setMaritalStatus("");

                    sessionStorage.removeItem("browseFilters");
                  }}
                  className="h-10 px-5 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center gap-2 text-sm font-medium transition"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>

                <button
                  onClick={() => setShowFilters(false)}
                  className="h-10 px-6 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium shadow-md transition"
                >
                  Apply Filters
                </button>

              </div>

            </div>
          </div>
        </div>
      )}



      {/* Empty */}
      {filteredProfiles.length === 0 && (
        <div className="text-center text-gray-500 text-lg">
          No profiles found
        </div>
      )}

      {/* Profiles */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {filteredProfiles.map((profile) => (

          <div
            key={profile._id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
          >

            <img
              src={
                profile.photo ||
                "https://via.placeholder.com/300x400"
              }
              alt={profile.name}
              className="w-full h-[300px] object-cover object-top cursor-pointer hover:opacity-90 transition"
              onClick={() =>
                setSelectedImage(
                  profile.photo ||
                  "https://via.placeholder.com/300x400"
                )
              }
            />

            <div className="p-4">

              <h3 className="font-semibold capitalize text-lg">
                {profile.name}
              </h3>

              <p className="text-gray-500 text-sm">
                {profile.city}
              </p>

            </div>

            <div className="px-4 pb-4 text-sm">

              <div className="grid grid-cols-2 gap-3 mb-4">

                <div>
                  <p className="text-gray-400">
                    AGE
                  </p>

                  <p className="font-medium">
                    {calculateAge(profile.dob)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    INCOME
                  </p>

                  <p className="font-medium">
                    ₹{profile.income}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    EDUCATION
                  </p>

                  <p className="font-medium">
                    {profile.education}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">
                    PROFESSION
                  </p>

                  <p className="font-medium">
                    {profile.occupation}
                  </p>
                </div>

              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2">

                <button
                  onClick={() => {
                    sessionStorage.setItem(
                      "browseScrollPosition",
                      window.scrollY
                    );

                    navigate(`/browse-profile/${profile._id}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200"
                >
                  <FileText size={16} />
                  View Full Biodata
                </button>

                {user?.role === 'admin' && (

                  <div className="flex gap-2 mt-2">

                    <button
                      onClick={() =>
                        navigate(`/update-profile/${profile._id}`)
                      }
                      className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200"
                    >
                      <Edit size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(profile._id)
                      }
                      className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>

                  </div>
                )}

              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">

        {/* Previous */}
        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage((prev) => prev - 1)
          }
          className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50"
        >
          Previous
        </button>

        {/* Page Numbers */}
        {[...Array(totalPages)].map((_, index) => {

          const page = index + 1;

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg border ${currentPage === page
                ? "bg-red-500 text-white"
                : "bg-white"
                }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next */}
        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => prev + 1)
          }
          className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50"
        >
          Next
        </button>

      </div>




      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            ✕ Close
          </button>

          {/* Image */}
          <img
            src={selectedImage}
            alt="Profile Preview"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </section>
  );
};

export default BrowseProfiles;