import React from 'react'
import Hero from '../Components/Home/Hero'
import WhyChooseUs from '../Components/Home/WhyChooseUs'
import HowItWorks from '../Components/Home/HowItWorks'
import SuccessStories from '../Components/Home/SuccessStories'
import CallToAction from '../Components/Home/CallToAction'

import { Helmet } from "react-helmet-async";



const Home = () => {
  return (
    <>
    <Hero/>
    <WhyChooseUs/>
    <HowItWorks/>
    <SuccessStories/>
    <CallToAction/>
    </>
  )
}

export default Home