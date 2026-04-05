import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import "./App.css";

// Import Your Components
import Navbar from "./components/layouts/Header";
import Footer from './components/layouts/Footer';
import HomePage from "./components/pages/HomePage";
import AboutUs from "./components/AboutUs/AboutUs";
import BlogSection from "./components/Blog/Blog";
import ContactPage from "./components/Contact/Contact";
import Gallery from './components/Gallery/Gallery';
import VisaInfo from './components/VisaInfo/VisaInfo';
import TrekActivity from './components/Activites/TrekActivity';
import Hiking from './components/Activites/Hiking';
import RaftingActivity from './components/Activites/Rafting';
import SightSeeing from './components/Activites/SightSeeing';
import International from './components/Destination/International';
import DomesticActivity from './components/Destination/Domestic';
import HomePackages from './components/Package/HomePackage';
import LoginPage from './components/Login/Login';
import SignupPage from './components/SignUp/SignUp';  
import AdminMain from './components/Admin/AdminMain';
import AdminRoute from './components/Admin/AdminRoute';
import { auth } from "./services/firebase" // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth'

import MyProfile from './components/MyProfile/MyProfile';
import { Package } from 'lucide-react';
import PackagePage from './components/Package/Package';

// --- Helper: Scroll to top ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- NEW HELPER: Conditional Layout Wrapper ---
const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  // Check if the current path starts with /admin
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Only show Navbar if NOT an admin page */}
      {!isAdminPage && <Navbar />}
      
      <main className="flex-grow">
        {children}
      </main>

      {/* Only show Footer if NOT an admin page */}
      {!isAdminPage && <Footer />}
    </div>
  );
};

const App = () => {

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If user is null and we are currently on an admin path, force go home
      if (!user && window.location.pathname.startsWith('/admin')) {
        window.location.href = '/'; 
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <Router>
      <ScrollToTop />
      <LayoutWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blogs" element={<BlogSection />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path='/gallery' element={<Gallery/>}/>
          <Route path='/visa-info' element={<VisaInfo/>}/>
          <Route path='/activities/trek' element={<TrekActivity/>}/>
          <Route path='/activities/hiking' element={<Hiking/>}/>
          <Route path='/activities/rafting' element={<RaftingActivity/>}/>
          <Route path='/activities/sightseeing' element={<SightSeeing/>}/>
          <Route path="/activities/sightseeing/:id" element={<SightSeeing />} />
          <Route path='/destinations/international' element={<International />} />
          <Route path='/destinations/international/:id' element={<International />} />
          <Route path='/destinations/domestic/:id' element={<DomesticActivity />} />
          <Route path='/destinations/domestic' element={<DomesticActivity />} />
          <Route path='/packages' element={<HomePackages />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path='/packagepage' element={<PackagePage />} />  

          {/* Admin Routes - AdminMain handles its own sub-views (Dashboard, Users, etc.) */}
          <Route path="/admin/*" element={
    <AdminRoute>
      <AdminMain />
    </AdminRoute>
  } />

          {/* 404 Page */}
          <Route path="*" element={
            <div className="py-40 text-center font-poppins">
              <h1 className="text-8xl font-black text-slate-100">404</h1>
              <p className="text-xl font-bold text-slate-800 uppercase tracking-widest mt-[-2rem]">Trail Lost</p>
              <a href="/" className="mt-8 inline-block px-8 py-3 bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest rounded-full">Return Home</a>
            </div>
          } />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
};

export default App;