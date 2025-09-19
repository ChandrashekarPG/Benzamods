import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

// Context
import { AuthProvider } from "./context/AuthContext";

// Existing components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroBanner from "./components/HeroBanner";
import QuickNavigation from "./components/QuickNavigation";
import ClientCarousel from "./components/ClientCarousel";
import AboutUs from "./components/AboutUs";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import MapComponent from "./components/MapComponent";

import AdminDashboard from "./components/admin/AdminDashboard";
// New components
import CarMods from "./components/CarMods";
import BikeMods from "./components/BikeMods";
import ProductDetail from "./components/ProductDetail";
import PortfolioGrid from "./components/PortfolioGrid";
import PortfolioDetail from "./components/PortfolioDetail";
import PopularServices from "./components/PopularServices";
import PortfolioPage from "./components/PortfolioPage";
import LoginModal from "./components/LoginModal";
import MyCart from "./components/MyCart";
import EnquiryForm from "./components/EnquiryForm";
import ProfilePage from "./components/ProfilePage";






// -------------------- HomePage Component --------------------
const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <HeroBanner />
      <QuickNavigation />
      <ClientCarousel />
      <AboutUs />
      <Gallery />
      <Contact />
      <MapComponent />
    </div>
  );
};

// -------------------- Layout Wrapper --------------------
function Layout({ children }) {
  const location = useLocation();

  // Only hide header/footer for admin routes
  const hideHeaderFooter = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        {/* General SEO Meta Tags */}
        <title>BenzaMods - Car & Bike Mods, Services, Portfolio</title>
        <meta
          name="description"
          content="BenzaMods offers high-quality car and bike modifications, tuning, and services for enthusiasts, dealerships, and workshops."
        />
        <meta
          name="keywords"
          content="car mods, bike mods, car tuning, bike tuning, car enthusiasts, bike enthusiasts, dealership services, workshop services, garages, BenzaMods"
        />
        <meta name="author" content="BenzaMods" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Social Sharing */}
        <meta property="og:title" content="BenzaMods - Car & Bike Mods" />
        <meta
          property="og:description"
          content="Professional car and bike modifications, tuning, and services for enthusiasts, dealerships, and workshops."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.benzamods.com" />
        <meta property="og:image" content="https://www.benzamods.com/og-image.jpg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="BenzaMods - Car & Bike Mods" />
        <meta
          name="twitter:description"
          content="Professional car and bike modifications, tuning, and services for enthusiasts, dealerships, and workshops."
        />
        <meta name="twitter:image" content="https://www.benzamods.com/og-image.jpg" />
      </Helmet>

      {!hideHeaderFooter && <Navbar />}
      <div className="flex-grow">{children}</div>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

// -------------------- App Component --------------------
function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Home page */}
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />

             {/* ================== ADMIN ROUTES ================== */}
        <Route path="/admin" element={<AdminDashboard />} />

        
            {/* Services */}
            <Route path="/services" element={<PopularServices />} />

            {/* Portfolio Routes */}
            <Route path="/portfolio" element={<PortfolioGrid />} />
            <Route path="/portfolio/:id" element={<PortfolioDetail />} />
            <Route path="/reviews" element={<PortfolioPage />} />

            {/* Car Mods */}
            <Route path="/car-mods" element={<CarMods />} />
            <Route path="/cars/:id" element={<ProductDetail />} />

            {/* Bike Mods */}
            <Route path="/bike-mods" element={<BikeMods />} />
            <Route path="/bikes/:id" element={<ProductDetail />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            {/* My Cart */}
            <Route path="/cart" element={<MyCart />} />

            {/* Enquiry */}
            <Route path="/enquiry" element={<EnquiryForm />} />

            {/* Profile */}
            <Route path="/profile" element={<ProfilePage />} /> 

            {/* Login Modal (if direct route needed) */}
            <Route path="/login" element={<LoginModal />} />

            {/* Catch-all */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
