import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Users,
  IndianRupee,
  Search,
  Edit,
  Trash2,
  LayoutDashboard,
  UserPlus,
  BarChart3,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Finance = () => {
  const { token } = useContext(AuthContext);

  

  const [activeTab, setActiveTab] = useState("members");
  const [memberships, setMemberships] = useState([]);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    genderSearch: "",
    planDuration: "",
    amount: "",
    startDate: "",
  });

  const fetchMemberships = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/finance/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "API Response:",
        JSON.stringify(res.data, null, 2)
      );

      setMemberships(res.data.memberships || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchMemberships();
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/finance/update/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Membership Updated");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/finance/membership-create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Membership Created");
      }

      setEditId(null);

      setFormData({
        name: "",
        contactNo: "",
        genderSearch: "",
        planDuration: "",
        amount: "",
        startDate: "",
      });

      fetchMemberships();
      setActiveTab("members");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);

    setFormData({
      name: item.name,
      contactNo: item.contactNo,
      genderSearch: item.genderSearch,
      planDuration: item.planDuration,
      amount: item.amount,
      startDate: item.startDate
        ? item.startDate.split("T")[0]
        : "",
    });

    setActiveTab("add");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete membership?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/finance/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Deleted Successfully");
      fetchMemberships();
    } catch (error) {
      toast.error("Delete Failed");
    }
  };

  const filteredMemberships = memberships.filter(
    (item) =>
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.contactNo?.includes(search)
  );

  const totalRevenue = memberships.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const activeMembers = memberships.filter(
    (item) =>
      item.expiryDate && new Date(item.expiryDate) > new Date()
  ).length;

  const expiredMembers = memberships.filter(
  (item) =>
    item.expiryDate &&
    new Date(item.expiryDate) <= new Date()
).length;

  return (
    <div className="min-h-screen bg-slate-100 sm:flex">

      {/* SIDEBAR */}

      <div className="sm:w-72 pt-25 bg-slate-950 text-white p-6 lg:block">

        <h2 className="text-3xl font-bold mb-10">
          Membership
        </h2>

        <div className="space-y-3">

          <button
            onClick={() => setActiveTab("members")}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition ${activeTab === "members"
              ? "bg-red-600"
              : "hover:bg-slate-800"
              }`}
          >
            <LayoutDashboard size={20} />
            All Memberships
          </button>

          <button
            onClick={() => {
              setEditId(null);
              setFormData({
                name: "",
                contactNo: "",
                genderSearch: "",
                planDuration: "",
                amount: "",
              });
              setActiveTab("add");
            }}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition ${activeTab === "add"
              ? "bg-red-600"
              : "hover:bg-slate-800"
              }`}
          >
            <UserPlus size={20} />
            Add Membership
          </button>

         
        </div>
      </div>

      {/* CONTENT */}

      <div className="flex-1 pt-25 p-6">

        <div className="bg-gradient-to-r from-red-600 via-red-700 to-pink-600 rounded-[35px] p-8 text-white mb-8 shadow-xl">
          <h1 className="text-4xl font-bold">
            Membership Dashboard
          </h1>

          <p className="mt-2 text-white/80">
            Manage members and revenue effortlessly
          </p>
        </div>

        {/* MEMBERS TAB */}

        {activeTab === "members" && (
          <>
            <div className="grid md:grid-cols-4 gap-5 mb-8">

              <div className="bg-white p-6 rounded-3xl shadow-lg">
                <Users />
                <h2 className="text-4xl font-bold mt-3">
                  {memberships.length}
                </h2>
                <p className="text-gray-500">
                  Total Members
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-lg">
                <IndianRupee />
                <h2 className="text-4xl font-bold mt-3">
                  ₹{totalRevenue}
                </h2>
                <p className="text-gray-500">
                  Revenue
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-lg ">
                <Users />
                <h2 className="text-4xl font-bold mt-3 ">
                  {activeMembers}
                </h2>
                <p className="text-gray-500">
                  Active Members
                </p>
              </div>

               <div className="bg-white p-6 rounded-3xl shadow-lg">
                <Users />
                <h2 className="text-4xl font-bold mt-3">
                  {expiredMembers}
                </h2>
                <p className="text-gray-500">
                  Plan Expired
                </p>
              </div>
            </div>

            <div className="relative mb-8">
              <Search
                className="absolute left-4 top-4 text-gray-400"
                size={20}
              />

              <input
                type="text"
                placeholder="Search Member..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 pl-12 rounded-2xl border bg-white"
              />
            </div>

            <div className="grid xl:grid-cols-2 gap-5">

              {filteredMemberships.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition"
                >
                  <div className="flex justify-between">

                    <div>
                      <h3 className="text-xl font-bold capitalize">
                        {item.name}
                      </h3>

                      <p className="text-gray-500">
                        {item.contactNo}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs h-fit ${item.expiryDate &&
                        new Date(item.expiryDate) > new Date()
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                        }`}
                    >
                      {item.expiryDate &&
                        new Date(item.expiryDate) > new Date()
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-5">

                    <div>
                      <p className="text-xs text-gray-400">
                        Plan
                      </p>

                      <p className="font-semibold ">
                        {item.planDuration}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Amount
                      </p>

                      <p className="font-semibold ">
                        ₹{item.amount}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 h-11 rounded-xl bg-blue-50"
                    >
                      <Edit
                        size={16}
                        className="inline mr-2"
                      />
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(item._id)
                      }
                      className="flex-1 h-11 rounded-xl bg-red-50 text-red-600"
                    >
                      <Trash2
                        size={16}
                        className="inline mr-2"
                      />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ADD MEMBER */}

        {activeTab === "add" && (
          <div className="bg-white rounded-[35px] p-8 shadow-lg">

            <h2 className="text-3xl font-bold mb-8">
              {editId
                ? "Update Membership"
                : "Create Membership"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-2 gap-5"
            >

              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="h-14 px-4 border rounded-2xl"
              />

              <input
                name="contactNo"
                placeholder="Mobile Number"
                value={formData.contactNo}
                onChange={handleChange}
                className="h-14 px-4 border rounded-2xl"
              />

              <select
                name="genderSearch"
                value={formData.genderSearch}
                onChange={handleChange}
                className="h-14 px-4 border rounded-2xl"
              >
                <option value="">
                  Gender Preference
                </option>
                <option value="Male">Male</option>
                <option value="Female">
                  Female
                </option>
              </select>

              <select
                name="planDuration"
                value={formData.planDuration}
                onChange={handleChange}
                className="h-14 px-4 border rounded-2xl"
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

              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                className="h-14 px-4 border rounded-2xl"
              />

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="h-14 px-4 border rounded-2xl"
              />

              <button className="h-14 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold">
                {editId
                  ? "Update Membership"
                  : "Create Membership"}
              </button>
            </form>
          </div>
        )}

    

      </div>
    </div>
  );
};

export default Finance;