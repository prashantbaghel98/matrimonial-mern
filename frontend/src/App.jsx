import './App.css'
import Footer from './Components/Footer'
import Header from './Components/Header'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Membership from './Pages/Membership'
import AboutUs from './Pages/AboutUs'
import SuccessStoriesPage from './Pages/SuccessStoriesPage'
import ContactUs from './Pages/ContactUs'
import ScheduleCall from './Pages/ScheduleCall'
import BrowseProfiles from './Pages/BrowseProfiles'
import ProfileDetails from './Pages/ProfileDetails'
import UserDashboard from './Pages/UserDashboard'
import CreateProfile from './Pages/CreateProfile'
import { AuthProvider } from "./context/AuthContext";
import Login from './Pages/Login'
import ScrollToTop from './Components/ScrollToTop'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from './Pages/ProtectedRoute'
import Register from './Pages/Register'
import AdminDashboard from './Pages/AdminDashboard'
import OfferPopup from './Components/OfferPopup'
import { useState, useEffect } from 'react'
import Finance from './Components/Finance'
import PrivacyPolicy from './Pages/PrivacyPolicy'
import Terms from './Pages/Terms'
import Disclaimer from './Pages/Disclaimer'
import RefundPolicy from './Pages/RefundPolicy'
import axios from "axios";




function App() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    const popupShown = localStorage.getItem("offerPopupShown");

    if (!popupShown) {
      setTimeout(() => {
        setIsOpen(true);
      }, 1000);
    }
  }, []);

  const closePopup = () => {
    localStorage.setItem("offerPopupShown", "true");
    setIsOpen(false);
  };




useEffect(() => {
  const API_URL = import.meta.env.VITE_API_URL;
  const CACHE_KEY =
    'browseProfilesCache:{"page":1,"limit":25}';
  const CACHE_TTL = 5 * 60 * 1000;

  let cancelled = false;

  const preloadProfiles = async () => {
    try {
      // Reuse a valid cache if one already exists
      const existing = sessionStorage.getItem(CACHE_KEY);

      if (existing) {
        const cached = JSON.parse(existing);

        if (
          cached.timestamp &&
          Date.now() - cached.timestamp < CACHE_TTL
        ) {
          return;
        }
      }

      // Automatically fetch profiles in the background
      const response = await axios.get(
        `${API_URL}/api/profile`,
        {
          params: {
            page: 1,
            limit: 25,
          },
        }
      );

      if (cancelled) return;

      const data = response.data;

      // Save the result for BrowseProfiles.jsx
      sessionStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          profiles: data.profiles || [],
          total: Number(data.total) || 0,
          page: Number(data.page) || 1,
          hasMore: Boolean(data.hasMore),
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Profile preloading failed:", error);
    }
  };

  preloadProfiles();

  return () => {
    cancelled = true;
  };
}, []);



  return (
    <>
      <OfferPopup onClick={closePopup} />
      <Header />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/membership' element={<Membership />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/success-stories' element={<SuccessStoriesPage />} />
        <Route path='/contact' element={<ContactUs />} />
        <Route path='/schedule-call' element={<ScheduleCall />} />
        <Route path='/browse-profile' element={<BrowseProfiles />} />
        <Route path="/browse-profile/:id" element={<ProfileDetails />} />
        <Route path='/user/dashboard' element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path='/admin/dashboard' element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path='/profile-create' element={<ProtectedRoute><CreateProfile mode="create" /></ProtectedRoute>} />
        <Route path="/update-profile/:id" element={<ProtectedRoute><CreateProfile mode="update" /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/membership" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/terms-condition' element={<Terms />} />
        <Route path='/disclaimer' element={<Disclaimer />} />
        <Route path='/refund' element={<RefundPolicy />} />
      </Routes>
      <Footer />




    </>
  )
}

export default App
