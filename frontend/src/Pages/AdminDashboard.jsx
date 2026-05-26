import React, {
  useState,
  useEffect,
  useContext
} from "react";

import axios from "axios";

import {
  LayoutDashboard,
  Users,
  Search,
  Edit,
  Trash2,
  ShieldCheck,
  FileText,
  Mail,
  Eye,
  Plus,
  Phone,
  MapPin,
  IndianRupee,
  Briefcase,
  GraduationCap,
  Heart,
  User
} from "lucide-react";

import {
  AuthContext
} from "../context/AuthContext";

import {
  toast
} from "react-toastify";

import {
  useNavigate
} from "react-router-dom";

import CreateProfile from "./CreateProfile";

const AdminDashboard = () => {

  const navigate = useNavigate();

  const {
    user,
    token
  } = useContext(AuthContext);

  // ======================================================
  // STATES
  // ======================================================

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [profiles, setProfiles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  // ======================================================
  // ADMIN PROTECTION
  // ======================================================

  useEffect(() => {

    if (
      user &&
      user.role !== "admin"
    ) {

      navigate("/");

    }

  }, [user]);

  // ======================================================
  // FETCH ALL PROFILES
  // ======================================================

  useEffect(() => {

    const fetchProfiles = async () => {

      try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/profile`
        );

        setProfiles(
          res.data.profiles || []
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to load profiles"
        );

      } finally {

        setLoading(false);

      }

    };

    fetchProfiles();

  }, []);

  // ======================================================
  // DELETE PROFILE
  // ======================================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this biodata?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/profile/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProfiles((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      toast.success(
        "Biodata deleted successfully"
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );

    }

  };

  // ======================================================
  // SEARCH FILTER
  // ======================================================

  const filteredProfiles =
    profiles.filter((item) => {

      const searchValue =
        search.toLowerCase();

      return (

        item?.name
          ?.toLowerCase()
          .includes(searchValue) ||

        item?.fatherName
          ?.toLowerCase()
          .includes(searchValue) ||

        item?.motherName
          ?.toLowerCase()
          .includes(searchValue) ||

        item?.city
          ?.toLowerCase()
          .includes(searchValue) ||

        item?.contactNo
          ?.toLowerCase()
          .includes(searchValue)

      );

    });

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <div className="min-h-screen flex justify-center items-center bg-[#f5f7fb]">

        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-[#f5f7fb] pt-20">

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">

        <div className="sm:flex sm::grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-8">

          {/* ======================================================
              SIDEBAR
          ====================================================== */}

          <aside className="sm:w-[40%] lg:col-span-3">

            <div className="bg-white  rounded-3xl shadow-sm p-6 lg:sticky lg:top-24">

              {/* ADMIN INFO */}

              <div className="text-center border-b pb-6">

                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-blue-100">

                  <img
                    src="https://www.apnavivah.in/founder.png"
                    alt="admin"
                    className="w-full h-full object-cover object-top "
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

                  Admin Panel

                </div>

              </div>

              {/* MENU */}

              <div className="space-y-3 mt-6">

                <button
                  onClick={() =>
                    setActiveTab("dashboard")
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
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
                    setActiveTab("biodata")
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                    activeTab === "biodata"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FileText size={18} />
                  All Biodata
                </button>

                <button
                  onClick={() =>
                    setActiveTab("create")
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                    activeTab === "create"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Plus size={18} />
                  Create Biodata
                </button>

              </div>

            </div>

          </aside>

          {/* ======================================================
              MAIN CONTENT
          ====================================================== */}

          <main className="sm:w-[100%] lg:col-span-9">

            {/* ======================================================
                DASHBOARD
            ====================================================== */}

            {activeTab === "dashboard" && (

              <>

                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl mt-5 md:-mt-0 p-6 md:p-8 text-white shadow-lg">

                  <h1 className="text-3xl md:text-4xl font-bold">
                    Admin Dashboard
                  </h1>

                  <p className="mt-3 text-blue-100 text-sm md:text-base">
                    Manage all matrimony biodata and users from one place.
                  </p>

                </div>

                {/* STATS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">

                  <div className="bg-white rounded-3xl p-6 shadow-sm">

                    <Users className="text-blue-600 mb-4" />

                    <p className="text-gray-400 text-sm">
                      Total Biodata
                    </p>

                    <h3 className="text-3xl font-bold mt-2">
                      {profiles.length}
                    </h3>

                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm">

                    <ShieldCheck className="text-purple-600 mb-4" />

                    <p className="text-gray-400 text-sm">
                      Account Type
                    </p>

                    <h3 className="text-3xl font-bold mt-2">
                      Admin
                    </h3>

                  </div>

                  <div className="bg-white rounded-3xl p-6 shadow-sm">

                    <Mail className="text-red-500 mb-4" />

                    <p className="text-gray-400 text-sm">
                      System Status
                    </p>

                    <h3 className="text-3xl font-bold mt-2">
                      Active
                    </h3>

                  </div>

                </div>

              </>

            )}

            {/* ======================================================
                BIODATA
            ====================================================== */}

            {activeTab === "biodata" && (

              <div className="bg-white rounded-3xl mt-5 md:-mt-0 shadow-sm p-4 md:p-8">

                {/* HEADER */}

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">

                  <div>

                    <h2 className="text-2xl md:text-3xl font-bold">
                      All Biodata
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Manage all user biodata
                    </p>

                  </div>

                  {/* SEARCH */}

                  <div className="relative w-full xl:w-[400px]">

                    <Search
                      className="absolute left-4 top-3.5 text-gray-400"
                      size={18}
                    />

                    <input
                      type="text"
                      placeholder="Search by name, city, mobile..."
                      value={search}
                      onChange={(e) =>
                        setSearch(
                          e.target.value
                        )
                      }
                      className="w-full border rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-blue-500"
                    />

                  </div>

                </div>

                {/* MOBILE */}

                <div className="block lg:hidden space-y-5">

                  {filteredProfiles.map((item) => (

                    <div
                      key={item._id}
                      className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm"
                    >

                      {/* TOP */}

                      <div className="flex items-center gap-4">

                        <img
                          src={
                            item.photo ||
                            "https://via.placeholder.com/100"
                          }
                          alt="profile"
                          className="w-20 h-20 rounded-2xl object-cover shrink-0"
                        />

                        <div className="flex-1 max-w-[100px]">

                          <h3 className="text-lg font-bold capitalize truncate">
                            {item.name}
                          </h3>

                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">

                            <MapPin size={14} />

                            <span className="capitalize truncate">
                              {item.city || "N/A"}
                            </span>

                          </div>

                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">

                            <Phone size={14} />

                            <span>
                              {item.contactNo || "N/A"}
                            </span>

                          </div>

                        </div>

                      </div>

                 

                      {/* ACTIONS */}

                      <div className="flex gap-3 mt-6">

                        <button
                          onClick={() =>
                            window.open(
                              `/browse-profile/${item._id}`,
                              "_blank"
                            )
                          }
                          className="w-[50%] bg-blue-50 text-blue-600 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-medium"
                        >
                          <Eye size={18} />
                          View
                        </button>

                        <button
                          onClick={() =>
                            navigate(
                              `/update-profile/${item._id}`
                            )
                          }
                          className="w-[50%] bg-green-50 text-green-600 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-medium"
                        >
                          <Edit size={18} />
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(item._id)
                          }
                          className="w-[50%] bg-red-50 text-red-600 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-medium"
                        >
                          <Trash2 size={18} />
                          Delete
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

                {/* DESKTOP */}

                <div className="hidden lg:block overflow-x-auto">

                  <table className="w-full">

                    <thead>

                      <tr className="border-b text-left">

                        <th className="py-4">User</th>
                        <th className="py-4">City</th>
                        <th className="py-4">Mobile</th>
                        <th className="py-4 text-center">Actions</th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredProfiles.map((item) => (

                        <tr
                          key={item._id}
                          className="border-b hover:bg-gray-50"
                        >

                          <td className="py-5">

                            <div className="flex items-center gap-3">

                              <img
                                src={
                                  item.photo ||
                                  "https://via.placeholder.com/100"
                                }
                                alt="profile"
                                className="w-14 h-14 rounded-2xl object-cover"
                              />

                              <div>

                                <h3 className="font-semibold capitalize">
                                  {item.name}
                                </h3>

                              </div>

                            </div>

                          </td>

                          <td className="capitalize">
                            {item.city}
                          </td>

                          <td>
                            {item.contactNo}
                          </td>

                          <td>

                            <div className="flex justify-center gap-3">

                              <button
                                onClick={() =>
                                  window.open(
                                    `/browse-profile/${item._id}`,
                                    "_blank"
                                  )
                                }
                                className="bg-blue-100 text-blue-600 p-2 rounded-xl hover:bg-blue-200"
                              >
                                <Eye size={18} />
                              </button>

                              <button
                                onClick={() =>
                                  navigate(
                                    `/update-profile/${item._id}`
                                  )
                                }
                                className="bg-green-100 text-green-600 p-2 rounded-xl hover:bg-green-200"
                              >
                                <Edit size={18} />
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    item._id
                                  )
                                }
                                className="bg-red-100 text-red-600 p-2 rounded-xl hover:bg-red-200"
                              >
                                <Trash2 size={18} />
                              </button>

                            </div>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            )}

            {/* CREATE */}

            {activeTab === "create" && (

              <div className="bg-white rounded-3xl mt-5 md:-mt-0 shadow-sm p-4 md:p-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

                  <div>

                    <h2 className="text-2xl md:text-3xl font-bold">
                      Create New Biodata
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Add a new matrimony biodata
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setActiveTab("biodata")
                    }
                    className="bg-gray-100 px-5 py-3 rounded-2xl"
                  >
                    Back
                  </button>

                </div>

                <CreateProfile mode="create" className=""/>

              </div>

            )}

          </main>

        </div>

      </div>

    </div>

  );

};

// ======================================================
// MOBILE INFO
// ======================================================

const MobileInfo = ({
  icon,
  label,
  value
}) => {

  return (

    <div className="bg-gray-50 rounded-2xl p-3">

      <div className="flex items-center gap-2 mb-2">

        {icon}

        <p className="text-xs text-gray-500">
          {label}
        </p>

      </div>

      <h4 className="text-sm font-semibold capitalize break-words">
        {value || "N/A"}
      </h4>

    </div>

  );

};

export default AdminDashboard;