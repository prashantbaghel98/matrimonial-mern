import React, { useState } from "react";
import { User, FileText, Edit, Trash2, X } from "lucide-react";

const Dashboard = () => {

  const [activeTab, setActiveTab] = useState("profile");

  const [biodata, setBiodata] = useState({
    name: "Rahul Dhangar",
    age: 28,
    height: "5'9",
    profession: "Software Engineer",
    location: "Pune, Maharashtra"
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(biodata);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const saveBiodata = () => {
    setBiodata(form);
    setEditing(false);
  };

  const deleteBiodata = () => {
    setBiodata({
      name: "",
      age: "",
      height: "",
      profession: "",
      location: ""
    });
  };

  return (
    <div className="flex min-h-screen mt-20 bg-gray-100">

      {/* Sidebar */}

      <aside className="w-64 bg-white shadow-lg p-6">

        <div className="flex items-center gap-3 mb-10">

          <img
            src="/profile.jpg"
            alt="profile"
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>
            <p className="font-semibold">Rahul</p>
            <p className="text-xs text-gray-500">User Account</p>
          </div>

        </div>

        <nav className="space-y-4">

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex w-full items-center gap-3 p-3 rounded-lg ${
              activeTab === "profile"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            <User size={18} />
            My Profile
          </button>

          <button
            onClick={() => setActiveTab("biodata")}
            className={`flex w-full items-center gap-3 p-3 rounded-lg ${
              activeTab === "biodata"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            <FileText size={18} />
            My Biodata
          </button>

        </nav>

      </aside>

      {/* Main Content */}

      <main className="flex-1 p-8">

        {/* Profile Page */}

        {activeTab === "profile" && (
          <>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back 👋
            </h1>

            <p className="text-gray-500 mb-8">
              Manage your matrimony profile
            </p>

            <div className="grid md:grid-cols-3 gap-6">

              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-400 text-sm">
                  Profile Status
                </p>
                <h2 className="text-xl font-semibold mt-2">
                  Active
                </h2>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-400 text-sm">
                  Profile Views
                </p>
                <h2 className="text-xl font-semibold mt-2">
                  245
                </h2>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <p className="text-gray-400 text-sm">
                  Interests Received
                </p>
                <h2 className="text-xl font-semibold mt-2">
                  12
                </h2>
              </div>

            </div>
          </>
        )}

        {/* Biodata Page */}

        {activeTab === "biodata" && (
          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-lg font-semibold mb-6">
              My Biodata
            </h2>

            {biodata.name ? (

              <>
                <div className="grid grid-cols-2 gap-6 text-sm">

                  <div>
                    <p className="text-gray-400">Name</p>
                    <p className="font-medium">{biodata.name}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Age</p>
                    <p>{biodata.age}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Height</p>
                    <p>{biodata.height}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Profession</p>
                    <p>{biodata.profession}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Location</p>
                    <p>{biodata.location}</p>
                  </div>

                </div>

                {/* Actions */}

                <div className="flex gap-4 mt-8">

                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    onClick={deleteBiodata}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>
              </>

            ) : (
              <p className="text-gray-500">
                No biodata available
              </p>
            )}

          </div>
        )}

      </main>

      {/* Edit Modal */}

      {editing && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-8 rounded-xl w-[400px] relative">

            <button
              onClick={() => setEditing(false)}
              className="absolute top-4 right-4"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Edit Biodata
            </h2>

            <div className="space-y-3">

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="border p-2 rounded w-full"
              />

              <input
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Age"
                className="border p-2 rounded w-full"
              />

              <input
                name="height"
                value={form.height}
                onChange={handleChange}
                placeholder="Height"
                className="border p-2 rounded w-full"
              />

              <input
                name="profession"
                value={form.profession}
                onChange={handleChange}
                placeholder="Profession"
                className="border p-2 rounded w-full"
              />

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Location"
                className="border p-2 rounded w-full"
              />

              <button
                onClick={saveBiodata}
                className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Dashboard;