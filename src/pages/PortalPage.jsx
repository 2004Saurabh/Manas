import React, { useState, useEffect } from "react";
import PortalHeader from "../portal/PortalHeader";
import PortalLoginPage from "../portal/PortalLoginPage";
import EmployeeDashboardTab from "../portal/tabs/EmployeeDashboardTab";
import GpsAttendanceTab from "../portal/tabs/GpsAttendanceTab";
import ClientVisitFormTab from "../portal/tabs/ClientVisitFormTab";
import QuotationBuilderTab from "../portal/tabs/QuotationBuilderTab";
import ClientCrmTab from "../portal/tabs/ClientCrmTab";
import GpsMapViewTab from "../portal/tabs/GpsMapViewTab";
import AdminAnalyticsTab from "../portal/tabs/AdminAnalyticsTab";
import SrsComplianceTab from "../portal/tabs/SrsComplianceTab";
import {
  getPortalData,
  savePortalData,
  calculateDistanceMeters,
  getSessionUser,
  setSessionUser,
  clearSessionUser,
} from "../portal/portalData";
import {
  LayoutDashboard,
  Compass,
  MapPin,
  FileText,
  Users,
  Map as MapIcon,
  BarChart3,
  CheckCircle,
  CheckCircle2,
} from "lucide-react";

