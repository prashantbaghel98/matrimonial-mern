// BrowseProfiles.jsx
import React, { useState, useEffect } from "react";
import { FileText, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const BrowseProfiles = () => {
  const navigate = useNavigate();
const {user} = useContext(AuthContext)
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [gender, setGender] = useState("");
  const [caste, setCaste] = useState("");
  const [visible, setVisible] = useState(4);

  // Fetch profiles from backend
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8080/api/profile");
        setProfiles(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  // Delete profile function
  const handleDelete = async (profileId) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/profile/delete/${profileId}`);
      setProfiles(profiles.filter(p => p._id !== profileId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete profile");
    }
  };

  // Filter profiles
  const filteredProfiles = profiles.filter((profile) => {
    return (
      (gender === "" || profile.gender === gender) &&
      (caste === "" || profile.gotraFather === caste || profile.gotraMother === caste)
    );
  });

  if (loading) return <p className="text-center mt-20">Loading profiles...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <section className="bg-gray-50 min-h-screen py-20 px-6">
      {/* Heading and Filters */}
      <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Browse Matches</h2>

        <div className="flex gap-3 flex-wrap">
          <select
            onChange={(e) => setGender(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            onChange={(e) => setCaste(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="">Caste</option>
            <option value="Pal">Pal</option>
            <option value="Baghel">Baghel</option>
            <option value="Dhanger">Dhanger</option>
          </select>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProfiles.slice(0, visible).map((profile) => (
          <div
            key={profile._id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden relative"
          >
            {/* Image */}
            <img
              src={profile.photo || "https://via.placeholder.com/300x240"}
              alt={profile.name}
              className="w-full h-60 object-cover"
            />

            <div className="p-4">
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <p className="text-gray-500 text-sm">{profile.city}</p>
            </div>

            <div className="px-4 pb-4 text-sm">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-gray-400">HEIGHT</p>
                  <p className="font-medium">{profile.height}</p>
                </div>

                <div>
                  <p className="text-gray-400">RELIGION</p>
                  <p className="font-medium">{profile.religion || "Hindu"}</p>
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

              {/* Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate(`/browse-profile/${profile._id}`)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition"
                >
                  <FileText size={16} /> View Full Biodata
                </button>

                {/* Show Edit/Delete only if user is logged in */}
                {user && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => navigate(`/update-profile/${profile._id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition"
                    >
                      <Edit size={16} /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(profile._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {visible < filteredProfiles.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisible(visible + 4)}
            className="px-6 py-3 border rounded-full hover:bg-gray-100"
          >
            Load More Matches
          </button>
        </div>
      )}
    </section>
  );
};

export default BrowseProfiles;