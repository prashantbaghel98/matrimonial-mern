
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const CreateProfile = ({ mode = "create" }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);



  const [formData, setFormData] = useState({
    name: "", dob: "", time: "", place: "", height: "", colour: "",
    education: "", occupation: "", income: "", gotraFather: "", gotraMother: "",
    fatherName: "", fatherOccupation: "", motherName: "", motherOccupation: "",
    fullAddress: "", city: "", residenceAddress: "", contactNo: "",
    gender: "", maritalStatus: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  const formatDateForInput = (date) => {
  if (!date) return "";
  const parts = date.split("-");
  if (parts.length !== 3) return date;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

  // Fetch existing profile data if update mode
  useEffect(() => {
    if (mode === "update" && id) {
      const fetchProfile = async () => {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile/${id}`);
          setFormData(res.data);
          if (res.data.photo) setPreview(res.data.photo);
        } catch (err) {
          console.error(err);
          setMessage("Failed to fetch profile data");
        }
      };
      fetchProfile();
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (photo) data.append("photo", photo);

    try {
      let res;
      if (mode === "create") {
        res = await axios.post(`${import.meta.env.VITE_API_URL}/api/profile/create`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success(res.data.message || "Profile created successfully!");

        setTimeout(() => {
          navigate("/browse-profile");
        }, 1000);
      } else {
        res = await axios.put(`${import.meta.env.VITE_API_URL}/api/profile/update/${id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Profile updated successfully!");

        setTimeout(() => {
          navigate("/browse-profile");
        }, 1000);
      }

      console.log(res.data);

    } catch (err) {
      // console.error(err);
      toast.error(err.response.data.message || "Something went wrong");
      setMessage(mode === "create" ? "Error creating profile" : "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // Delete profile
  // const handleDelete = async () => {
  //   if (!window.confirm("Are you sure you want to delete this profile?")) return;

  //   try {
  //     setLoading(true);
  //     console.log(token)
  //     await axios.delete(`${import.meta.env.VITE_API_URL}/api/profile/delete/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // ✅ SEND TOKEN
  //       },
  //     });
  //     setMessage("Profile deleted successfully!");
  //     navigate("/browse-profile");
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("Error deleting profile");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const inputFields = [
    { label: "Name", name: "name" },
    { label: "Date of Birth", name: "dob", type: "date" },
    // { label: "Time of Birth", name: "time", type: "time" },
    // { label: "Place of Birth", name: "place" },
    { label: "Height", name: "height" },
    { label: "Education", name: "education" },
    { label: "Occupation", name: "occupation" },
    { label: "Income", name: "income", type: "number" },
    { label: "Father Gotra", name: "gotraFather" },
    { label: "Mother Gotra", name: "gotraMother" },
    { label: "Father Name", name: "fatherName" },
    { label: "Father Occupation", name: "fatherOccupation" },
    { label: "Mother Name", name: "motherName" },
    { label: "Mother Occupation", name: "motherOccupation" },
    { label: "Full Address", name: "fullAddress" },
    { label: "City", name: "city" },
    { label: "Contact Number", name: "contactNo" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center mt-20 p-6">
      <div className="max-w-6xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden grid md:grid-cols-3">

        {/* Photo Panel */}
        <div className="bg-purple-50 p-8 flex flex-col items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-48 h-48 object-cover rounded-full border-4 border-purple-200 shadow-lg mb-6"
            />
          ) : (
            <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-6">
              Preview
            </div>
          )}

          <label className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-full cursor-pointer transition-all">
            {mode === "create" ? "Upload Photo" : "Change Photo"}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        {/* Form Panel */}
        <div className="md:col-span-2 p-10">

          {/* Title + Back Button */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-purple-700">
              {mode === "create" ? "Create Your Profile" : "Update Your Profile"}
            </h2>

            {mode === "update" && (
              <button
                type="button"
                onClick={() => navigate("/browse-profile")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-5 py-2 rounded-lg transition"
              >
                ← Back
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputFields.map(field => (
              <div className="relative w-full" key={field.name}>
                <input
                  type={field.type || "text"}
                  name={field.name}
                  onChange={handleChange}
                  value={formData[field.name] || ""}
                  placeholder=" "
                  required
                  className="peer w-full border-b-2 border-gray-300 focus:border-purple-500 outline-none pt-5 pb-2 bg-transparent transition-colors"
                />
                <label className="absolute left-0 top-0 text-gray-400 text-sm transition-all 
                  peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                  peer-focus:top-0 peer-focus:text-purple-500 peer-focus:text-sm">
                  {field.label}
                </label>
              </div>
            ))}

            {/* Select Fields */}
            {[
              { label: "Colour", name: "colour", options: ["Fair", "Wheatish", "Brown", "Dark"] },
              { label: "Gender", name: "gender", options: ["Male", "Female"] },
              { label: "Marital Status", name: "maritalStatus", options: ["Unmarried", "Married", "Divorced", "Widowed", "Separated"] }
            ].map(sel => (
              <div className="relative w-full" key={sel.name}>
                <select
                  name={sel.name}
                  onChange={handleChange}
                  value={formData[sel.name] || ""}
                  required
                  className="peer w-full border-b-2 border-gray-300 focus:border-purple-500 outline-none pt-5 pb-2 bg-transparent text-gray-700"
                >
                  <option value="" disabled hidden></option>
                  {sel.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <label className="absolute left-0 top-0 text-gray-400 text-sm transition-all
                  peer-focus:top-0 peer-focus:text-purple-500 peer-focus:text-sm">
                  {sel.label}
                </label>
              </div>
            ))}

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 text-center mt-6">
              <button
                type="submit"
                className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold px-10 py-3 rounded-full shadow-lg hover:scale-105 transition-transform"
                disabled={loading}
              >
                {loading ? "Submitting..." : mode === "create" ? "Create Profile" : "Update Profile"}
              </button>
            </div>
          </form>

          {message && (
            <p className="mt-6 text-center text-green-600 font-medium">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;

