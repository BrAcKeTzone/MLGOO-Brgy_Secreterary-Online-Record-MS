import React, { useState, useEffect } from "react";
import {
  FaFileAlt,
  FaBuilding,
  FaShieldAlt,
  FaGavel,
  FaIdCard,
} from "react-icons/fa";
import ReportTypesPanel from "../components/SettingsComp/ReportTypesPanel";
import BarangaysPanel from "../components/SettingsComp/BarangaysPanel";
import PrivacyPanel from "../components/SettingsComp/PrivacyPanel";
import TermsPanel from "../components/SettingsComp/TermsPanel";
import ValidIDTypesPanel from "../components/SettingsComp/ValidIDTypesPanel";
import LoadingScreen from "../components/Common/LoadingScreen";
import ErrorScreen from "../components/Common/ErrorScreen";
import useSettingsStore from "../store/settingsStore";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const [initLoading, setInitLoading] = useState(true);
  const {
    reportTypes,
    barangays,
    privacyPolicy,
    termsOfService,
    validIDTypes,
    loading,
    error,
    initialize,
  } = useSettingsStore();

  useEffect(() => {
    const loadSettings = async () => {
      setInitLoading(true);
      try {
        await initialize();
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setInitLoading(false);
      }
    };
    loadSettings();
  }, [initialize]);

  const tabs = [
    { id: "reports", name: "Report Types", icon: FaFileAlt },
    { id: "barangays", name: "Barangays", icon: FaBuilding },
    { id: "validIDs", name: "Valid ID Types", icon: FaIdCard },
    { id: "privacy", name: "Privacy Policy", icon: FaShieldAlt },
    { id: "terms", name: "Terms of Service", icon: FaGavel },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "reports":
        return (
          <ReportTypesPanel
            reportTypes={reportTypes}
            useSettingsStore={useSettingsStore}
          />
        );
      case "barangays":
        return (
          <BarangaysPanel
            barangays={barangays}
            useSettingsStore={useSettingsStore}
          />
        );
      case "validIDs":
        return (
          <ValidIDTypesPanel
            validIDTypes={validIDTypes}
            useSettingsStore={useSettingsStore}
          />
        );
      case "privacy":
        return (
          <PrivacyPanel
            privacyPolicy={privacyPolicy}
            useSettingsStore={useSettingsStore}
          />
        );
      case "terms":
        return (
          <TermsPanel
            termsOfService={termsOfService}
            useSettingsStore={useSettingsStore}
          />
        );
      default:
        return null;
    }
  };

  // Only show loading screen during initial load
  if (initLoading) {
    return <LoadingScreen message="Loading settings..." />;
  }

  if (error) {
    return <ErrorScreen error={error} retryAction={initialize} />;
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
            <div className="bg-white rounded-lg shadow p-6 relative">
              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 z-10 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-b-blue-700 border-gray-200"></div>
                </div>
              )}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
