import './App.css'
import Footer from './Components/Footer'
import Header from './Components/Header'
import { Routes,Route } from 'react-router-dom'
import Home from './Pages/Home'
import Membership from './Pages/Membership'
import AboutUs from './Pages/AboutUs'
import SuccessStoriesPage from './Pages/SuccessStoriesPage'
import ContactUs from './Pages/ContactUs'
import ScheduleCall from './Pages/ScheduleCall'
import BrowseProfiles from './Pages/BrowseProfiles'
import ProfileDetails from './Pages/ProfileDetails'
import Dashboard from './Pages/Dashboard'
import CreateProfile from './Pages/CreateProfile'
import { AuthProvider } from "./context/AuthContext";
import Login from './Pages/Login'




function App() {


  return (
    <>
    
    <Header/>

    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/membership' element={<Membership/>}/>
      <Route path='/about' element={<AboutUs/>}/>
      <Route path='/success-stories' element={<SuccessStoriesPage/>}/>
      <Route path='/contact' element={<ContactUs/>}/>
      <Route path='/schedule-call' element={<ScheduleCall/>}/>
     <Route path='/browse-profile' element={<BrowseProfiles />}/>
     <Route path="/browse-profile/:id" element={<ProfileDetails />} />
     <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/profile-create' element={<CreateProfile mode="create" />}/>
      <Route path="/update-profile/:id" element={<CreateProfile mode="update" />} />
        <Route path="/login" element={<Login/>} />
     

    </Routes>

    <Footer/>
    
    
    
    </>
  )
}

export default App
