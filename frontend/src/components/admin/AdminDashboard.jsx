// src/components/admin/AdminDashboard.jsx
import React, { useState } from "react";
import InventoryManager from "./InventoryManager";
import ServiceManager from "./ServiceManager";
import ContactManager from "./ContactManager";
import PortfolioAdmin from "./PortfolioAdmin"; 
import UsersPage from "./UsersPage";
import AdminsPage from "./AdminsPage";
import OrdersPage from "./OrdersPage";
import EnquiriesPage from "./EnquiriesPage"; // ✅ Import EnquiriesPage

import { useAuth } from "../../context/AuthContext";
import { FaBox, FaTools, FaEnvelope, FaImage, FaBars, FaQuestionCircle } from "react-icons/fa";

// ✅ Add enquiries to tabs
const tabs = [
  { id: "products", label: "Products", icon: <FaBox /> },
  { id: "services", label: "Services", icon: <FaTools /> },
  { id: "contacts", label: "Contacts", icon: <FaEnvelope /> },
  { id: "enquiries", label: "Enquiries", icon: <FaQuestionCircle /> }, // ✅ New tab
  { id: "portfolio", label: "Portfolio", icon: <FaImage /> },
  { id: "users", label: "Users", icon: null },
  { id: "admins", label: "Admins", icon: null },
  { id: "orders", label: "Orders", icon: null },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { admin } = useAuth();

  const renderTabContent = () => {
    switch (activeTab) {
      case "products":
        return <InventoryManager />;
      case "services":
        return <ServiceManager />;
      case "contacts":
        return <ContactManager />;
      case "enquiries": // ✅ Render enquiries page
        return <EnquiriesPage />;
      case "portfolio":
        return <PortfolioAdmin />;
      case "users":
        return <UsersPage />;
      case "admins":
        return <AdminsPage />;
      case "orders":
        return <OrdersPage />;
      default:
        return <p>Select a tab</p>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 p-4 transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className={`text-2xl font-bold text-red-500 ${!sidebarOpen && "hidden"}`}>
            Admin
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300 hover:text-white"
          >
            <FaBars />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600 transition ${
                activeTab === tab.id ? "bg-red-600" : "bg-gray-700"
              }`}
            >
              {tab.icon} {sidebarOpen && tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-red-500">
          Admin Dashboard: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </h1>
        {renderTabContent()}
      </div>
    </div>
  );
}
