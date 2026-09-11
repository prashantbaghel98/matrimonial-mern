
import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";

import axios from "axios";

import {
  Users,
  IndianRupee,
  Search,
  Edit,
  Trash2,
  LayoutDashboard,
  UserPlus,
  RefreshCw,
  Download,
  Filter,
  X,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpDown,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const initialFormData = {
  name: "",
  contactNo: "",
  genderSearch: "",
  planDuration: "",
  amount: "",
  startDate: "",
};

const Finance = () => {
  const { token } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("members");

  const [memberships, setMemberships] = useState([]);

  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [planFilter, setPlanFilter] = useState("all");

  const [sortBy, setSortBy] = useState("newest");

  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // ==========================================
  // FETCH MEMBERSHIPS
  // ==========================================

  const fetchMemberships = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/api/finance/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMemberships(res.data.memberships || []);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load memberships"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMemberships();
    }
  }, [token]);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // FORM VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter member name");
      return false;
    }

    const mobile = String(formData.contactNo).replace(
      /\D/g,
      ""
    );

    if (mobile.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return false;
    }

    if (!formData.genderSearch) {
      toast.error("Please select gender preference");
      return false;
    }

    if (!formData.planDuration) {
      toast.error("Please select membership plan");
      return false;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }

    return true;
  };

  // ==========================================
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      if (editId) {
        await axios.put(
          `${API_URL}/api/finance/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Membership updated successfully");
      } else {
        await axios.post(
          `${API_URL}/api/finance/membership-create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Membership created successfully");
      }

      resetForm();

      await fetchMemberships();

      setActiveTab("members");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setEditId(null);
    setFormData(initialFormData);
  };

  // ==========================================
  // ADD MEMBERSHIP
  // ==========================================

  const handleAddMembership = () => {
    resetForm();
    setActiveTab("add");
  };

  // ==========================================
  // EDIT MEMBERSHIP
  // ==========================================

  const handleEdit = (item) => {
    setEditId(item._id);

    setFormData({
      name: item.name || "",
      contactNo: String(item.contactNo || ""),
      genderSearch: item.genderSearch || "",
      planDuration: item.planDuration || "",
      amount: item.amount || "",
      startDate: item.startDate
        ? item.startDate.split("T")[0]
        : "",
    });

    setActiveTab("add");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    const member = memberships.find(
      (item) => item._id === id
    );

    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        member?.name || "this membership"
      }?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await axios.delete(
        `${API_URL}/api/finance/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Membership deleted successfully");

      await fetchMemberships();
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

  // ==========================================
  // RENEW MEMBERSHIP
  // ==========================================

  const handleRenew = async (item) => {
    try {
      setSubmitting(true);

      const today = new Date();

      const currentExpiry = item.expiryDate
        ? new Date(item.expiryDate)
        : today;

      const baseDate =
        currentExpiry > today
          ? currentExpiry
          : today;

      const renewedStartDate = new Date(baseDate);

      let renewedExpiry = new Date(baseDate);

      if (item.planDuration === "1 Month") {
        renewedExpiry.setMonth(
          renewedExpiry.getMonth() + 1
        );
      } else if (item.planDuration === "6 Months") {
        renewedExpiry.setMonth(
          renewedExpiry.getMonth() + 6
        );
      } else if (item.planDuration === "1 Year") {
        renewedExpiry.setFullYear(
          renewedExpiry.getFullYear() + 1
        );
      }

      await axios.put(
        `${API_URL}/api/finance/update/${item._id}`,
        {
          name: item.name,
          contactNo: item.contactNo,
          genderSearch: item.genderSearch,
          planDuration: item.planDuration,
          amount: item.amount,
          startDate: renewedStartDate
            .toISOString()
            .split("T")[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        `${item.name}'s membership renewed successfully`
      );

      await fetchMemberships();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Renewal failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // MEMBERSHIP STATUS
  // ==========================================

  const isActive = (item) => {
    if (!item.expiryDate) return false;

    return new Date(item.expiryDate) > new Date();
  };

  // ==========================================
  // DAYS LEFT
  // ==========================================

  const getDaysLeft = (expiryDate) => {
    if (!expiryDate) return null;

    const today = new Date();

    const expiry = new Date(expiryDate);

    const difference =
      expiry.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // FILTER + SEARCH + SORT
  // ==========================================

  const filteredMemberships = useMemo(() => {
    let result = [...memberships];

    const searchValue =
      search.trim().toLowerCase();

    // SEARCH
    if (searchValue) {
      result = result.filter((item) => {
        const name = String(
          item.name || ""
        ).toLowerCase();

        const contactNo = String(
          item.contactNo || ""
        ).toLowerCase();

        const gender = String(
          item.genderSearch || ""
        ).toLowerCase();

        const plan = String(
          item.planDuration || ""
        ).toLowerCase();

        return (
          name.includes(searchValue) ||
          contactNo.includes(searchValue) ||
          gender.includes(searchValue) ||
          plan.includes(searchValue)
        );
      });
    }

    // STATUS FILTER
    if (statusFilter === "active") {
      result = result.filter((item) =>
        isActive(item)
      );
    }

    if (statusFilter === "expired") {
      result = result.filter(
        (item) => !isActive(item)
      );
    }

    // PLAN FILTER
    if (planFilter !== "all") {
      result = result.filter(
        (item) =>
          item.planDuration === planFilter
      );
    }

    // SORT
    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0) -
          new Date(a.createdAt || 0)
      );
    }

    if (sortBy === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt || 0) -
          new Date(b.createdAt || 0)
      );
    }

    if (sortBy === "name") {
      result.sort((a, b) =>
        String(a.name || "").localeCompare(
          String(b.name || "")
        )
      );
    }

    if (sortBy === "amountHigh") {
      result.sort(
        (a, b) =>
          Number(b.amount || 0) -
          Number(a.amount || 0)
      );
    }

    if (sortBy === "amountLow") {
      result.sort(
        (a, b) =>
          Number(a.amount || 0) -
          Number(b.amount || 0)
      );
    }

    if (sortBy === "expiry") {
      result.sort(
        (a, b) =>
          new Date(a.expiryDate || 0) -
          new Date(b.expiryDate || 0)
      );
    }

    return result;
  }, [
    memberships,
    search,
    statusFilter,
    planFilter,
    sortBy,
  ]);

  // ==========================================
  // RESET PAGE WHEN FILTER CHANGES
  // ==========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    planFilter,
    sortBy,
  ]);

  // ==========================================
  // PAGINATION
  // ==========================================

  const totalPages = Math.ceil(
    filteredMemberships.length /
      itemsPerPage
  );

  const paginatedMemberships =
    filteredMemberships.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalRevenue = memberships.reduce(
    (sum, item) =>
      sum + Number(item.amount || 0),
    0
  );

  const activeMembers = memberships.filter(
    (item) => isActive(item)
  ).length;

  const expiredMembers = memberships.filter(
    (item) => !isActive(item)
  ).length;

  const expiringSoon = memberships.filter(
    (item) => {
      const days = getDaysLeft(
        item.expiryDate
      );

      return days !== null && days >= 0 && days <= 7;
    }
  ).length;

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPlanFilter("all");
    setSortBy("newest");
  };

  // ==========================================
  // EXPORT CSV
  // ==========================================

  const exportCSV = () => {
    if (!filteredMemberships.length) {
      toast.info("No memberships to export");
      return;
    }

    const headers = [
      "Name",
      "Contact",
      "Gender Preference",
      "Plan",
      "Amount",
      "Start Date",
      "Expiry Date",
      "Status",
    ];

    const rows = filteredMemberships.map(
      (item) => [
        item.name || "",
        item.contactNo || "",
        item.genderSearch || "",
        item.planDuration || "",
        item.amount || "",
        formatDate(item.startDate),
        formatDate(item.expiryDate),
        isActive(item)
          ? "Active"
          : "Expired",
      ]
    );

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `memberships-${new Date()
      .toISOString()
      .split("T")[0]}.csv`;

    link.click();

    URL.revokeObjectURL(url);

    toast.success(
      "Memberships exported successfully"
    );
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100 sm:flex">

      {/* ================= SIDEBAR ================= */}

      <div className="sm:w-72 pt-25 bg-slate-950 text-white p-6 lg:block">

        <h2 className="text-3xl font-bold mb-10">
          Membership
        </h2>

        <div className="space-y-3">

          <button
            onClick={() => {
              setActiveTab("members");
              resetForm();
            }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition ${
              activeTab === "members"
                ? "bg-red-600"
                : "hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard size={20} />
            All Memberships
          </button>

          <button
            onClick={handleAddMembership}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition ${
              activeTab === "add"
                ? "bg-red-600"
                : "hover:bg-slate-800"
            }`}
          >
            <UserPlus size={20} />
            Add Membership
          </button>

        </div>

      </div>

      {/* ================= CONTENT ================= */}

      <div className="flex-1 pt-25 p-6">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-red-600 via-red-700 to-pink-600 rounded-[35px] p-8 text-white mb-8 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <h1 className="text-4xl font-bold">
                Membership Dashboard
              </h1>

              <p className="mt-2 text-white/80">
                Manage members and revenue effortlessly
              </p>
            </div>

            {activeTab === "members" && (
              <div className="flex gap-3">

                <button
                  onClick={fetchMemberships}
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 transition disabled:opacity-50"
                >
                  <RefreshCw
                    size={18}
                    className={
                      loading
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Refresh
                </button>

                <button
                  onClick={exportCSV}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-red-600 hover:bg-gray-100 transition"
                >
                  <Download size={18} />

                  Export
                </button>

              </div>
            )}

          </div>

        </div>

        {/* ================= MEMBERS ================= */}

        {activeTab === "members" && (
          <>

            {/* STATISTICS */}

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

              <div className="bg-white p-6 rounded-3xl shadow-lg">
                <Users className="text-red-600" />

                <h2 className="text-4xl font-bold mt-3">
                  {memberships.length}
                </h2>

                <p className="text-gray-500">
                  Total Members
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-lg">
                <IndianRupee className="text-green-600" />

                <h2 className="text-4xl font-bold mt-3">
                  ₹
                  {totalRevenue.toLocaleString(
                    "en-IN"
                  )}
                </h2>

                <p className="text-gray-500">
                  Total Revenue
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-lg">
                <CheckCircle className="text-green-600" />

                <h2 className="text-4xl font-bold mt-3">
                  {activeMembers}
                </h2>

                <p className="text-gray-500">
                  Active Members
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-lg">
                <XCircle className="text-red-600" />

                <h2 className="text-4xl font-bold mt-3">
                  {expiredMembers}
                </h2>

                <p className="text-gray-500">
                  Expired
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-lg">
                <Clock className="text-orange-500" />

                <h2 className="text-4xl font-bold mt-3">
                  {expiringSoon}
                </h2>

                <p className="text-gray-500">
                  Expiring in 7 Days
                </p>
              </div>

            </div>

            {/* SEARCH */}

            <div className="bg-white p-4 rounded-3xl shadow-lg mb-6">

              <div className="flex flex-col lg:flex-row gap-3">

                <div className="relative flex-1">

                  <Search
                    className="absolute left-4 top-4 text-gray-400"
                    size={20}
                  />

                  <input
                    type="text"
                    placeholder="Search name, mobile, gender or plan..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    className="w-full h-14 pl-12 pr-12 rounded-2xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-500"
                  />

                  {search && (
                    <button
                      onClick={() =>
                        setSearch("")
                      }
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  )}

                </div>

                <button
                  onClick={() =>
                    setShowFilters(
                      !showFilters
                    )
                  }
                  className={`h-14 px-5 rounded-2xl flex items-center justify-center gap-2 border transition ${
                    showFilters
                      ? "bg-red-600 text-white border-red-600"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <Filter size={18} />

                  Filters
                </button>

              </div>

              {/* FILTERS */}

              {showFilters && (
                <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t">

                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Status
                    </label>

                    <select
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(
                          e.target.value
                        )
                      }
                      className="w-full h-12 px-4 rounded-xl border outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="all">
                        All Status
                      </option>

                      <option value="active">
                        Active
                      </option>

                      <option value="expired">
                        Expired
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Plan
                    </label>

                    <select
                      value={planFilter}
                      onChange={(e) =>
                        setPlanFilter(
                          e.target.value
                        )
                      }
                      className="w-full h-12 px-4 rounded-xl border outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="all">
                        All Plans
                      </option>

                      <option value="1 Month">
                        1 Month
                      </option>

                      <option value="6 Months">
                        6 Months
                      </option>

                      <option value="1 Year">
                        1 Year
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">
                      Sort By
                    </label>

                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value
                        )
                      }
                      className="w-full h-12 px-4 rounded-xl border outline-none focus:ring-2 focus:ring-red-500"
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

                      <option value="amountHigh">
                        Amount High-Low
                      </option>

                      <option value="amountLow">
                        Amount Low-High
                      </option>

                      <option value="expiry">
                        Expiry Date
                      </option>
                    </select>
                  </div>

                  <div className="md:col-span-3 flex justify-between items-center">

                    <p className="text-sm text-gray-500">
                      Showing{" "}
                      <b>
                        {filteredMemberships.length}
                      </b>{" "}
                      memberships
                    </p>

                    <button
                      onClick={clearFilters}
                      className="text-red-600 font-medium hover:underline"
                    >
                      Clear Filters
                    </button>

                  </div>

                </div>
              )}

            </div>

            {/* RESULTS */}

            {loading ? (
              <div className="bg-white rounded-3xl p-16 text-center shadow-lg">

                <RefreshCw
                  size={40}
                  className="mx-auto animate-spin text-red-600"
                />

                <p className="mt-4 text-gray-500">
                  Loading memberships...
                </p>

              </div>
            ) : paginatedMemberships.length === 0 ? (

              <div className="bg-white rounded-3xl p-16 text-center shadow-lg">

                <Users
                  size={50}
                  className="mx-auto text-gray-300"
                />

                <h3 className="text-xl font-bold mt-4">
                  No Membership Found
                </h3>

                <p className="text-gray-500 mt-2">
                  Try changing your search or filters.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-5 px-5 py-3 rounded-xl bg-red-600 text-white"
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              <>
                <div className="grid xl:grid-cols-2 gap-5">

                  {paginatedMemberships.map(
                    (item) => {
                      const active =
                        isActive(item);

                      const daysLeft =
                        getDaysLeft(
                          item.expiryDate
                        );

                      const expiring =
                        daysLeft !== null &&
                        daysLeft >= 0 &&
                        daysLeft <= 7;

                      return (
                        <div
                          key={item._id}
                          className={`bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition border ${
                            expiring
                              ? "border-orange-300"
                              : "border-transparent"
                          }`}
                        >

                          {/* MEMBER HEADER */}

                          <div className="flex justify-between gap-4">

                            <div className="min-w-0">

                              <h3 className="text-xl font-bold capitalize truncate">
                                {item.name}
                              </h3>

                              <p className="text-gray-500">
                                {item.contactNo}
                              </p>

                            </div>

                            <span
                              className={`px-3 py-1 rounded-full text-xs h-fit whitespace-nowrap ${
                                active
                                  ? "bg-green-100 text-green-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {active
                                ? "Active"
                                : "Expired"}
                            </span>

                          </div>

                          {/* MEMBER DETAILS */}

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

                            <div>
                              <p className="text-xs text-gray-400">
                                Plan
                              </p>

                              <p className="font-semibold">
                                {item.planDuration}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">
                                Amount
                              </p>

                              <p className="font-semibold">
                                ₹
                                {Number(
                                  item.amount || 0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">
                                Gender
                              </p>

                              <p className="font-semibold">
                                {item.genderSearch ||
                                  "-"}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-gray-400">
                                Days Left
                              </p>

                              <p
                                className={`font-semibold ${
                                  expiring
                                    ? "text-orange-600"
                                    : !active
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {active
                                  ? `${daysLeft} days`
                                  : "Expired"}
                              </p>
                            </div>

                          </div>

                          {/* DATES */}

                          <div className="grid grid-cols-2 gap-4 mt-5 p-4 rounded-2xl bg-slate-50">

                            <div className="flex items-center gap-3">

                              <CalendarDays
                                size={18}
                                className="text-gray-400"
                              />

                              <div>
                                <p className="text-xs text-gray-400">
                                  Start Date
                                </p>

                                <p className="text-sm font-semibold">
                                  {formatDate(
                                    item.startDate
                                  )}
                                </p>
                              </div>

                            </div>

                            <div className="flex items-center gap-3">

                              <Clock
                                size={18}
                                className="text-gray-400"
                              />

                              <div>
                                <p className="text-xs text-gray-400">
                                  Expiry Date
                                </p>

                                <p className="text-sm font-semibold">
                                  {formatDate(
                                    item.expiryDate
                                  )}
                                </p>
                              </div>

                            </div>

                          </div>

                          {/* EXPIRING WARNING */}

                          {expiring && active && (
                            <div className="mt-4 px-4 py-3 rounded-xl bg-orange-50 text-orange-700 text-sm font-medium">
                              Membership expires in{" "}
                              {daysLeft}{" "}
                              {daysLeft === 1
                                ? "day"
                                : "days"}
                              .
                            </div>
                          )}

                          {/* ACTIONS */}

                          <div className="grid grid-cols-3 gap-3 mt-6">

                            <button
                              onClick={() =>
                                handleEdit(item)
                              }
                              className="h-11 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center justify-center gap-2"
                            >
                              <Edit size={16} />

                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleRenew(item)
                              }
                              disabled={
                                submitting
                              }
                              className="h-11 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              <RefreshCw
                                size={16}
                              />

                              Renew
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  item._id
                                )
                              }
                              disabled={
                                deletingId ===
                                item._id
                              }
                              className="h-11 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {deletingId ===
                              item._id ? (
                                <RefreshCw
                                  size={16}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={16}
                                />
                              )}

                              Delete
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

                {/* PAGINATION */}

                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-white p-5 rounded-2xl shadow">

                    <p className="text-sm text-gray-500">
                      Page{" "}
                      <b>{currentPage}</b>{" "}
                      of{" "}
                      <b>{totalPages}</b>
                    </p>

                    <div className="flex gap-2">

                      <button
                        disabled={
                          currentPage === 1
                        }
                        onClick={() =>
                          setCurrentPage(
                            (prev) =>
                              prev - 1
                          )
                        }
                        className="px-4 py-2 rounded-xl border disabled:opacity-40 hover:bg-gray-50"
                      >
                        Previous
                      </button>

                      {Array.from(
                        {
                          length: totalPages,
                        },
                        (_, index) =>
                          index + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() =>
                            setCurrentPage(
                              page
                            )
                          }
                          className={`w-10 h-10 rounded-xl ${
                            currentPage ===
                            page
                              ? "bg-red-600 text-white"
                              : "border hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        disabled={
                          currentPage ===
                          totalPages
                        }
                        onClick={() =>
                          setCurrentPage(
                            (prev) =>
                              prev + 1
                          )
                        }
                        className="px-4 py-2 rounded-xl border disabled:opacity-40 hover:bg-gray-50"
                      >
                        Next
                      </button>

                    </div>

                  </div>
                )}

              </>
            )}

          </>
        )}

        {/* ================= ADD / UPDATE ================= */}

        {activeTab === "add" && (

          <div className="bg-white rounded-[35px] p-8 shadow-lg">

            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-3xl font-bold">
                  {editId
                    ? "Update Membership"
                    : "Create Membership"}
                </h2>

                <p className="text-gray-500 mt-1">
                  {editId
                    ? "Update member information and membership details."
                    : "Add a new member to your membership database."}
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab(
                    "members"
                  );
                }}
                className="p-3 rounded-xl hover:bg-gray-100"
              >
                <X size={22} />
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-2 gap-5"
            >

              {/* NAME */}

              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Full Name
                </label>

                <input
                  name="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-14 px-4 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* MOBILE */}

              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Mobile Number
                </label>

                <input
                  name="contactNo"
                  type="tel"
                  maxLength={10}
                  placeholder="10 digit mobile number"
                  value={formData.contactNo}
                  onChange={(e) =>
                    setFormData(
                      (prev) => ({
                        ...prev,
                        contactNo:
                          e.target.value.replace(
                            /\D/g,
                            ""
                          ),
                      })
                    )
                  }
                  className="w-full h-14 px-4 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* GENDER */}

              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Gender Preference
                </label>

                <select
                  name="genderSearch"
                  value={
                    formData.genderSearch
                  }
                  onChange={handleChange}
                  className="w-full h-14 px-4 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">
                    Select Gender Preference
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>
                </select>
              </div>

              {/* PLAN */}

              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Membership Plan
                </label>

                <select
                  name="planDuration"
                  value={
                    formData.planDuration
                  }
                  onChange={handleChange}
                  className="w-full h-14 px-4 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">
                    Select Plan
                  </option>

                  <option value="1 Month">
                    1 Month
                  </option>

                  <option value="6 Months">
                    6 Months
                  </option>

                  <option value="1 Year">
                    1 Year
                  </option>
                </select>
              </div>

              {/* AMOUNT */}

              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Amount
                </label>

                <div className="relative">

                  <IndianRupee
                    size={18}
                    className="absolute left-4 top-4 text-gray-400"
                  />

                  <input
                    type="number"
                    name="amount"
                    min="1"
                    placeholder="Enter amount"
                    value={
                      formData.amount
                    }
                    onChange={handleChange}
                    className="w-full h-14 pl-11 pr-4 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
                  />

                </div>
              </div>

              {/* START DATE */}

              <div>
                <label className="text-sm font-medium text-gray-600 mb-2 block">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={
                    formData.startDate
                  }
                  onChange={handleChange}
                  className="w-full h-14 px-4 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* SUBMIT */}

              <div className="md:col-span-2 flex gap-3 pt-3">

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >

                  {submitting && (
                    <RefreshCw
                      size={18}
                      className="animate-spin"
                    />
                  )}

                  {submitting
                    ? "Saving..."
                    : editId
                    ? "Update Membership"
                    : "Create Membership"}

                </button>

                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab(
                      "members"
                    );
                  }}
                  className="px-8 h-14 rounded-2xl border border-gray-200 hover:bg-gray-50"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )}

      </div>

    </div>
  );
};

export default Finance;
