import React, {
  useState,
  useEffect,
  useContext
} from "react";

import axios from "axios";

import {
  User,
  FileText,
  Edit,
  Trash2,
  Plus,
  Mail,
  Phone,
  ShieldCheck,
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  MapPin,
  IndianRupee,
  Calendar,
  Heart,
  Users,
  Home,
  Clock,
  Palette,
  Ruler
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";

import { toast } from "react-toastify";

import CreateProfile from "./CreateProfile";

const UserDashboard = () => {

  const { user, token } =
    useContext(AuthContext);

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [loading, setLoading] =
    useState(true);

  const [profileEdit, setProfileEdit] =
    useState(false);

  const [biodata, setBiodata] =
    useState(null);

  const [profileForm, setProfileForm] =
    useState({
      name: "",
      email: "",
      mobile: "",
      password: ""
    });

  // ======================================================
  // LOAD USER
  // ======================================================

  useEffect(() => {

    if (user) {

      setProfileForm({
        name: user?.name || "",
        email: user?.email || "",
        mobile: user?.mobile || "",
        password: ""
      });

    }

  }, [user]);

  // ======================================================
  // FETCH BIODATA
  // ======================================================

  useEffect(() => {

    const fetchMyBiodata = async () => {

      try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profile/my-biodata`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setBiodata(res.data.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    if (token) {
      fetchMyBiodata();
    }

  }, [token]);

  // ======================================================
  // UPDATE PROFILE FORM
  // ======================================================

  const handleProfileChange = (e) => {

    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });

  };

  // ======================================================
  // UPDATE USER PROFILE
  // ======================================================

  const updateMyProfile = async () => {

    try {

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/update-profile`,
        profileForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.data)
      );

      toast.success(
        "Profile updated successfully"
      );

      setProfileEdit(false);

      window.location.reload();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Update failed"
      );

    }

  };

  // ======================================================
  // DELETE BIODATA
  // ======================================================

  const deleteBiodata = async () => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete biodata?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/profile/delete/${biodata._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setBiodata(null);

      toast.success(
        "Biodata deleted successfully"
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message
      );

    }

  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#f5f7fb] mt-20">

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid lg:grid-cols-12 gap-8">

          {/* ======================================================
              SIDEBAR
          ====================================================== */}

          <aside className="lg:col-span-3">

            <div className="bg-white rounded-3xl shadow-sm p-6 sticky top-24">

              <div className="text-center border-b pb-6">

                <div className="w-24 h-24 rounded-full bg-blue-100 mx-auto flex items-center justify-center">

             <img
  src={
    biodata?.photo ||
    "https://via.placeholder.com/150"
  }
  alt="user"
  className="rounded-full w-24 h-24 object-cover"
