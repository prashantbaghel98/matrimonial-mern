import React, { useContext, useEffect, useState } from "react";
import { User, GraduationCap, Users, Heart } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ProfileDetails.css"


const ProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);


  



  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/profile/${id}`
      );
      setProfile(res.data);
    };
    fetchProfile();
  }, [id]);

  // ✅ FINAL PDF FUNCTION (NO UI CHANGE)
  const downloadPDF = async () => {
    const original = document.getElementById("pdf-content");

    // 🔥 Clone element (hidden)
    const clone = original.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.top = "-9999px";
    clone.style.left = "0";
    clone.style.padding = "30px";
    clone.style.width = "800px";
    clone.style.background = "#ffffff";
    clone.style.boxSizing = "border-box";

    document.body.appendChild(clone);

    // 🔥 Fix badge only for PDF
    const badges = clone.querySelectorAll("[data-badge]");
    badges.forEach((el) => {
      el.style.paddingBottom = "15px";
    });

    await new Promise((r) => setTimeout(r, 200));

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);

    pdf.save(`${profile.name}-biodata.pdf`);

    // 🧹 cleanup
    document.body.removeChild(clone);
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div style={styles.page} className="bioPage">
      {/* Buttons */}
      <div style={styles.buttonWrapper}>
        <button onClick={() => navigate("/browse-profile")} style={styles.btn}>
          ← Back
        </button>
        <button onClick={downloadPDF} style={styles.downloadBtn}>
          Download PDF
        </button>
      </div>

      {/* Visible UI */}
      <div id="pdf-content" style={styles.card} className="card">
        {/* 🔴 WATERMARK */}

        <div style={styles.watermarkWrapper}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={styles.watermarkRow}>
              Apna Vivah  Apna Vivah  Apna Vivah  Apna Vivah
            </div>
          ))}
        </div>
        <div style={styles.title}>BIODATA</div>
        <div style={styles.header} className="header">
          <div style={styles.infoBlock}>
            <h2 style={{ margin: 0 }}>{profile.name}</h2>
            <p style={{ margin: "5px 0" }}>
              {profile.occupation} ({profile.city})
            </p>

            {/* 🔴 IMPORTANT: data-badge */}
            <div data-badge style={styles.badge} className="bio-badge">
              {profile.maritalStatus}
            </div>
          </div>

          <img
            src={profile.photo || "https://via.placeholder.com/150"}
            style={styles.image}
          />
        </div>

        {/* Sections */}
        <Section title="Personal Profile" icon={<User size={16} />}>
          <Grid>
            <Item label="DOB" value={profile.dob ? profile.dob.split("-").reverse().join("-") : ""}/>
            {/* <Item label="Time" value={profile.time} /> */}
            {/* <Item label="Place" value={profile.place} /> */}
            <Item label="Height" value={profile.height} />
            <Item label="Colour" value={profile.colour} />
            <Item label="Father Gotra" value={profile.gotraFather} />
            <Item label="Mother Gotra" value={profile.gotraMother} />
            <Item label="Gender" value={profile.gender} />
            <Item label="City" value={profile.city} />
            {/* <Item label="Address" value={profile.fullAddress} /> */}
            {user && <Item label="Address" value={profile.fullAddress} />}
            {user && <Item label="Contact" value={profile.contactNo} />}
          </Grid>
        </Section>

        <Section title="Education & Career" icon={<GraduationCap size={16} />}>
          <Grid>
            <Item label="Education" value={profile.education} />
            <Item label="Occupation" value={profile.occupation} />
            <Item label="Income" value={`₹${profile.income}`} />
          </Grid>
        </Section>

        <Section title="Family Details" icon={<Users size={16} />}>
          <Grid>
            <Item label="Father" value={profile.fatherName} />
            <Item label="Father Occupation" value={profile.fatherOccupation} />
            <Item label="Mother" value={profile.motherName} />
            <Item label="Mother Occupation" value={profile.motherOccupation} />
          </Grid>
        </Section>

        {/* <Section title="Partner Expectations" icon={<Heart size={16} />}>
          <div style={styles.partnerBox} className="partnerBox">
            <p>✔ Age: 24 - 28</p>
            <p>✔ Height: 5'2 - 5'7</p>
            <p>✔ Never Married</p>
            <p>✔ Religion: Hindu</p>
          </div>
        </Section> */}
      </div>
    </div>
  );
};

// 🔹 Components
const Section = ({ title, icon, children }) => (
  <div>
    <h3 style={styles.sectionTitle}>
      {icon} {title}
    </h3>
    {children}
  </div>
);

const Grid = ({ children, grid }) => (
  <div style={styles.grid} className={"grid"}>{children}</div>
);

const Item = ({ label, value }) => (
  <div style={styles.row}>
    <span style={styles.label}>{label}:</span>
    <span style={styles.value}>{value || "-"}</span>
  </div>
);

// 🔹 Styles
const styles = {
  page: {
    background: "#f3f4f6",
    padding: "40px",
    marginTop:"10px",
    minHeight: "100vh",

  },
  card: {
    maxWidth: "800px",
    margin: "auto",
    background: "#fffaf0",
    padding: "30px",
    border: "5px double #FF7300",
    position: "relative",
    overflow: "hidden",
     minHeight: "1132px", // A4 height for screen
  height: "auto",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
  title: {
    textAlign: "center",
    fontSize: "25px",
    fontWeight: "bold",
    marginBottom: "20px",
    borderBottom: "2px solid #000",
    paddingBottom: "10px"

  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },
  image: {
    width: "120px",
    height: "150px",
    objectFit: "cover",
    border: "2px solid #000",
  },
  infoBlock: {
    flex: 1,
  },
  badge: {
    background: "#e5e7eb",
    padding: "0 16px",
    height: "32px",
    borderRadius: "20px",
    fontSize: "13px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10px",
    fontWeight: "500",
  },
  sectionTitle: {
    fontWeight: "bold",
    borderBottom: "1px solid #ccc",
    marginTop: "25px",
    paddingBottom: "10px",
    marginBottom: "15px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px 40px",

  },
  row: {
    display: "flex",
  },
  label: {
    fontWeight: "bold",
    width: "45%",
  },
  value: {
    width: "55%",
  },
  partnerBox: {
    background: "#f5f5f5",
    padding: "15px",
    marginTop: "15px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  buttonWrapper: {
    marginTop: "50px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginBottom: "10px",
  },
  btn: {
    padding: "8px 12px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "6px",
  },
  downloadBtn: {
    padding: "8px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },

  watermarkWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    // transform: "rotate(-25deg)",
    pointerEvents: "none",
    zIndex: 0,
  },

  watermarkRow: {
    fontSize: "32px",
    color: "rgba(0,0,0,0.02)",
    whiteSpace: "nowrap",
    textAlign: "center",
    letterSpacing: "2px",
  },

  cardContent: {
    position: "relative",
    zIndex: 1,
  }
};

export default ProfileDetails;