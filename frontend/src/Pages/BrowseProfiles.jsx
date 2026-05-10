import React, { useState, useEffect, useContext } from "react";
import { FileText, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const BrowseProfiles = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

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

  // Calculate Age
  const calculateAge = (dob) => {
    if (!dob) return 0;

    const birthDate = new Date(dob);
    const diff = Date.now() - birthDate.getTime();
    const ageDate = new Date(diff);

    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

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
    <section className="bg-gray-50 min-h-screen py-20 px-4 md:px-6">

      {/* Heading + Filters */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 gap-6">

        <h2 className="text-3xl font-bold text-gray-800">
          Browse Matches
        </h2>

        {/* Filters */}
        <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto">

          {/* Gender */}
          <select
            onChange={(e) => setGender(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white"
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {/* City */}
          <input
            type="text"
            placeholder="City"
            onChange={(e) => setCity(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          />

          {/* Age */}
          <select
            onChange={(e) => setAgeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white"
          >
            <option value="">Age</option>
            <option value="18-20">18 - 20</option>
            <option value="21-25">21 - 25</option>
            <option value="26-30">26 - 30</option>
            <option value="31-35">31 - 35</option>
            <option value="36-40">36 - 40</option>
          </select>

          {/* Salary */}
          <select
            onChange={(e) => setIncomeRange(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white"
          >
            <option value="">Salary</option>

            <option value="200000-500000">
              2LPA - 5LPA
            </option>

            <option value="600000-1000000">
              6LPA - 10LPA
            </option>

            <option value="1100000-1500000">
              11LPA - 15LPA
            </option>

            <option value="1600000-2000000">
              16LPA - 20LPA
            </option>

            <option value="2100000-2500000">
              21LPA - 25LPA
            </option>

            <option value="2600000-3000000">
              26LPA - 30LPA
            </option>

          </select>

          {/* Marital Status */}
          <select
            onChange={(e) =>
              setMaritalStatus(e.target.value)
            }
            className="px-3 py-2 border rounded-lg bg-white"
          >
            <option value="">Marital Status</option>

            <option value="Unmarried">
              Unmarried
            </option>

            <option value="Married">
              Married
            </option>

            <option value="Divorced">
              Divorced
            </option>

            <option value="Widowed">
              Widowed
            </option>

            <option value="Separated">
              Separated
            </option>

          </select>

        </div>
      </div>

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
              className="w-full h-[400px] object-cover object-top"
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
                  onClick={() =>
                    navigate(`/browse-profile/${profile._id}`)
                  }
                  className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200"
                >
                  <FileText size={16} />
                  View Full Biodata
                </button>

                {user && (

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
              className={`px-4 py-2 rounded-lg border ${
                currentPage === page
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

    </section>
  );
};

export default BrowseProfiles;