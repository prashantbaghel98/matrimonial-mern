
import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
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
  User,
  RefreshCw,
  Download,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  GraduationCap,
  Briefcase,
  Heart,
  UserRound,
  CheckCircle,
  ArrowUpDown,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

import CreateProfile from "./CreateProfile";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { user, token } = useContext(AuthContext);

  // =========================================================
  // STATES
  // =========================================================

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [profiles, setProfiles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [genderFilter, setGenderFilter] =
    useState("all");

  const [cityFilter, setCityFilter] =
    useState("all");

  const [sortBy, setSortBy] =
    useState("newest");

  const [showFilters, setShowFilters] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  // =========================================================
  // ADMIN PROTECTION
  // =========================================================

  useEffect(() => {
    if (
      user &&
      user.role !== "admin"
    ) {
      navigate("/");
    }
  }, [user, navigate]);

  // =========================================================
  // FETCH PROFILES
  // =========================================================

  const fetchProfiles = async (showRefresh = false) => {
  if (!token) return;

  try {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("PROFILE API RESPONSE:", res.data);

    // Handle different possible API response structures
    const profileData =
      res.data?.profiles ||
      res.data?.data ||
      [];

    console.log("PROFILES:", profileData);

    setProfiles(
      Array.isArray(profileData)
        ? profileData
        : []
    );

  } catch (error) {
    console.error(
      "FETCH PROFILE ERROR:",
      error?.response?.data || error
    );

    toast.error(
      error?.response?.data?.message ||
        "Failed to load profiles"
    );

  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useEffect(() => {
    if (token) {
      fetchProfiles();
    }
  }, [token]);

  // =========================================================
  // DELETE PROFILE
  // =========================================================

  const handleDelete = async (id) => {
    const profile = profiles.find(
      (item) => item._id === id
    );

    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete ${
          profile?.name || "this biodata"
        }?`
      );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      await axios.delete(
        `${API_URL}/api/profile/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Delete failed"
      );

    } finally {
      setDeletingId(null);
    }
  };

  // =========================================================
  // SEARCH + FILTER + SORT
  // =========================================================

  const filteredProfiles = useMemo(() => {
    let result = [...profiles];

    const searchValue =
      search.trim().toLowerCase();

    // SEARCH
    if (searchValue) {
      result = result.filter(
        (item) => {
          const fields = [
            item.name,
            item.fatherName,
            item.motherName,
            item.city,
            item.contactNo,
            item.education,
            item.occupation,
            item.address,
          ];

          return fields.some((field) =>
            String(field || "")
              .toLowerCase()
              .includes(searchValue)
          );
        }
      );
    }

    // GENDER
    if (genderFilter !== "all") {
      result = result.filter(
        (item) =>
          String(
            item.gender || ""
          ).toLowerCase() ===
          genderFilter.toLowerCase()
      );
    }

    // CITY
    if (cityFilter !== "all") {
      result = result.filter(
        (item) =>
          String(
            item.city || ""
          ).toLowerCase() ===
          cityFilter.toLowerCase()
      );
    }

    // SORT
    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
      );
    }

    if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          new Date(
            a.createdAt || 0
          ) -
          new Date(
            b.createdAt || 0
          )
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        String(
          a.name || ""
        ).localeCompare(
          String(
            b.name || ""
          )
        )
      );
    }

    return result;
  }, [
    profiles,
    search,
    genderFilter,
    cityFilter,
    sortBy,
  ]);

  // =========================================================
  // RESET PAGINATION
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    genderFilter,
    cityFilter,
    sortBy,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.ceil(
    filteredProfiles.length /
      itemsPerPage
  );

  const paginatedProfiles =
    filteredProfiles.slice(
      (currentPage - 1) *
        itemsPerPage,
      currentPage *
        itemsPerPage
    );

  // =========================================================
  // UNIQUE CITIES
  // =========================================================

  const cities = useMemo(() => {
    const cityList =
      profiles
        .map((item) =>
          String(
            item.city || ""
          ).trim()
        )
        .filter(Boolean);

    return [...new Set(cityList)].sort(
      (a, b) =>
        a.localeCompare(b)
    );
  }, [profiles]);

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalProfiles =
    profiles.length;

  const maleProfiles =
    profiles.filter(
      (item) =>
        String(
          item.gender || ""
        ).toLowerCase() ===
        "male"
    ).length;

  const femaleProfiles =
    profiles.filter(
      (item) =>
        String(
          item.gender || ""
        ).toLowerCase() ===
        "female"
    ).length;

  const recentProfiles =
    [...profiles]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
      )
      .slice(0, 5);

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setGenderFilter("all");
    setCityFilter("all");
    setSortBy("newest");
  };

  // =========================================================
  // EXPORT CSV
  // =========================================================

  const exportCSV = () => {
    if (
      filteredProfiles.length === 0
    ) {
      toast.info(
        "No biodata available to export"
      );
      return;
    }

    const headers = [
      "Name",
      "Gender",
      "Mobile",
      "Father Name",
      "Mother Name",
      "City",
      "Education",
      "Occupation",
      "Created Date",
    ];

    const rows =
      filteredProfiles.map(
        (item) => [
          item.name || "",
          item.gender || "",
          item.contactNo || "",
          item.fatherName || "",
          item.motherName || "",
          item.city || "",
          item.education || "",
          item.occupation || "",
          formatDate(
            item.createdAt
          ),
        ]
      );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(
              value
            ).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `biodata-${new Date()
        .toISOString()
        .split("T")[0]}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(url);

    toast.success(
      "Biodata exported successfully"
    );
  };

  // =========================================================
  // OPEN PROFILE
  // =========================================================

  const handleView = (id) => {
    window.open(
      `/browse-profile/${id}`,
      "_blank"
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#f5f7fb]">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-500">
            Loading admin dashboard...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] pt-20">

      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* =====================================================
              SIDEBAR
          ===================================================== */}

          <aside className="lg:col-span-3">

            <div className="bg-white rounded-3xl shadow-sm p-6 lg:sticky lg:top-24">

              {/* ADMIN INFO */}

              <div className="text-center border-b pb-6">

                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto border-4 border-blue-100">

                  <img
                    src="https://www.apnavivah.in/founder.png"
                    alt="admin"
                    className="w-full h-full object-cover object-top"
                  />

                </div>

                <h2 className="mt-4 text-xl font-bold capitalize">
                  {user?.name ||
                    "Administrator"}
                </h2>

                <p className="text-gray-500 text-sm">
                  @{user?.username ||
                    "admin"}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium">

                  <ShieldCheck
                    size={16}
                  />

                  Admin Panel

                </div>

              </div>

              {/* MENU */}

              <div className="space-y-3 mt-6">

                <button
                  onClick={() =>
                    setActiveTab(
                      "dashboard"
                    )
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                    activeTab ===
                    "dashboard"
                      ? "bg-red-600 text-white shadow-lg"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <LayoutDashboard
                    size={18}
                  />

                  Dashboard
                </button>

                <button
                  onClick={() =>
                    setActiveTab(
                      "biodata"
                    )
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                    activeTab ===
                    "biodata"
                      ? "bg-red-600 text-white shadow-lg"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FileText
                    size={18}
                  />

                  All Biodata

                  <span className="ml-auto text-xs opacity-80">
                    {profiles.length}
                  </span>
                </button>

                <button
                  onClick={() =>
                    setActiveTab(
                      "create"
                    )
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition ${
                    activeTab ===
                    "create"
                      ? "bg-red-600 text-white shadow-lg"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Plus size={18} />

                  Create Biodata
                </button>

              </div>

              {/* QUICK INFO */}

              <div className="mt-8 bg-slate-50 rounded-2xl p-4">

                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  System
                </p>

                <div className="flex items-center gap-2 mt-3 text-green-600">

                  <CheckCircle
                    size={16}
                  />

                  <span className="text-sm font-medium">
                    System Active
                  </span>

                </div>

              </div>

            </div>

          </aside>

          {/* =====================================================
              MAIN
          ===================================================== */}

          <main className="lg:col-span-9">

            {/* =================================================
                DASHBOARD
            ================================================= */}

            {activeTab ===
              "dashboard" && (
              <>

                {/* HERO */}

                <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-6 md:p-8 text-white shadow-lg">

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                    <div>

                      <p className="text-white/70 text-sm">
                        Welcome back
                      </p>

                      <h1 className="text-3xl md:text-4xl font-bold mt-1">
                        Admin Dashboard
                      </h1>

                      <p className="mt-3 text-red-100 text-sm md:text-base">
                        Manage all matrimony biodata and users from one place.
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        fetchProfiles(
                          true
                        )
                      }
                      disabled={
                        refreshing
                      }
                      className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 px-5 py-3 rounded-2xl transition"
                    >

                      <RefreshCw
                        size={18}
                        className={
                          refreshing
                            ? "animate-spin"
                            : ""
                        }
                      />

                      Refresh

                    </button>

                  </div>

                </div>

                {/* STATS */}

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">

                  <StatCard
                    icon={
                      <Users
                        size={22}
                      />
                    }
                    title="Total Biodata"
                    value={
                      totalProfiles
                    }
                    iconClass="text-blue-600"
                  />

                  <StatCard
                    icon={
                      <UserRound
                        size={22}
                      />
                    }
                    title="Male"
                    value={
                      maleProfiles
                    }
                    iconClass="text-purple-600"
                  />

                  <StatCard
                    icon={
                      <Heart
                        size={22}
                      />
                    }
                    title="Female"
                    value={
                      femaleProfiles
                    }
                    iconClass="text-pink-600"
                  />

                  <StatCard
                    icon={
                      <MapPin
                        size={22}
                      />
                    }
                    title="Cities"
                    value={
                      cities.length
                    }
                    iconClass="text-orange-600"
                  />

                </div>

                {/* QUICK ACTIONS */}

                <div className="grid md:grid-cols-2 gap-6 mt-8">

                  <button
                    onClick={() =>
                      setActiveTab(
                        "create"
                      )
                    }
                    className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition text-left group"
                  >

                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition">

                      <Plus size={22} />

                    </div>

                    <h3 className="text-xl font-bold mt-5">
                      Create New Biodata
                    </h3>

                    <p className="text-gray-500 text-sm mt-2">
                      Add a new matrimonial profile to the system.
                    </p>

                  </button>

                  <button
                    onClick={() =>
                      setActiveTab(
                        "biodata"
                      )
                    }
                    className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition text-left group"
                  >

                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">

                      <FileText
                        size={22}
                      />

                    </div>

                    <h3 className="text-xl font-bold mt-5">
                      Manage Biodata
                    </h3>

                    <p className="text-gray-500 text-sm mt-2">
                      Search, edit, view and manage all profiles.
                    </p>

                  </button>

                </div>

                {/* RECENT PROFILES */}

                <div className="bg-white rounded-3xl shadow-sm p-6 mt-8">

                  <div className="flex items-center justify-between gap-4 mb-6">

                    <div>

                      <h2 className="text-xl font-bold">
                        Recent Biodata
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Latest registered profiles
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        setActiveTab(
                          "biodata"
                        )
                      }
                      className="text-red-600 text-sm font-medium hover:underline"
                    >
                      View All
                    </button>

                  </div>

                  {recentProfiles.length ===
                  0 ? (
                    <EmptyState
                      text="No biodata available"
                    />
                  ) : (
                    <div className="space-y-4">

                      {recentProfiles.map(
                        (item) => (
                          <div
                            key={
                              item._id
                            }
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition"
                          >

                            <img
                              src={
                                item.photo ||
                                "https://via.placeholder.com/100"
                              }
                              alt="profile"
                              className="w-14 h-14 rounded-2xl object-cover"
                            />

                            <div className="flex-1 min-w-0">

                              <h3 className="font-semibold capitalize truncate">
                                {item.name ||
                                  "Unknown"}
                              </h3>

                              <p className="text-sm text-gray-500 truncate">
                                {item.city ||
                                  "City not available"}
                              </p>

                            </div>

                            <div className="hidden sm:block text-right">

                              <p className="text-xs text-gray-400">
                                Registered
                              </p>

                              <p className="text-sm font-medium">
                                {formatDate(
                                  item.createdAt
                                )}
                              </p>

                            </div>

                            <button
                              onClick={() =>
                                handleView(
                                  item._id
                                )
                              }
                              className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100"
                            >
                              <Eye
                                size={18}
                              />
                            </button>

                          </div>
                        )
                      )}

                    </div>
                  )}

                </div>

              </>
            )}

            {/* =================================================
                BIODATA
            ================================================= */}

            {activeTab ===
              "biodata" && (
              <div className="bg-white rounded-3xl shadow-sm p-4 md:p-8">

                {/* HEADER */}

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-6">

                  <div>

                    <h2 className="text-2xl md:text-3xl font-bold">
                      All Biodata
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Manage all user biodata
                    </p>

                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">

                    <button
                      onClick={() =>
                        fetchProfiles(
                          true
                        )
                      }
                      disabled={
                        refreshing
                      }
                      className="flex items-center justify-center gap-2 border px-4 py-3 rounded-2xl hover:bg-gray-50"
                    >

                      <RefreshCw
                        size={18}
                        className={
                          refreshing
                            ? "animate-spin"
                            : ""
                        }
                      />

                      Refresh

                    </button>

                    <button
                      onClick={
                        exportCSV
                      }
                      className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-2xl hover:bg-red-700"
                    >

                      <Download
                        size={18}
                      />

                      Export

                    </button>

                  </div>

                </div>

                {/* SEARCH + FILTER */}

                <div className="bg-slate-50 rounded-2xl p-4 mb-6">

                  <div className="flex flex-col lg:flex-row gap-3">

                    <div className="relative flex-1">

                      <Search
                        className="absolute left-4 top-3.5 text-gray-400"
                        size={18}
                      />

                      <input
                        type="text"
                        placeholder="Search name, city, mobile, education, occupation..."
                        value={
                          search
                        }
                        onChange={(
                          e
                        ) =>
                          setSearch(
                            e.target.value
                          )
                        }
                        className="w-full border bg-white rounded-2xl pl-11 pr-11 py-3 outline-none focus:border-red-500"
                      />

                      {search && (
                        <button
                          onClick={() =>
                            setSearch(
                              ""
                            )
                          }
                          className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-700"
                        >
                          <X
                            size={18}
                          />
                        </button>
                      )}

                    </div>

                    <button
                      onClick={() =>
                        setShowFilters(
                          !showFilters
                        )
                      }
                      className={`px-5 py-3 rounded-2xl flex items-center justify-center gap-2 border transition ${
                        showFilters
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >

                      <Filter
                        size={18}
                      />

                      Filters

                    </button>

                  </div>

                  {/* FILTER PANEL */}

                  {showFilters && (
                    <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t">

                      <div>

                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                          Gender
                        </label>

                        <select
                          value={
                            genderFilter
                          }
                          onChange={(
                            e
                          ) =>
                            setGenderFilter(
                              e.target.value
                            )
                          }
                          className="w-full h-12 px-4 rounded-xl border bg-white outline-none focus:border-red-500"
                        >

                          <option value="all">
                            All Gender
                          </option>

                          <option value="male">
                            Male
                          </option>

                          <option value="female">
                            Female
                          </option>

                        </select>

                      </div>

                      <div>

                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                          City
                        </label>

                        <select
                          value={
                            cityFilter
                          }
                          onChange={(
                            e
                          ) =>
                            setCityFilter(
                              e.target.value
                            )
                          }
                          className="w-full h-12 px-4 rounded-xl border bg-white outline-none focus:border-red-500"
                        >

                          <option value="all">
                            All Cities
                          </option>

                          {cities.map(
                            (
                              city
                            ) => (
                              <option
                                key={
                                  city
                                }
                                value={
                                  city
                                }
                              >
                                {city}
                              </option>
                            )
                          )}

                        </select>

                      </div>

                      <div>

                        <label className="text-sm font-medium text-gray-600 mb-2 block">
                          Sort By
                        </label>

                        <select
                          value={
                            sortBy
                          }
                          onChange={(
                            e
                          ) =>
                            setSortBy(
                              e.target.value
                            )
                          }
                          className="w-full h-12 px-4 rounded-xl border bg-white outline-none focus:border-red-500"
                        >

                          <option value="newest">
                            Newest First
                          </option>

                          <option value="oldest">
                            Oldest First
                          </option>

                          <option value="name">
                            Name A-Z
                          </option>

                        </select>

                      </div>

                      <div className="md:col-span-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <p className="text-sm text-gray-500">

                          Showing{" "}
                          <strong>
                            {
                              filteredProfiles.length
                            }
                          </strong>{" "}
                          of{" "}
                          <strong>
                            {
                              profiles.length
                            }
                          </strong>{" "}
                          biodata

                        </p>

                        <button
                          onClick={
                            clearFilters
                          }
                          className="text-red-600 font-medium text-sm hover:underline text-left sm:text-right"
                        >
                          Clear Filters
                        </button>

                      </div>

                    </div>
                  )}

                </div>

                {/* MOBILE CARDS */}

                <div className="block lg:hidden space-y-5">

                  {paginatedProfiles.length ===
                  0 ? (
                    <EmptyState
                      text="No biodata found"
                    />
                  ) : (
                    paginatedProfiles.map(
                      (item) => (
                        <ProfileCard
                          key={
                            item._id
                          }
                          item={
                            item
                          }
                          onView={
                            handleView
                          }
                          onEdit={() =>
                            navigate(
                              `/update-profile/${item._id}`
                            )
                          }
                          onDelete={() =>
                            handleDelete(
                              item._id
                            )
                          }
                          deleting={
                            deletingId ===
                            item._id
                          }
                          formatDate={
                            formatDate
                          }
                        />
                      )
                    )
                  )}

                </div>

                {/* DESKTOP TABLE */}

                <div className="hidden lg:block overflow-x-auto">

                  {paginatedProfiles.length ===
                  0 ? (
                    <EmptyState
                      text="No biodata found"
                    />
                  ) : (
<table className="w-full">
  <thead>
    <tr className="border-b text-left">
      <th className="py-4 px-2">
        User
      </th>

      <th className="py-4 px-2">
        City
      </th>

      <th className="py-4 px-2">
        Mobile
      </th>

      <th className="py-4 px-2 text-center">
        Actions
      </th>
    </tr>
  </thead>

  <tbody>
    {paginatedProfiles.map((item) => (
      <tr
        key={item._id}
        className="border-b hover:bg-gray-50 transition"
      >
        {/* User */}
        <td className="py-5 px-2">
          <div className="flex items-center gap-3">
            <img
              src={
                item.photo ||
                "https://via.placeholder.com/100"
              }
              alt={item.name || "Profile"}
              className="w-14 h-14 rounded-2xl object-cover"
            />

            <div className="min-w-0">
              <h3 className="font-semibold capitalize truncate max-w-[180px]">
                {item.name || "N/A"}
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                {item.education || "Education N/A"}
              </p>
            </div>
          </div>
        </td>

        {/* City */}
        <td className="py-5 px-2">
          <div className="flex items-center gap-2">
            <MapPin
              size={15}
              className="text-gray-400"
            />

            <span className="capitalize">
              {item.city || "N/A"}
            </span>
          </div>
        </td>

        {/* Mobile */}
        <td className="py-5 px-2">
          <div className="flex items-center gap-2">
            <Phone
              size={15}
              className="text-gray-400"
            />

            <span>
              {item.contactNo || "N/A"}
            </span>
          </div>
        </td>

        {/* Actions */}
        <td className="py-5 px-2">
          <div className="flex justify-center gap-2">
            {/* View */}
            <button
              type="button"
              title="View"
              onClick={() =>
                handleView(item._id)
              }
              className="bg-blue-100 text-blue-600 p-2 rounded-xl hover:bg-blue-200 transition"
            >
              <Eye size={18} />
            </button>

            {/* Edit */}
            <button
              type="button"
              title="Edit"
              onClick={() =>
                navigate(
                  `/update-profile/${item._id}`
                )
              }
              className="bg-green-100 text-green-600 p-2 rounded-xl hover:bg-green-200 transition"
            >
              <Edit size={18} />
            </button>

            {/* Delete */}
            <button
              type="button"
              title="Delete"
              disabled={
                deletingId === item._id
              }
              onClick={() =>
                handleDelete(item._id)
              }
              className="bg-red-100 text-red-600 p-2 rounded-xl hover:bg-red-200 transition disabled:opacity-50"
            >
              {deletingId === item._id ? (
                <RefreshCw
                  size={18}
                  className="animate-spin"
                />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>                  )}

                </div>

                {/* PAGINATION */}

                {totalPages >
                  1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">

                    <p className="text-sm text-gray-500">

                      Page{" "}
                      <strong>
                        {
                          currentPage
                        }
                      </strong>{" "}
                      of{" "}
                      <strong>
                        {
                          totalPages
                        }
                      </strong>

                    </p>

                    <div className="flex items-center gap-2">

                      <button
                        disabled={
                          currentPage ===
                          1
                        }
                        onClick={() =>
                          setCurrentPage(
                            (
                              prev
                            ) =>
                              prev -
                              1
                          )
                        }
                        className="p-2 rounded-xl border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft
                          size={
                            18
                          }
                        />
                      </button>

                      {Array.from(
                        {
                          length:
                            totalPages,
                        },
                        (
                          _,
                          index
                        ) =>
                          index +
                          1
                      )
                        .slice(
                          0,
                          5
                        )
                        .map(
                          (
                            page
                          ) => (
                            <button
                              key={
                                page
                              }
                              onClick={() =>
                                setCurrentPage(
                                  page
                                )
                              }
                              className={`w-10 h-10 rounded-xl text-sm ${
                                currentPage ===
                                page
                                  ? "bg-red-600 text-white"
                                  : "border hover:bg-gray-50"
                              }`}
                            >
                              {
                                page
                              }
                            </button>
                          )
                        )}

                      <button
                        disabled={
                          currentPage ===
                          totalPages
                        }
                        onClick={() =>
                          setCurrentPage(
                            (
                              prev
                            ) =>
                              prev +
                              1
                          )
                        }
                        className="p-2 rounded-xl border hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ChevronRight
                          size={
                            18
                          }
                        />
                      </button>

                    </div>

                  </div>
                )}

              </div>
            )}

            {/* =================================================
                CREATE
            ================================================= */}

            {activeTab ===
              "create" && (
              <div className="bg-white rounded-3xl shadow-sm p-4 md:p-8">

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
                      setActiveTab(
                        "biodata"
                      )
                    }
                    className="bg-gray-100 hover:bg-gray-200 px-5 py-3 rounded-2xl"
                  >
                    Back to Biodata
                  </button>

                </div>

                <CreateProfile
                  mode="create"
                />

              </div>
            )}

          </main>

        </div>

      </div>

    </div>
  );
};

// =========================================================
// STAT CARD
// =========================================================

const StatCard = ({
  icon,
  title,
  value,
  iconClass,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition">

      <div
        className={`${iconClass} mb-4`}
      >
        {icon}
      </div>

      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <h3 className="text-3xl font-bold mt-2">
        {value}
      </h3>

    </div>
  );
};

// =========================================================
// PROFILE CARD
// =========================================================

const ProfileCard = ({
  item,
  onView,
  onEdit,
  onDelete,
  deleting,
  formatDate,
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">

      {/* TOP */}

      <div className="flex items-start gap-4">

        <img
          src={
            item.photo ||
            "https://via.placeholder.com/100"
          }
          alt="profile"
          className="w-20 h-20 rounded-2xl object-cover shrink-0"
        />

        <div className="flex-1 min-w-0">

          <div className="flex items-start justify-between gap-2">

            <div className="min-w-0">

              <h3 className="text-lg font-bold capitalize truncate">
                {item.name ||
                  "Unknown"}
              </h3>

              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">

                <MapPin
                  size={14}
                />

                <span className="capitalize truncate">
                  {item.city ||
                    "N/A"}
                </span>

              </div>

            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                String(
                  item.gender ||
                    ""
                ).toLowerCase() ===
                "female"
                  ? "bg-pink-50 text-pink-600"
                  : "bg-blue-50 text-blue-600"
              }`}
            >
              {item.gender ||
                "N/A"}
            </span>

          </div>

          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">

            <Phone
              size={14}
            />

            <span>
              {item.contactNo ||
                "N/A"}
            </span>

          </div>

        </div>

      </div>

      {/* INFO */}

      <div className="grid grid-cols-2 gap-3 mt-5">

        <MobileInfo
          icon={
            <GraduationCap
              size={15}
              className="text-purple-500"
            />
          }
          label="Education"
          value={
            item.education
          }
        />

        <MobileInfo
          icon={
            <Briefcase
              size={15}
              className="text-orange-500"
            />
          }
          label="Occupation"
          value={
            item.occupation
          }
        />

        <MobileInfo
          icon={
            <User
              size={15}
              className="text-blue-500"
            />
          }
          label="Father"
          value={
            item.fatherName
          }
        />

        <MobileInfo
          icon={
            <Heart
              size={15}
              className="text-pink-500"
            />
          }
          label="Mother"
          value={
            item.motherName
          }
        />

      </div>

      {/* DATE */}

      <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">

        <CalendarDays
          size={14}
        />

        Registered{" "}
        {formatDate(
          item.createdAt
        )}

      </div>

      {/* ACTIONS */}

      <div className="grid grid-cols-3 gap-3 mt-5">

        <button
          onClick={() =>
            onView(
              item._id
            )
          }
          className="bg-blue-50 text-blue-600 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-medium hover:bg-blue-100 transition"
        >
          <Eye size={18} />

          View
        </button>

        <button
          onClick={
            onEdit
          }
          className="bg-green-50 text-green-600 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-medium hover:bg-green-100 transition"
        >
          <Edit size={18} />

          Edit
        </button>

        <button
          onClick={
            onDelete
          }
          disabled={
            deleting
          }
          className="bg-red-50 text-red-600 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-xs font-medium hover:bg-red-100 transition disabled:opacity-50"
        >

          {deleting ? (
            <RefreshCw
              size={18}
              className="animate-spin"
            />
          ) : (
            <Trash2
              size={18}
            />
          )}

          Delete

        </button>

      </div>

    </div>
  );
};

// =========================================================
// MOBILE INFO
// =========================================================

const MobileInfo = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-3">

      <div className="flex items-center gap-2 mb-2">

        {icon}

        <p className="text-xs text-gray-500">
          {label}
        </p>

      </div>

      <h4 className="text-sm font-semibold capitalize break-words line-clamp-2">
        {value ||
          "N/A"}
      </h4>

    </div>
  );
};

// =========================================================
// EMPTY STATE
// =========================================================

const EmptyState = ({
  text,
}) => {
  return (
    <div className="py-12 text-center">

      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto">

        <FileText
          size={28}
          className="text-gray-400"
        />

      </div>

      <h3 className="font-semibold text-gray-700 mt-4">
        {text}
      </h3>

      <p className="text-sm text-gray-400 mt-1">
        Try changing your search or filters.
      </p>

    </div>
  );
};

export default AdminDashboard;

