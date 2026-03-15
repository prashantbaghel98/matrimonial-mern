
import React, { useContext, useEffect, useState } from "react";
import { User, GraduationCap, Users, Heart, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const ProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!profile) return <p className="text-center mt-10">Profile not found</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-20 px-2 sm:px-4 relative">

      {/* Close Button */}
      <button
        onClick={() => navigate("/browse-profile")}
        className="mb-4 sm:absolute left-[70%] top-[10%] bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
      >
        ← Back
      </button>


      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-3 sm:p-8 space-y-8">

        {/* Header */}
        <div className="flex items-center gap-6">
          <img
            src={profile.photo || "https://via.placeholder.com/150"}
            alt={profile.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">{profile.name}</h2>
            <p className="text-gray-500">
              {profile.occupation} ({profile.city})
            </p>
            <div className="flex gap-3 mt-2 text-sm">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded">
                {profile.maritalStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Personal Profile */}
        <section>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <User size={18} /> Personal Profile
          </h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-400">Date of Birth</p>
              <p>{profile.dob}</p>
            </div>
            <div>
              <p className="text-gray-400">Time of Birth</p>
              <p>{profile.time || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Place of Birth</p>
              <p>{profile.place || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Height</p>
              <p>{profile.height || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Colour</p>
              <p>{profile.colour || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Father Gotra</p>
              <p>{profile.gotraFather || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Mother Gotra</p>
              <p>{profile.gotraMother || "-"}</p>
            </div>

            {user?<>  <div>
                  <p className="text-gray-400">Contact No.</p>
                  <p>{profile.contactNo || "-"}</p>
                </div>

                <div>
                  <p className="text-gray-400">City</p>
                  <p>{profile.city || "-"}</p>
                </div></>:<></>}
              
            
            <div>
              <p className="text-gray-400">Full Address</p>
              <p>{profile.fullAddress || "-"}</p>
            </div>

        

            <div>
              <p className="text-gray-400">Gender</p>
              <p>{profile.gender || "-"}</p>
            </div>
          </div>
        </section>

        {/* Education & Career */}
        <section>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <GraduationCap size={18} /> Education & Career
          </h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-400">Education</p>
              <p>{profile.education || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Occupation</p>
              <p>{profile.occupation || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Income</p>
              <p>₹{profile.income || "-"}</p>
            </div>
          </div>
        </section>

        {/* Family */}
        <section>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Users size={18} /> Family Details
          </h3>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-gray-400">Father Name</p>
              <p>{profile.fatherName || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Father Occupation</p>
              <p>{profile.fatherOccupation || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Mother Name</p>
              <p>{profile.motherName || "-"}</p>
            </div>
            <div>
              <p className="text-gray-400">Mother Occupation</p>
              <p>{profile.motherOccupation || "-"}</p>
            </div>
          </div>
        </section>

        {/* Partner Expectations */}
        <section>
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Heart size={18} /> Partner Expectations
          </h3>
          <div className="bg-gray-50 p-4 rounded-xl grid grid-cols-2 gap-4 text-sm">
            <p>✔ Age: 24 - 28 Years</p>
            <p>✔ Height: 5'2 to 5'7</p>
            <p>✔ Never Married</p>
            <p>✔ Religion: Hindu</p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ProfileDetails;

