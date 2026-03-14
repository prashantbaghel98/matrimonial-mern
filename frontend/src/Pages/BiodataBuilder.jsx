import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BiodataBuilder = () => {

  const pdfRef = useRef();

  const [photo, setPhoto] = useState(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    height: "",
    gender: "",
    profession: "",
    education: "",
    religion: "",
    caste: "",
    location: "",
    salary: "",
    phone: "",
    father: "",
    mother: "",
    siblings: "",
    about: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const downloadPDF = async () => {

    const canvas = await html2canvas(pdfRef.current, {
  scale: 2,
  backgroundColor: "#ffffff",
  useCORS: true
});

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);

    pdf.save("apna-vivah-biodata.pdf");
  };

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="grid lg:grid-cols-2 gap-10 max-w-7xl mx-auto">

        {/* FORM */}

        <div className="bg-white p-8 rounded-xl shadow-lg space-y-4">

          <h2 className="text-2xl font-semibold mb-4">
            Fill Your Biodata
          </h2>

          <input name="name" placeholder="Full Name"
            onChange={handleChange}
            className="border p-3 rounded w-full"/>

          <div className="grid grid-cols-2 gap-4">

            <input name="age" placeholder="Age"
              onChange={handleChange}
              className="border p-3 rounded"/>

            <input name="height" placeholder="Height"
              onChange={handleChange}
              className="border p-3 rounded"/>

          </div>

          <input name="profession" placeholder="Profession"
            onChange={handleChange}
            className="border p-3 rounded w-full"/>

          <input name="education" placeholder="Education"
            onChange={handleChange}
            className="border p-3 rounded w-full"/>

          <div className="grid grid-cols-2 gap-4">

            <input name="religion" placeholder="Religion"
              onChange={handleChange}
              className="border p-3 rounded"/>

            <input name="caste" placeholder="Caste"
              onChange={handleChange}
              className="border p-3 rounded"/>

          </div>

          <input name="location" placeholder="Location"
            onChange={handleChange}
            className="border p-3 rounded w-full"/>

          <input name="salary" placeholder="Annual Income"
            onChange={handleChange}
            className="border p-3 rounded w-full"/>

          <input name="phone" placeholder="Contact Number"
            onChange={handleChange}
            className="border p-3 rounded w-full"/>

          <h3 className="font-semibold pt-4">
            Family Details
          </h3>

          <input name="father" placeholder="Father Name"
            onChange={handleChange}
            className="border p-3 rounded w-full"/>

          <input name="mother" placeholder="Mother Name"
            onChange={handleChange}
            className="border p-3 rounded w-full"/>

          <input name="siblings" placeholder="Siblings"
            onChange={handleChange}
            className="border p-3 rounded w-full"/>

          <textarea name="about" placeholder="About Yourself"
            onChange={handleChange}
            className="border p-3 rounded w-full"/>

          <input type="file"
            onChange={handlePhoto}
            className="border p-2 rounded w-full"/>

          <button
            onClick={downloadPDF}
            className="w-full bg-red-600 text-white py-3 rounded-lg mt-4 hover:bg-red-700"
          >
            Download Biodata PDF
          </button>

        </div>


        {/* PREVIEW */}

        <div
          ref={pdfRef}
          className="bg-white rounded-xl shadow-lg p-10 relative"
        >

          <div className="absolute inset-0 flex items-center justify-center opacity-10 text-6xl font-bold rotate-[-30deg]">
            Apna Vivah
          </div>

          <div className="flex gap-6 items-center mb-6">

            {photo && (
              <img
                src={photo}
                alt="profile"
                className="w-28 h-28 object-cover rounded-lg border"
              />
            )}

            <div>
              <h2 className="text-2xl font-bold">
                {form.name || "Your Name"}
              </h2>

              <p className="text-gray-500">
                {form.profession || "Profession"}
              </p>

              <p className="text-gray-400 text-sm">
                {form.location || "Location"}
              </p>
            </div>

          </div>


          <div className="grid grid-cols-2 gap-6 text-sm">

            <div>
              <p className="text-gray-400">Age</p>
              <p>{form.age || "-"}</p>
            </div>

            <div>
              <p className="text-gray-400">Height</p>
              <p>{form.height || "-"}</p>
            </div>

            <div>
              <p className="text-gray-400">Religion</p>
              <p>{form.religion || "-"}</p>
            </div>

            <div>
              <p className="text-gray-400">Caste</p>
              <p>{form.caste || "-"}</p>
            </div>

            <div>
              <p className="text-gray-400">Education</p>
              <p>{form.education || "-"}</p>
            </div>

            <div>
              <p className="text-gray-400">Income</p>
              <p>{form.salary || "-"}</p>
            </div>

          </div>


          <div className="mt-8">

            <h3 className="font-semibold mb-2">
              Family Details
            </h3>

            <p>Father: {form.father || "-"}</p>
            <p>Mother: {form.mother || "-"}</p>
            <p>Siblings: {form.siblings || "-"}</p>

          </div>


          <div className="mt-8">

            <h3 className="font-semibold mb-2">
              About
            </h3>

            <p className="text-gray-600">
              {form.about || "-"}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BiodataBuilder;