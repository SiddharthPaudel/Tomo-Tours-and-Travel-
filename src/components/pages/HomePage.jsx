import React from 'react'
import Navbar from '../layouts/Header'
import Hero from '../HeroSection/Hero'
import AboutUs from '../AboutUs/AboutUs'
import ContactPage from '../Contact/Contact'
import Footer from '../layouts/Footer'
import BlogSection from '../Blog/Blog'
import HomePackages from '../Package/HomePackage'
import OurMission from '../OurMission/OurMission'

const HomePage = () => {
  return (
    <div>
       
        <Hero/>
        <AboutUs/>
        <HomePackages/>
        <OurMission/>
        <ContactPage/>
        <BlogSection/>
        
      
    </div>
  )
}

export default HomePage
