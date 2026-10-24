import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  PlusCircle,
  FileText,
  UserCheck,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Phone,
  Briefcase,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { formatINR } from "../portalData";

export default function EmployeeDashboardTab({
  currentUser,
  portalData,
  activeCheckIn,
  onOpenCheckInModal,
  onOpenVisitModal,
  onOpenQuoteModal,
  onSwitchTab,
}) {
  const userVisits = portalData.visits.filter(
    (v) => v.employeeId === currentUser.id
  );
  const userQuotes = portalData.quotations.filter(
    (q) => q.employeeId === currentUser.id
  );
  const userClients = portalData.clients.filter(
    (c) => c.assignedTo === currentUser.id
  );

  const todayVisits = userVisits.filter(
    (v) => v.date === new Date().toISOString().slice(0, 10)
  );

  const pendingQuotes = userQuotes.filter(
    (q) => q.status === "Pending Approval" || q.status === "Draft"
  );

  return (
    <div className="space-y-6">
      {/* Welcome & Role Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-primary/20 via-background to-accent/10 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{currentUser.role} Workspace</span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
              Hello, {currentUser.name} 👋
            </h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Indore HQ Field Portal · Track your field visits, record GPS attendance, and manage quotes.
            </p>
          </div>

          {/* Quick Date Display */}
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <Calendar className="h-5 w-5 text-accent" />
            <div>
              <div className="text-xs font-bold text-white">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="text-[10px] text-muted-foreground">
                Current Work Shift Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero GPS Punch Card (Mobile-First Priority) */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Check-In / Shift Status Box */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`grid h-10 w-10 place-items-center rounded-2xl ${
                  activeCheckIn
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-white/5 text-muted-foreground"
                }`}
              >
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Today's GPS Attendance Status
                </h3>
                <p className="text-xs text-muted-foreground">
                  {activeCheckIn
                    ? `Checked In at ${activeCheckIn.checkInTime} (${activeCheckIn.checkInCoords?.category || "Field"})`
                    : "Shift not yet started for today"}
                </p>
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                activeCheckIn
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-white/5 text-muted-foreground border border-white/10"
              }`}
            >
              {activeCheckIn ? "● Shift Active" : "○ Not Checked In"}
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 items-center">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <div className="text-xs text-muted-foreground">Recorded Location:</div>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-white">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">
                  {activeCheckIn?.checkInCoords?.address || "Indore Municipal Area"}
                </span>
              </div>
              {activeCheckIn?.checkInCoords?.accuracy && (
                <div className="mt-2 text-[11px] text-muted-foreground">
                  GPS Accuracy: <span className="text-emerald-400 font-semibold">{activeCheckIn.checkInCoords.accuracy} meters</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onOpenCheckInModal}
                className={`w-full rounded-2xl px-5 py-3.5 text-center text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] cursor-pointer ${
                  activeCheckIn
                    ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30"
                }`}
              >
                {activeCheckIn ? "Check Out Shift (End Day)" : "Tap to Check In (Capture GPS)"}
              </button>
              <p className="text-center text-[10px] text-muted-foreground">
                Automatic Geofence & Server Timestamp Verification
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-white mb-3">
            Quick Actions
          </h3>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onOpenVisitModal}
              className="w-full flex items-center justify-between rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-left text-xs font-semibold text-primary hover:bg-primary/20 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <PlusCircle className="h-4 w-4" />
                <span>Log Client Field Visit</span>
              </div>
              <ChevronRight className="h-4 w-4 text-primary/60" />
            </button>

            <button
              type="button"
              onClick={onOpenQuoteModal}
              className="w-full flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-left text-xs font-semibold text-accent hover:bg-accent/20 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4" />
                <span>Create New Quotation</span>
              </div>
              <ChevronRight className="h-4 w-4 text-accent/60" />
            </button>

            <button
              type="button"
              onClick={() => onSwitchTab("clients")}
              className="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-xs font-semibold text-white hover:bg-white/10 transition cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <UserCheck className="h-4 w-4 text-emerald-400" />
                <span>View Assigned Clients ({userClients.length})</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Today's KPI Counters */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Total Visits Done
          </span>
          <div className="mt-2 text-2xl font-bold text-white">
            {userVisits.length}
          </div>
          <span className="mt-1 block text-[10px] text-emerald-400">
            {todayVisits.length} recorded today
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            My Quotations
          </span>
          <div className="mt-2 text-2xl font-bold text-white">
            {userQuotes.length}
          </div>
          <span className="mt-1 block text-[10px] text-accent">
            {pendingQuotes.length} awaiting approval
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Quoted Pipeline
          </span>
          <div className="mt-2 text-2xl font-bold text-white">
            {formatINR(userQuotes.reduce((acc, q) => acc + (q.grandTotal || 0), 0))}
          </div>
          <span className="mt-1 block text-[10px] text-muted-foreground">
            Active opportunities
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#12131a] p-4 text-left">
          <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Assigned Leads
          </span>
          <div className="mt-2 text-2xl font-bold text-white">
            {userClients.length}
          </div>
          <span className="mt-1 block text-[10px] text-purple-400">
            Active CRM accounts
          </span>
        </div>
      </div>

      {/* Recent Visits & Pending Follow-Ups Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Client Visits */}
        <div className="rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-white">
              Recent Field Visits
            </h3>
            <button
              type="button"
              onClick={() => onSwitchTab("visits")}
              className="text-xs text-primary hover:underline font-medium"
            >
              View All ({portalData.visits.length})
            </button>
          </div>

          <div className="space-y-3">
            {userVisits.slice(0, 3).map((v) => (
              <div
                key={v.id}
                className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 transition hover:bg-white/[0.05]"
              >
                <img
                  src={v.photo || "/assets/van/van-side.jpg"}
                  alt={v.clientName}
                  className="h-14 w-14 rounded-xl object-cover shrink-0 border border-white/10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">
                      {v.clientName}
                    </h4>
                    <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[9px] font-semibold text-primary">
                      {v.outcome}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground truncate">
                    {v.purpose}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-white/50">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {v.date} · {v.time}
                    </span>
                    <a
                      href={v.gps?.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-accent hover:underline flex items-center gap-0.5"
                    >
                      <MapPin className="h-3 w-3" />
                      <span>GPS Pin</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Follow-Ups / Tasks */}
        <div className="rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h3 className="text-sm font-semibold text-white">
              Upcoming Follow-Ups
            </h3>
            <span className="text-xs text-muted-foreground">Action Needed</span>
          </div>

          <div className="space-y-3">
            {userVisits
              .filter((v) => v.followUpDate)
              .slice(0, 3)
              .map((v) => (
                <div
                  key={v.id}
                  className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {v.clientName}
                    </span>
                    <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                      Due: {v.followUpDate}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {v.followUpRemarks || "Follow up on submitted proposal."}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[10px] text-muted-foreground">
                      Linked to {v.id}
                    </span>
                    <button
                      type="button"
                      onClick={onOpenQuoteModal}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      Prepare Quote →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
