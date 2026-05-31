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
import { useEffect } from 'react'





function App() {


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



  return (
    <>
    <OfferPopup onClick={closePopup}/>
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
        <Route path='/admin/dashboard' element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
        <Route path='/profile-create' element={<ProtectedRoute><CreateProfile mode="create" /></ProtectedRoute>} />
        <Route path="/update-profile/:id" element={<ProtectedRoute><CreateProfile mode="update" /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
         <Route path="/register" element={<Register/>} />
      </Routes>

      <Footer />



    </>
  )
}

export default App