/>

                  

                </div>

                <h2 className="mt-4 text-xl font-bold capitalize">
                  {user?.name}
                </h2>

                <p className="text-gray-500 text-sm">
                  @{user?.username}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">

                  <ShieldCheck size={16} />

                  {user?.role}

                </div>

              </div>

              {/* MENU */}

              <div className="space-y-3 mt-6">

                <button
                  onClick={() =>
                    setActiveTab("dashboard")
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${
                    activeTab === "dashboard"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </button>

                <button
                  onClick={() =>
                    setActiveTab("profile")
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${
                    activeTab === "profile"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <User size={18} />
                  My Profile
                </button>

                <button
                  onClick={() =>
                    setActiveTab("biodata")
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl ${
                    activeTab === "biodata"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FileText size={18} />
                  My Biodata
                </button>

              </div>

            </div>

          </aside>

          {/* ======================================================
              MAIN CONTENT
          ====================================================== */}

          <main className="lg:col-span-9">

            {/* DASHBOARD */}

            {activeTab === "dashboard" && (

              <div className="bg-white rounded-3xl p-8 shadow-sm">

                <h1 className="text-4xl font-bold">
                  Welcome back, {user?.name}
                </h1>

                <p className="text-gray-500 mt-3">
                  Manage your matrimony account and biodata
                </p>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

                  <div className="bg-blue-50 p-6 rounded-3xl">

                    <User className="text-blue-600 mb-3" />

                    <p className="text-gray-500 text-sm">
                      Profile Status
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      Active
                    </h3>

                  </div>

                  <div className="bg-green-50 p-6 rounded-3xl">

                    <FileText className="text-green-600 mb-3" />

                    <p className="text-gray-500 text-sm">
                      Biodata
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {biodata ? "Created" : "Pending"}
                    </h3>

                  </div>

                  <div className="bg-purple-50 p-6 rounded-3xl">

                    <ShieldCheck className="text-purple-600 mb-3" />

                    <p className="text-gray-500 text-sm">
                      Account Type
                    </p>

                    <h3 className="text-2xl font-bold mt-2 capitalize">
                      {user?.role}
                    </h3>

                  </div>

                  <div className="bg-red-50 p-6 rounded-3xl">

                    <Mail className="text-red-500 mb-3" />

                    <p className="text-gray-500 text-sm">
                      Email
                    </p>

                    <h3 className="text-lg font-bold mt-2">
                      Verified
                    </h3>

                  </div>

                </div>

              </div>

            )}

            {/* PROFILE */}

            {activeTab === "profile" && (

              <div className="bg-white rounded-3xl p-8 shadow-sm">

                <div className="flex justify-between items-center mb-8">

                  <div>

                    <h2 className="text-3xl font-bold">
                      My Profile
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Manage account details
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setProfileEdit(true)
                    }
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl"
                  >
                    Edit Profile
                  </button>

                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                  <div className="bg-gray-50 p-5 rounded-2xl">
                    <Mail className="text-blue-600 mb-3" />
                    <p className="text-gray-400 text-sm">
                      Email
                    </p>
                    <h3 className="font-semibold">
                      {user?.email}
                    </h3>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl">
                    <Phone className="text-green-600 mb-3" />
                    <p className="text-gray-400 text-sm">
                      Mobile
                    </p>
                    <h3 className="font-semibold">
                      {user?.mobile}
                    </h3>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl">
                    <ShieldCheck className="text-purple-600 mb-3" />
                    <p className="text-gray-400 text-sm">
                      Role
                    </p>
                    <h3 className="font-semibold capitalize">
                      {user?.role}
                    </h3>
                  </div>

                </div>

              </div>

            )}

            {/* BIODATA */}

            {activeTab === "biodata" && (

              <div className="bg-white rounded-3xl shadow-sm p-8">

                <div className="flex justify-between items-center mb-8">

                  <div>

                    <h2 className="text-3xl font-bold">
                      My Biodata
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Complete biodata information
                    </p>

                  </div>

                  {!biodata && (

                    <button
                      onClick={() =>
                        setActiveTab("create")
                      }
                      className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2"
                    >
                      <Plus size={18} />
                      Create Biodata
                    </button>

                  )}

                </div>

                {biodata ? (

                  <>
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                      <InfoCard
                        icon={<User className="text-blue-600" />}
                        title="Full Name"
                        value={biodata.name}
                      />

                      <InfoCard
                        icon={<Calendar className="text-purple-600" />}
                        title="Date Of Birth"
                        value={biodata.dob}
                      />

                      <InfoCard
                        icon={<Clock className="text-orange-500" />}
                        title="Birth Time"
                        value={biodata.time}
                      />

                      <InfoCard
                        icon={<MapPin className="text-red-500" />}
                        title="Birth Place"
                        value={biodata.place}
                      />

                      <InfoCard
                        icon={<Ruler className="text-indigo-600" />}
                        title="Height"
                        value={biodata.height}
                      />

                      <InfoCard
                        icon={<Palette className="text-pink-500" />}
                        title="Colour"
                        value={biodata.colour}
                      />

                      <InfoCard
                        icon={<GraduationCap className="text-blue-500" />}
                        title="Education"
                        value={biodata.education}
                      />

                      <InfoCard
                        icon={<Briefcase className="text-green-600" />}
                        title="Occupation"
                        value={biodata.occupation}
                      />

                      <InfoCard
                        icon={<IndianRupee className="text-yellow-600" />}
                        title="Income"
                        value={`₹${biodata.income}`}
                      />

                      <InfoCard
                        icon={<Users className="text-purple-500" />}
                        title="Father Name"
                        value={biodata.fatherName}
                      />

                      <InfoCard
                        icon={<Users className="text-pink-500" />}
                        title="Mother Name"
                        value={biodata.motherName}
                      />

                      <InfoCard
                        icon={<Heart className="text-red-500" />}
                        title="Marital Status"
                        value={biodata.maritalStatus}
                      />

                      <InfoCard
                        icon={<Home className="text-blue-500" />}
                        title="Address"
                        value={biodata.fullAddress}
                      />

                      <InfoCard
                        icon={<MapPin className="text-green-500" />}
                        title="City"
                        value={biodata.city}
                      />

                      <InfoCard
                        icon={<Phone className="text-indigo-500" />}
                        title="Contact"
                        value={biodata.contactNo}
                      />

                    </div>

                    {/* ACTIONS */}

                    <div className="flex gap-4 mt-8">

                      <button
                        onClick={() =>
                          setActiveTab("create")
                        }
                        className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2"
                      >
                        <Edit size={18} />
                        Edit Biodata
                      </button>

                      <button
                        onClick={deleteBiodata}
                        className="bg-red-500 text-white px-6 py-3 rounded-2xl flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                        Delete Biodata
                      </button>

                    </div>

                  </>

                ) : (

                  <div className="text-center py-16">

                    <FileText
                      size={70}
                      className="mx-auto text-gray-300"
                    />

                    <h3 className="text-2xl font-bold mt-6">
                      No Biodata Found
                    </h3>

                    <p className="text-gray-500 mt-2">
                      Create your biodata now
                    </p>

                  </div>

                )}

              </div>

            )}

            {/* CREATE / UPDATE */}

            {activeTab === "create" && (

              <div className="bg-white rounded-3xl p-6 shadow-sm">

                <div className="flex justify-between items-center mb-6">

                  <div>

                    <h2 className="text-3xl font-bold">
                      {biodata
                        ? "Update Biodata"
                        : "Create Biodata"}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Fill all required information
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setActiveTab("biodata")
                    }
                    className="bg-gray-100 px-5 py-2 rounded-2xl"
                  >
                    Back
                  </button>

                </div>

                <CreateProfile
                  mode={
                    biodata
                      ? "update"
                      : "create"
                  }
                />

              </div>

            )}

          </main>

        </div>

      </div>

      {/* PROFILE EDIT MODAL */}

      {profileEdit && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative">

            <button
              onClick={() =>
                setProfileEdit(false)
              }
              className="absolute top-5 right-5"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6">
              Edit Profile
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                placeholder="Name"
                className="w-full border rounded-2xl px-4 py-3"
              />

              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                placeholder="Email"
                className="w-full border rounded-2xl px-4 py-3"
              />

              <input
                type="text"
                name="mobile"
                value={profileForm.mobile}
                onChange={handleProfileChange}
                placeholder="Mobile"
                className="w-full border rounded-2xl px-4 py-3"
              />

              <input
                type="password"
                name="password"
                value={profileForm.password}
                onChange={handleProfileChange}
                placeholder="New Password"
                className="w-full border rounded-2xl px-4 py-3"
              />

              <button
                onClick={updateMyProfile}
                className="w-full bg-blue-600 text-white py-3 rounded-2xl"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

// ======================================================
// INFO CARD
// ======================================================

const InfoCard = ({
  icon,
  title,
  value
}) => {

  return (

    <div className="bg-gray-50 rounded-2xl p-5">

      <div className="mb-3">
        {icon}
      </div>

      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <h3 className="font-semibold mt-1 capitalize">
        {value || "N/A"}
      </h3>

    </div>

  );

};

export default UserDashboard;