import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
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
import Loader from "../Components/Loader";

const PLACEHOLDER_IMG = "https://placehold.co/300x400?text=No+Photo";
const API_URL = import.meta.env.VITE_API_URL;

const BrowseProfiles = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters (applied instantly)
  const [nameSearch, setNameSearch] = useState("");
  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [incomeRange, setIncomeRange] = useState("");

  // City has its own "raw" input + debounced value, so we don't refetch on every keystroke
  const [cityInput, setCityInput] = useState("");
  const [city, setCity] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  // Ref used only to skip saving-to-sessionStorage on the very first render
  const hasLoadedFromStorage = useRef(false);
  const abortControllerRef = useRef(null);

  // ---------- Helpers ----------
  const calculateAge = (dob) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // ---------- Load saved filters (once, on mount) ----------
  useEffect(() => {
    const savedFilters = sessionStorage.getItem("browseFilters");
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters);
        setNameSearch(filters.nameSearch || "");
        setGender(filters.gender || "");
        setCity(filters.city || "");
        setCityInput(filters.city || "");
        setMaritalStatus(filters.maritalStatus || "");
        setAgeRange(filters.ageRange || "");
        setIncomeRange(filters.incomeRange || "");
        setCurrentPage(filters.currentPage || 1);
      } catch {
        sessionStorage.removeItem("browseFilters");
      }
    }
    hasLoadedFromStorage.current = true;
  }, []);

  // ---------- Persist filters ----------
  useEffect(() => {
    if (!hasLoadedFromStorage.current) return; // avoid overwriting saved data on first render
    sessionStorage.setItem(
      "browseFilters",
      JSON.stringify({nameSearch, gender, city, maritalStatus, ageRange, incomeRange, currentPage })
    );
  }, [nameSearch, gender, city, maritalStatus, ageRange, incomeRange, currentPage]);

  // ---------- Debounce the city text input ----------
  useEffect(() => {
    const timer = setTimeout(() => {
      setCity(cityInput.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [cityInput]);

  // ---------- Reset to page 1 whenever a filter changes (not when page itself changes) ----------
  useEffect(() => {
    if (!hasLoadedFromStorage.current) return;
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameSearch, gender, city, maritalStatus, ageRange, incomeRange]);

  // ---------- Restore scroll position once, then clear it ----------
  useEffect(() => {
    const savedPosition = sessionStorage.getItem("browseScrollPosition");
    if (savedPosition && profiles.length > 0) {
      const t = setTimeout(() => {
        window.scrollTo(0, Number(savedPosition));
        sessionStorage.removeItem("browseScrollPosition"); // only restore once
      }, 100);
      return () => clearTimeout(t);
    }
  }, [profiles]);



  // ---------- Fetch all profiles ----------

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `${API_URL}/api/profile`
        );

        const profileData =
          res.data.profiles || [];

        setAllProfiles(profileData);

      } catch (error) {
        console.error(
          "Profile fetch error:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
          "Failed to load profiles"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();

  }, []);


  // ---------- Frontend profile filtering ----------

  useEffect(() => {

    let filteredData = [
      ...allProfiles
    ];


    // Name filter

    if (nameSearch.trim()) {
      const searchedName = nameSearch
        .trim()
        .toLowerCase();

      filteredData = filteredData.filter((profile) => {
        const profileName = String(
          profile.name || ""
        )
          .trim()
          .toLowerCase();

        return profileName.includes(searchedName);
      });
    }

    // Gender filter

    if (gender) {

      filteredData =
        filteredData.filter(
          (profile) =>

            profile.gender
              ?.trim()
              .toLowerCase() ===

            gender
              .trim()
              .toLowerCase()
        );

    }


    // City filter

    if (city) {

      filteredData =
        filteredData.filter(
          (profile) =>

            profile.city
              ?.trim()
              .toLowerCase()
              .includes(
                city
                  .trim()
                  .toLowerCase()
              )
        );

    }


    // Marital status filter

    if (maritalStatus) {

      filteredData =
        filteredData.filter(
          (profile) =>

            profile.maritalStatus
              ?.trim()
              .toLowerCase() ===

            maritalStatus
              .trim()
              .toLowerCase()
        );

    }


    // Age filter

    if (ageRange) {

      const [
        minimumAge,
        maximumAge
      ] = ageRange
        .split("-")
        .map(Number);


      filteredData =
        filteredData.filter(
          (profile) => {

            const profileAge =
              calculateAge(
                profile.dob
              );

            return (
              profileAge >=
              minimumAge &&

              profileAge <=
              maximumAge
            );

          }
        );

    }


    // Income filter

    if (incomeRange) {

      const [
        minimumIncome,
        maximumIncome
      ] = incomeRange
        .split("-")
        .map(Number);


      filteredData =
        filteredData.filter(
          (profile) => {

            /*
            Removes commas and
            other characters.
  
            Example:
  
            ₹8,00,000
            becomes
            800000
            */

            const profileIncome =
              Number(
                String(
                  profile.income ||
                  0
                ).replace(
                  /[^0-9]/g,
                  ""
                )
              );


            return (

              profileIncome >=
              minimumIncome &&

              profileIncome <=
              maximumIncome

            );

          }
        );

    }


    setProfiles(
      filteredData
    );

    setTotalCount(
      filteredData.length
    );

    setTotalPages(1);

  }, [
    nameSearch,

    allProfiles,

    gender,

    city,

    maritalStatus,

    ageRange,

    incomeRange

  ]);

  // ---------- Delete ----------
  const handleDelete = useCallback(
    async (profileId) => {
      if (!window.confirm("Are you sure you want to delete this profile?")) return;
      try {
        await axios.delete(`${API_URL}/api/profile/delete/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfiles((prev) => prev.filter((p) => p._id !== profileId));
        setTotalCount((prev) => Math.max(0, prev - 1));
        toast.success("Profile deleted successfully!");
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to delete profile");
      }
    },
    [token]
  );

  const resetFilters = () => {
    setNameSearch("");
    setGender("");
    setCityInput("");
    setCity("");
    setAgeRange("");
    setIncomeRange("");
    setMaritalStatus("");
    sessionStorage.removeItem("browseFilters");
  };

  // ---------- Loading (first load only) ----------
  if (loading && profiles.length === 0) {
    return (
      <Loader />
    );
  }

  if (error) {
    return <p className="text-center mt-20 text-red-600">{error}</p>;
  }

  return (
    <section className="min-h-screen py-10 max-w-7xl mx-auto px-4 md:px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold">Browse Matches</h2>
          <p className="text-gray-500 mt-0">{totalCount} Profiles Found</p>
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
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Filter Profiles</h2>
                <p className="text-sm text-gray-500">Find your perfect match</p>
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Name Search */}

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                    <Search size={16} />
                    Name
                  </label>

                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={nameSearch}
                      onChange={(e) =>
                        setNameSearch(e.target.value)
                      }
                      placeholder="Search by name"
                      className="w-full h-10 rounded-lg border border-gray-300 pl-9 pr-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    />
                  </div>
                </div>
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
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
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

              <div className="flex justify-end gap-3 mt-6 pt-5 border-t">
                <button
                  onClick={resetFilters}
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

      {/* Subtle loading indicator while re-fetching filtered/paged data */}
      {loading && profiles.length > 0 && (
        <div className="text-center text-sm text-gray-400 mb-4">Updating results…</div>
      )}

      {/* Empty */}
      {!loading && profiles.length === 0 && (
        <div className="text-center text-gray-500 text-lg">No profiles found</div>
      )}

      {/* Profiles */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {profiles.map((profile) => (
          <div key={profile._id} className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden">
            <img
              src={profile.photo || PLACEHOLDER_IMG}
              alt={profile.name}
              loading="lazy"
              className="w-full h-[300px] object-cover object-top cursor-pointer hover:opacity-90 transition"
              onClick={() => setSelectedImage(profile.photo || PLACEHOLDER_IMG)}
            />
            <div className="p-4">
              <h3 className="font-semibold capitalize text-lg">{profile.name}</h3>
              <p className="text-gray-500 text-sm">{profile.city}</p>
            </div>
            <div className="px-4 pb-4 text-sm">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-gray-400">AGE</p>
                  <p className="font-medium">{calculateAge(profile.dob)}</p>
                </div>
                <div>
                  <p className="text-gray-400">INCOME</p>
                  <p className="font-medium">₹{profile.income}</p>
                </div>
                <div>
                  <p className="text-gray-400">EDUCATION</p>
                  <p className="font-medium">{profile.education}</p>
                </div>
                <div>
                  <p className="text-gray-400">PROFESSION</p>
                  <p className="font-medium">{profile.occupation}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    sessionStorage.setItem("browseScrollPosition", window.scrollY);
                   navigate(`/browse-profile/${profile._id}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200"
                >
                  <FileText size={16} />
                  View Full Biodata
                </button>
                {user?.role === "admin" && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => navigate(`/update-profile/${profile._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(profile._id)}
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
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg border ${currentPage === page ? "bg-red-500 text-white" : "bg-white"
                  }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            ✕ Close
          </button>
          <img
            src={selectedImage}
            alt="Profile Preview"
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
          />
        </div>
      )}
    </section>
  )
};

export default BrowseProfiles;