export default function PortalPage({ navigate }) {
  const [portalData, setPortalData] = useState(() => getPortalData());
  const [currentUser, setCurrentUser] = useState(() => getSessionUser());
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toastMessage, setToastMessage] = useState("");

  const handleLoginSuccess = (user, remember) => {
    setCurrentUser(user);
    if (remember) {
      setSessionUser(user);
    }
    showToast(`Welcome back, ${user.name}! (${user.role} active)`);
  };

  const handleLogout = () => {
    clearSessionUser();
    setCurrentUser(null);
    showToast("You have been logged out of your session.");
  };

  // Check if current user has an active checked-in shift today
  const todayStr = new Date().toISOString().slice(0, 10);
  const activeCheckIn = currentUser
    ? portalData.attendance.find(
        (a) =>
          a.employeeId === currentUser.id &&
          a.date === todayStr &&
          !a.checkOutTime
      )
    : null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Sync state to LocalStorage
  const updateStore = (updater) => {
    setPortalData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      savePortalData(next);
      return next;
    });
  };

  // Handle Switch Active User (while inside portal)
  const handleSwitchUser = (emp) => {
    setCurrentUser(emp);
    setSessionUser(emp);
    showToast(`Switched active workspace to ${emp.name} (${emp.role})`);
  };

  // Check In Handler
  const handleCheckIn = (coords) => {
    const timeStr = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newRecord = {
      id: `ATT-2026-${String(portalData.attendance.length + 1).padStart(3, "0")}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      date: todayStr,
      shift: "General Shift (09:30 AM - 06:30 PM)",
      checkInTime: timeStr,
      checkInCoords: coords,
      checkOutTime: null,
      status: "Present",
      workDurationHours: null,
      notes: "Standard daily punch recorded with GPS.",
    };

    updateStore((prev) => ({
      ...prev,
      attendance: [newRecord, ...prev.attendance],
      notifications: [
        {
          id: `NOTIF-${Date.now()}`,
          title: "Attendance Check-In Logged",
          message: `${currentUser.name} punched in at ${coords.address} (±${coords.accuracy}m).`,
          type: "gps",
          targetRole: "Administrator",
          timestamp: "Just now",
          read: false,
        },
        ...prev.notifications,
      ],
    }));

    showToast(`✓ Checked in successfully at ${coords.category} location!`);
  };

  // Check Out Handler
  const handleCheckOut = () => {
    const timeStr = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    updateStore((prev) => ({
      ...prev,
      attendance: prev.attendance.map((rec) => {
        if (
          rec.employeeId === currentUser.id &&
          rec.date === todayStr &&
          !rec.checkOutTime
        ) {
          return {
            ...rec,
            checkOutTime: timeStr,
            status: "Completed",
            workDurationHours: 8.5,
          };
        }
        return rec;
      }),
    }));

    showToast(`✓ Shift ended. Check-out recorded at ${timeStr}.`);
  };

  // Save Client Visit
  const handleSaveVisit = (visitPayload, clientOptions) => {
    updateStore((prev) => {
      let updatedClients = prev.clients;
      if (clientOptions?.isNew && clientOptions.newClientData) {
        updatedClients = [clientOptions.newClientData, ...prev.clients];
      }

      return {
        ...prev,
        clients: updatedClients,
        visits: [visitPayload, ...prev.visits],
        notifications: [
          {
            id: `NOTIF-${Date.now()}`,
            title: `New Visit Logged (${visitPayload.clientName})`,
            message: `${currentUser.name} completed site visit: ${visitPayload.purpose}. Outcome: ${visitPayload.outcome}.`,
            type: "gps",
            targetRole: "Manager",
            timestamp: "Just now",
            read: false,
          },
          ...prev.notifications,
        ],
      };
    });

    showToast(`✓ Field visit ${visitPayload.id} logged with GPS coordinates!`);
  };

  // Save Quotation
  const handleSaveQuotation = (quotePayload) => {
    updateStore((prev) => ({
      ...prev,
      quotations: [quotePayload, ...prev.quotations],
      clients: prev.clients.map((c) => {
        if (c.id === quotePayload.clientId) {
          return {
            ...c,
            stage: "Quote Sent",
            totalQuoted: (c.totalQuoted || 0) + quotePayload.grandTotal,
          };
        }
        return c;
      }),
      notifications: [
        {
          id: `NOTIF-${Date.now()}`,
          title: `Quotation ${quotePayload.id} Created`,
          message: `${quotePayload.id} for ${quotePayload.clientName} created by ${currentUser.name}. Status: ${quotePayload.status}.`,
          type: "approval",
          targetRole: "Manager",
          timestamp: "Just now",
          read: false,
        },
        ...prev.notifications,
      ],
    }));

    showToast(`✓ Quotation ${quotePayload.id} generated!`);
  };

  // Update Quotation Status
  const handleUpdateQuoteStatus = (quoteId, newStatus, comment) => {
    updateStore((prev) => ({
      ...prev,
      quotations: prev.quotations.map((q) => {
        if (q.id === quoteId) {
          return {
            ...q,
            status: newStatus,
            approvedBy:
              newStatus === "Approved"
                ? `${currentUser.name} (${currentUser.role})`
                : q.approvedBy,
          };
        }
        return q;
      }),
    }));

    showToast(`✓ Quote ${quoteId} updated to "${newStatus}"`);
  };

  // Add Client
  const handleAddClient = (clientPayload) => {
    updateStore((prev) => ({
      ...prev,
      clients: [clientPayload, ...prev.clients],
    }));
    showToast(`✓ Client profile "${clientPayload.name}" created!`);
  };

  // Update Client Stage
  const handleUpdateClientStage = (clientId, newStage) => {
    updateStore((prev) => ({
      ...prev,
      clients: prev.clients.map((c) =>
        c.id === clientId ? { ...c, stage: newStage } : c
      ),
    }));
    showToast(`✓ Client moved to "${newStage}"`);
  };

  // Update Geofence
  const handleUpdateGeofence = (newGeofence) => {
    updateStore((prev) => ({
      ...prev,
      geofence: newGeofence,
    }));
    showToast(`✓ Office Geofence updated (${newGeofence.radiusMeters}m radius)`);
  };

  // Toggle Employee Active State
  const handleToggleEmployeeActive = (empId) => {
    updateStore((prev) => ({
      ...prev,
      employees: prev.employees.map((e) =>
        e.id === empId ? { ...e, active: !e.active } : e
      ),
    }));
  };

  // If not logged in, show dedicated Portal Login Page
  if (!currentUser) {
    return (
      <PortalLoginPage
        employees={portalData.employees}
        onLoginSuccess={handleLoginSuccess}
        onNavigateHome={() => navigate("/")}
      />
    );
  }

  // Role-based visible tabs: Field Employees only see field operations
  const allTabs = [
    { id: "dashboard", label: "My Workspace", icon: LayoutDashboard },
    { id: "attendance", label: "GPS Attendance", icon: Compass },
    { id: "visits", label: "Client Visits", icon: MapPin },
    { id: "quotations", label: "Quotations", icon: FileText },
    { id: "clients", label: "Client CRM", icon: Users },
    { id: "map", label: "Field Map View", icon: MapIcon },
    { id: "admin", label: "Management & Admin", icon: BarChart3 },
    { id: "srs", label: "Delivery & SRS Scope", icon: CheckCircle2 },
  ];

  const visibleTabs =
    currentUser.role === "Field Employee"
      ? allTabs.filter((t) => t.id !== "admin")
      : allTabs;

  return (
    <div className="min-h-screen bg-[#090a0f] text-foreground flex flex-col justify-between selection:bg-primary/40 selection:text-white">
      {/* Top Header */}
      <PortalHeader
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        employees={portalData.employees}
        activeCheckIn={activeCheckIn}
        onLogout={handleLogout}
        onQuickPunch={() => {
          if (activeCheckIn) {
            handleCheckOut();
          } else {
            setActiveTab("attendance");
          }
        }}
        onNavigateHome={() => navigate("/")}
        notifications={portalData.notifications}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-[#12131a] p-1.5 mb-6 scrollbar-none">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Views */}
        {activeTab === "dashboard" && (
          <EmployeeDashboardTab
            currentUser={currentUser}
            portalData={portalData}
            activeCheckIn={activeCheckIn}
            onOpenCheckInModal={() => {
              if (activeCheckIn) {
                handleCheckOut();
              } else {
                setActiveTab("attendance");
              }
            }}
            onOpenVisitModal={() => setActiveTab("visits")}
            onOpenQuoteModal={() => setActiveTab("quotations")}
            onSwitchTab={setActiveTab}
          />
        )}

        {activeTab === "attendance" && (
          <GpsAttendanceTab
            currentUser={currentUser}
            portalData={portalData}
            activeCheckIn={activeCheckIn}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        )}

        {activeTab === "visits" && (
          <ClientVisitFormTab
            currentUser={currentUser}
            portalData={portalData}
            onSaveVisit={handleSaveVisit}
            onOpenQuoteModalWithVisit={(visit) => {
              setActiveTab("quotations");
            }}
          />
        )}

        {activeTab === "quotations" && (
          <QuotationBuilderTab
            currentUser={currentUser}
            portalData={portalData}
            onSaveQuotation={handleSaveQuotation}
            onUpdateQuoteStatus={handleUpdateQuoteStatus}
          />
        )}

        {activeTab === "clients" && (
          <ClientCrmTab
            currentUser={currentUser}
            portalData={portalData}
            onAddClient={handleAddClient}
            onUpdateClientStage={handleUpdateClientStage}
            onSelectClientForVisit={() => setActiveTab("visits")}
          />
        )}

        {activeTab === "map" && <GpsMapViewTab portalData={portalData} />}

        {activeTab === "admin" && (
          <AdminAnalyticsTab
            currentUser={currentUser}
            portalData={portalData}
            onUpdateGeofence={handleUpdateGeofence}
            onUpdateQuoteStatus={handleUpdateQuoteStatus}
            onToggleEmployeeActive={handleToggleEmployeeActive}
            onSwitchTab={setActiveTab}
          />
        )}

        {activeTab === "srs" && (
          <SrsComplianceTab
            currentUser={currentUser}
            portalData={portalData}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>

      {/* Toast Alert Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-2xl border border-primary/40 bg-[#12131a] px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
