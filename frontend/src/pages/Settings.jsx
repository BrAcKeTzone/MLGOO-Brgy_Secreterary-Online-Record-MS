import React, { useState, useEffect } from "react";
import { FaFileAlt, FaBuilding, FaShieldAlt, FaGavel } from "react-icons/fa";
import ReportTypesPanel from "../components/SettingsComp/ReportTypesPanel";
import BarangaysPanel from "../components/SettingsComp/BarangaysPanel";
import PrivacyPanel from "../components/SettingsComp/PrivacyPanel";
import TermsPanel from "../components/SettingsComp/TermsPanel";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import useSettingsStore from "../store/settingsStore";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const {
    reportTypes,
    barangays,
    privacyPolicy,
    termsOfService,
    loading,
    error,
    updateReportType,
    updateBarangay,
    updatePrivacyPolicy,
    updateTermsOfService,
    initialize,
  } = useSettingsStore();

  useEffect(() => {
    const loadSettings = async () => {
      await initialize();
    };
    loadSettings();
  }, [initialize]);

  const tabs = [
    { id: "reports", name: "Report Types", icon: FaFileAlt },
    { id: "barangays", name: "Barangays", icon: FaBuilding },
    { id: "privacy", name: "Privacy Policy", icon: FaShieldAlt },
    { id: "terms", name: "Terms of Service", icon: FaGavel },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "reports":
        return (
          <ReportTypesPanel
            reportTypes={reportTypes}
            onUpdate={updateReportType}
          />
        );
      case "barangays":
        return (
          <BarangaysPanel barangays={barangays} onUpdate={updateBarangay} />
        );
      case "privacy":
        return (
          <PrivacyPanel policy={privacyPolicy} onUpdate={updatePrivacyPolicy} />
        );
      case "terms":
        return (
          <TermsPanel terms={termsOfService} onUpdate={updateTermsOfService} />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading settings..." />;
  }
  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="bg-white rounded-lg shadow p-4">
            <nav className="flex flex-col space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
