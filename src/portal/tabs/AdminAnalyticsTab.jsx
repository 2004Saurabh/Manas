import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Download,
  Settings,
  Shield,
  Briefcase,
  ToggleLeft,
  ToggleRight,
  Save,
  ArrowRight,
} from "lucide-react";
import { formatINR, exportToCsv } from "../portalData";

export default function AdminAnalyticsTab({
  currentUser,
  portalData,
  onUpdateGeofence,
  onUpdateQuoteStatus,
  onToggleEmployeeActive,
  onSwitchTab,
}) {
  const [geofenceLat, setGeofenceLat] = useState(portalData.geofence.lat);
  const [geofenceLng, setGeofenceLng] = useState(portalData.geofence.lng);
  const [geofenceRadius, setGeofenceRadius] = useState(
    portalData.geofence.radiusMeters
  );
  const [geofenceSavedMessage, setGeofenceSavedMessage] = useState(false);

  // Compute 10 Core Metrics from PDF Section 7
  const totalStaff = portalData.employees.length;
  const attendanceToday = portalData.attendance.filter(
    (a) => a.date === new Date().toISOString().slice(0, 10)
  ).length;
  const fieldCheckIns = portalData.attendance.filter(
    (a) => a.checkInCoords?.category === "Field"
  ).length;
  const visitsToday = portalData.visits.filter(
    (v) => v.date === new Date().toISOString().slice(0, 10)
  ).length;
  const newLeads = portalData.clients.filter((c) => c.stage === "New").length;
  const totalQuotations = portalData.quotations.length;
  const totalQuotedValue = portalData.quotations.reduce(
    (acc, q) => acc + (q.grandTotal || 0),
    0
  );
  const confirmedOrders = portalData.quotations.filter(
    (q) => q.status === "Order Confirmed"
  ).length;
  const pendingApprovals = portalData.quotations.filter(
    (q) => q.status === "Pending Approval"
  ).length;
  const upcomingFollowups = portalData.visits.filter(
    (v) => v.followUpDate
  ).length;

  const handleSaveGeofence = (e) => {
    e.preventDefault();
    onUpdateGeofence({
      ...portalData.geofence,
      lat: Number(geofenceLat),
      lng: Number(geofenceLng),
      radiusMeters: Number(geofenceRadius),
    });
    setGeofenceSavedMessage(true);
    setTimeout(() => setGeofenceSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 10 Overview KPI Cards (Section 7) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            <span>Total Staff</span>
            <Users className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalStaff}</div>
          <span className="text-[10px] text-emerald-400">All registered active</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            <span>Attendance Today</span>
            <Clock className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{attendanceToday}</div>
          <span className="text-[10px] text-muted-foreground">Checked-in shifts</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            <span>Field Check-ins</span>
            <MapPin className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{fieldCheckIns}</div>
          <span className="text-[10px] text-blue-300">Verified GPS site punches</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            <span>Visits Today</span>
            <Briefcase className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{visitsToday}</div>
          <span className="text-[10px] text-purple-300">Client site meetings</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            <span>New Leads</span>
            <TrendingUp className="h-3.5 w-3.5 text-accent" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{newLeads}</div>
          <span className="text-[10px] text-accent">Active opportunities</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            <span>Total Quotations</span>
            <FileText className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{totalQuotations}</div>
          <span className="text-[10px] text-muted-foreground">Generated quotes</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            <span>Quoted Pipeline</span>
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white font-mono truncate">
            {formatINR(totalQuotedValue)}
          </div>
          <span className="text-[10px] text-emerald-400">Total estimated value</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            <span>Confirmed Orders</span>
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{confirmedOrders}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Orders Won</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            <span>Pending Approvals</span>
            <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{pendingApprovals}</div>
          <span className="text-[10px] text-amber-300">Requires manager review</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <div className="flex items-center justify-between text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            <span>Follow-Ups Due</span>
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white">{upcomingFollowups}</div>
          <span className="text-[10px] text-indigo-300">Scheduled client tasks</span>
        </div>
      </div>

      {/* SRS Compliance & Delivery Matrix Callout (Sections 13, 14, 15 & 16) */}
      <div className="rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-[#12131a] to-emerald-500/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold">
              ✓ Phase 1 & 2 Live (100%)
            </span>
            <span className="text-xs font-bold text-white">
              SRS Delivery Phases & Acceptance Checklist Matrix
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            View Sections 13 (Phases), 14 (Acceptance Criteria), 15 (Deliverables), and 16 (Business Decisions) with live audit tests.
          </p>
        </div>

        {onSwitchTab && (
          <button
            type="button"
            onClick={() => onSwitchTab("srs")}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <span>Open Delivery & SRS Scope</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Quotation Approvals Queue Section */}
      <div className="rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <span>Quotation Authorization & Approval Queue</span>
            </h3>
            <p className="text-xs text-muted-foreground">
              Manager / Administrator review hierarchy before quotation is shared with clients
            </p>
          </div>
          <span className="rounded-full bg-amber-500/20 text-amber-300 px-3 py-1 text-xs font-bold border border-amber-500/30">
            {pendingApprovals} Pending Review
          </span>
        </div>

        <div className="space-y-3">
          {portalData.quotations
            .filter((q) => q.status === "Pending Approval")
            .map((quote) => (
              <div
                key={quote.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-white">{quote.id}</span>
                    <span className="text-xs font-bold text-primary">{quote.clientName}</span>
                    <span className="text-[10px] text-muted-foreground">({quote.contactPerson})</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Prepared by: <strong className="text-white">{quote.employeeName}</strong> ·{" "}
                    {quote.items?.length || 1} line items · Discount: {quote.discountPercent}%
                  </div>
                  <div className="mt-1 font-mono font-bold text-sm text-emerald-400">
                    Grand Total: {formatINR(quote.grandTotal)}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuoteStatus(
                        quote.id,
                        "Draft",
                        `Returned for edits by ${currentUser.name}`
                      )
                    }
                    className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-white/5 hover:text-white"
                  >
                    Return for Edits
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuoteStatus(
                        quote.id,
                        "Approved",
                        `Approved by ${currentUser.name}`
                      )
                    }
                    className="rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-emerald-500 transition cursor-pointer"
                  >
                    Approve Quotation
                  </button>
                </div>
              </div>
            ))}

          {pendingApprovals === 0 && (
            <p className="py-6 text-center text-xs text-muted-foreground">
              ✓ All submitted quotations have been reviewed and approved!
            </p>
          )}
        </div>
      </div>

      {/* Geofence Configuration & Employee Directory Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Office Geofence Config Form */}
        <div className="rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              <span>Office Geofence Settings</span>
            </h3>
            <span className="text-xs text-muted-foreground">Admin Only</span>
          </div>

          <form onSubmit={handleSaveGeofence} className="space-y-3.5 text-xs">
            <div>
              <label className="text-muted-foreground block mb-1">Office Name</label>
              <input
                type="text"
                disabled
                value={portalData.geofence.officeName}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white/70"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-muted-foreground block mb-1">Center Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={geofenceLat}
                  onChange={(e) => setGeofenceLat(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white font-mono focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-muted-foreground block mb-1">Center Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={geofenceLng}
                  onChange={(e) => setGeofenceLng(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white font-mono focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-muted-foreground mb-1">
                <span>Geofence Boundary Radius:</span>
                <span className="text-emerald-400 font-bold">{geofenceRadius} meters</span>
              </div>
              <input
                type="range"
                min={50}
                max={1000}
                step={25}
                value={geofenceRadius}
                onChange={(e) => setGeofenceRadius(e.target.value)}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {geofenceSavedMessage && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-300 text-center font-semibold">
                ✓ Office Geofence configuration updated successfully!
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Geofence Parameters</span>
            </button>
          </form>
        </div>

        {/* Staff Directory & Role Access */}
        <div className="rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>Employee Directory & Access Control</span>
              </h3>
              <span className="text-xs text-muted-foreground">
                {portalData.employees.length} Users
              </span>
            </div>

            <div className="space-y-2.5">
              {portalData.employees.map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 font-bold text-white text-xs">
                      {emp.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white">{emp.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {emp.title} · {emp.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {emp.role}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleEmployeeActive(emp.id)}
                      className="text-xs cursor-pointer"
                      title={emp.active ? "Deactivate user" : "Activate user"}
                    >
                      {emp.active ? (
                        <ToggleRight className="h-6 w-6 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Center */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => exportToCsv(portalData.attendance, "Manas_Attendance")}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 text-[11px] font-semibold text-white hover:bg-white/10 flex items-center justify-center gap-1.5"
            >
              <Download className="h-3 w-3 text-primary" />
              <span>Attendance CSV</span>
            </button>
            <button
              type="button"
              onClick={() => exportToCsv(portalData.visits, "Manas_Client_Visits")}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 text-[11px] font-semibold text-white hover:bg-white/10 flex items-center justify-center gap-1.5"
            >
              <Download className="h-3 w-3 text-accent" />
              <span>Visits CSV</span>
            </button>
            <button
              type="button"
              onClick={() => exportToCsv(portalData.quotations, "Manas_Quotations")}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2 text-[11px] font-semibold text-white hover:bg-white/10 flex items-center justify-center gap-1.5"
            >
              <Download className="h-3 w-3 text-purple-400" />
              <span>Quotations CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
