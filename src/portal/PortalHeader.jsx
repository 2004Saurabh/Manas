import React, { useState } from "react";
import {
  Shield,
  User,
  MapPin,
  Clock,
  Bell,
  LogOut,
  ArrowLeft,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Briefcase,
} from "lucide-react";

export default function PortalHeader({
  currentUser,
  onSwitchUser,
  employees,
  activeCheckIn,
  onQuickPunch,
  onNavigateHome,
  onLogout,
  notifications = [],
}) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const roleColors = {
    Administrator: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    Manager: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "Field Employee": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Brand Identity & Back Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onNavigateHome}
            title="Return to Public Website"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Website</span>
          </button>

          <div className="h-5 w-px bg-white/10" />

          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md">
              MA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold tracking-wider text-white">
                  MANAS PORTAL
                </span>
                <span className="hidden rounded-md bg-accent/20 px-1.5 py-0.5 text-[10px] font-semibold text-accent sm:inline">
                  v1.0 Field CRM
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                GPS Attendance & Client Management
              </p>
            </div>
          </div>
        </div>

        {/* Center: Live GPS Status Badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <MapPin className="h-3.5 w-3.5" />
          <span>Indore HQ Geofence Active (250m)</span>
        </div>

        {/* Right Controls: Quick Punch, Notifications, User Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Quick Check-In / Check-Out Pill */}
          <button
            type="button"
            onClick={onQuickPunch}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold shadow-md transition-all ${
              activeCheckIn
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30"
                : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/30"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{activeCheckIn ? "Check Out Shift" : "Quick Check In"}</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowRoleMenu(false);
              }}
              className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white transition"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#12131a] p-3 shadow-2xl backdrop-blur-2xl z-50">
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                  <span className="text-xs font-semibold text-white">System Notifications</span>
                  <span className="text-[10px] text-muted-foreground">{notifications.length} alerts</span>
                </div>
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="rounded-xl border border-white/5 bg-white/[0.03] p-2.5 text-left transition hover:bg-white/[0.07]"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-medium text-white">
                        {n.type === "approval" ? (
                          <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                        )}
                        <span>{n.title}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                        {n.message}
                      </p>
                      <span className="mt-1 block text-[9px] text-white/40">
                        {n.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User / Role Switcher Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-left transition hover:bg-white/10"
            >
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/20 text-xs font-bold text-primary">
                {currentUser.avatar}
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {currentUser.role}
                </div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#12131a] p-2.5 shadow-2xl backdrop-blur-2xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Switch Active Role (Testing)
                </div>
                <div className="mt-1 flex flex-col gap-1">
                  {employees.map((emp) => {
                    const isSelected = emp.id === currentUser.id;
                    return (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => {
                          onSwitchUser(emp);
                          setShowRoleMenu(false);
                        }}
                        className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition ${
                          isSelected
                            ? "bg-primary/20 text-white font-medium border border-primary/30"
                            : "text-muted-foreground hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="grid h-6 w-6 place-items-center rounded bg-white/10 text-[10px] font-bold text-white">
                            {emp.avatar}
                          </span>
                          <div>
                            <div className="font-semibold text-white">{emp.name}</div>
                            <div className="text-[10px] text-muted-foreground">{emp.title}</div>
                          </div>
                        </div>
                        <span
                          className={`rounded-md border px-1.5 py-0.5 text-[9px] font-semibold ${
                            roleColors[emp.role] || "bg-white/10"
                          }`}
                        >
                          {emp.role}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold text-red-400 hover:bg-red-500/10 transition cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out from Workspace</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Sign Out Action */}
          <button
            type="button"
            onClick={onLogout}
            title="Sign Out"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
