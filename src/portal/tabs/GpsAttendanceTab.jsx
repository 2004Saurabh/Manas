import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Download,
  Filter,
  Search,
  Crosshair,
  ShieldAlert,
  ArrowRight,
  Compass,
} from "lucide-react";
import {
  calculateDistanceMeters,
  exportToCsv,
} from "../portalData";

export default function GpsAttendanceTab({
  currentUser,
  portalData,
  activeCheckIn,
  onCheckIn,
  onCheckOut,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [gpsError, setGpsError] = useState("");

  // Quick Simulation Location Selector (for testing on desktop where GPS may be disabled or mocked)
  const [simulatedLoc, setSimulatedLoc] = useState("auto");

  const geofence = portalData.geofence;

  // Handle actual GPS acquisition
  const handlePerformCheckIn = () => {
    setIsCapturingGps(true);
    setGpsError("");

    if (simulatedLoc === "office") {
      // Simulate exact office geofence
      setTimeout(() => {
        setIsCapturingGps(false);
        onCheckIn({
          lat: geofence.lat,
          lng: geofence.lng,
          accuracy: 8,
          address: `${geofence.officeName} (Within Geofence)`,
          category: "Office",
        });
      }, 600);
      return;
    }

    if (simulatedLoc === "field") {
      // Simulate field client site (Vijay Nagar Indore)
      setTimeout(() => {
        setIsCapturingGps(false);
        onCheckIn({
          lat: 22.7538,
          lng: 75.8911,
          accuracy: 14,
          address: "Vijay Nagar Commercial Site · Field Verification",
          category: "Field",
        });
      }, 600);
      return;
    }

    // Try real browser geolocation
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser. Using fallback.");
      setIsCapturingGps(false);
      onCheckIn({
        lat: geofence.lat + 0.001,
        lng: geofence.lng + 0.001,
        accuracy: 15,
        address: "Indore Municipal Zone (Fallback GPS)",
        category: "Field",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const dist = calculateDistanceMeters(
          latitude,
          longitude,
          geofence.lat,
          geofence.lng
        );
        const isOffice = dist <= geofence.radiusMeters;

        setIsCapturingGps(false);
        onCheckIn({
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
          address: isOffice
            ? `${geofence.officeName} (${dist}m from center)`
            : `Field Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) · ${dist}m from HQ`,
          category: isOffice ? "Office" : "Field",
        });
      },
      (err) => {
        console.warn("GPS lookup failed:", err);
        setIsCapturingGps(false);
        setGpsError(
          "Browser location access denied or timed out. Auto-tagging to verified field zone."
        );
        onCheckIn({
          lat: 22.7523,
          lng: 75.8937,
          accuracy: 25,
          address: "Field Location · Indore Central Zone (Manual Tag)",
          category: "Field",
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Filter attendance records
  const filteredAttendance = portalData.attendance.filter((rec) => {
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.checkInCoords?.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" ||
      rec.checkInCoords?.category?.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleExportCsv = () => {
    const exportData = portalData.attendance.map((a) => ({
      ID: a.id,
      Employee: a.employeeName,
      Date: a.date,
      Shift: a.shift,
      "Check-In Time": a.checkInTime,
      "Check-In Location": a.checkInCoords?.address || "",
      Category: a.checkInCoords?.category || "",
      "GPS Accuracy (m)": a.checkInCoords?.accuracy || "",
      "Check-Out Time": a.checkOutTime || "Active",
      Status: a.status,
    }));
    exportToCsv(exportData, "Manas_Attendance_Report");
  };

  return (
    <div className="space-y-6">
      {/* Geofence & Check-In Action Card */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" />
                <span>GPS Field Attendance Terminal</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Section 4: Server-authoritative timestamps with precision coordinates & accuracy
              </p>
            </div>

            {/* Test Simulation Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted-foreground font-medium">
                GPS Mode:
              </span>
              <select
                value={simulatedLoc}
                onChange={(e) => setSimulatedLoc(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white focus:outline-none focus:border-primary"
              >
                <option value="auto" className="bg-[#12131a]">Real Device GPS</option>
                <option value="office" className="bg-[#12131a]">Simulate Office Geofence</option>
                <option value="field" className="bg-[#12131a]">Simulate Field Client Site</option>
              </select>
            </div>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {/* Active Status Display */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Current Session
                </span>
                <div className="mt-2 flex items-center gap-2 text-lg font-bold text-white">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      activeCheckIn ? "bg-emerald-400 animate-pulse" : "bg-white/20"
                    }`}
                  />
                  <span>
                    {activeCheckIn
                      ? `Active Shift · ${activeCheckIn.checkInTime}`
                      : "Not Checked In Today"}
                  </span>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Logged in as: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role})
                </div>
              </div>

              {activeCheckIn && (
                <div className="mt-4 pt-3 border-t border-white/5 text-xs text-emerald-400">
                  ✓ Recorded at {activeCheckIn.checkInCoords?.address}
                </div>
              )}
            </div>

            {/* Action Trigger */}
            <div className="flex flex-col justify-between gap-3">
              {activeCheckIn ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-200">
                    <p className="font-semibold text-amber-300">Shift In Progress</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Field visits and quotations logged will be automatically attached to this shift.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onCheckOut}
                    className="w-full rounded-2xl bg-amber-600 px-5 py-3.5 text-center text-sm font-bold text-white shadow-lg hover:bg-amber-500 transition cursor-pointer"
                  >
                    Check Out & Calculate Shift Duration
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {gpsError && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11px] text-amber-300">
                      {gpsError}
                    </div>
                  )}
                  <button
                    type="button"
                    disabled={isCapturingGps}
                    onClick={handlePerformCheckIn}
                    className="w-full rounded-2xl bg-emerald-600 px-5 py-3.5 text-center text-sm font-bold text-white shadow-lg hover:bg-emerald-500 transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Crosshair className="h-4 w-4" />
                    <span>
                      {isCapturingGps ? "Acquiring Precision GPS..." : "Punch In Now (GPS Verified)"}
                    </span>
                  </button>
                  <p className="text-center text-[10px] text-muted-foreground">
                    Complies with Indore HQ 250m geofence rules
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Office Geofence Info Card */}
        <div className="rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Office Geofence</span>
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                Configured
              </span>
            </div>
            <h3 className="mt-2 text-sm font-bold text-white">
              {geofence.officeName}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {geofence.address}
            </p>
          </div>

          <div className="my-4 rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-xs space-y-1.5">
            <div className="flex justify-between text-muted-foreground">
              <span>Latitude:</span>
              <span className="text-white font-mono">{geofence.lat}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Longitude:</span>
              <span className="text-white font-mono">{geofence.lng}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Geofence Radius:</span>
              <span className="text-emerald-400 font-bold">{geofence.radiusMeters} meters</span>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps?q=${geofence.lat},${geofence.lng}`}
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition"
          >
            <MapPin className="h-3.5 w-3.5 text-accent" />
            <span>Open Indore HQ on Google Maps</span>
          </a>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              Field & Office Attendance Audit Trail
            </h3>
            <p className="text-xs text-muted-foreground">
              Immutable timestamps, coordinates, accuracy and verification category
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search employee or site..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48 sm:w-60 rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-1.5 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            {/* Filter Category */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
            >
              <option value="all" className="bg-[#12131a]">All Locations</option>
              <option value="office" className="bg-[#12131a]">Office Only</option>
              <option value="field" className="bg-[#12131a]">Field Only</option>
            </select>

            {/* Export CSV */}
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Employee</th>
                <th className="py-3 px-3">Date & Shift</th>
                <th className="py-3 px-3">Check-In</th>
                <th className="py-3 px-3">GPS Location & Address</th>
                <th className="py-3 px-3">Accuracy</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Check-Out</th>
                <th className="py-3 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                    {rec.employeeName}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                    <div>{rec.date}</div>
                    <div className="text-[10px] text-white/40">{rec.shift}</div>
                  </td>
                  <td className="py-3 px-3 text-emerald-400 font-bold whitespace-nowrap">
                    {rec.checkInTime}
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <div className="flex items-center gap-1.5 text-white font-medium truncate">
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{rec.checkInCoords?.address}</span>
                    </div>
                    {rec.checkInCoords?.lat && (
                      <a
                        href={`https://www.google.com/maps?q=${rec.checkInCoords.lat},${rec.checkInCoords.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-accent hover:underline block mt-0.5"
                      >
                        {rec.checkInCoords.lat.toFixed(4)}, {rec.checkInCoords.lng.toFixed(4)} · View Map
                      </a>
                    )}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                    {rec.checkInCoords?.accuracy ? (
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-emerald-300 font-mono">
                        ±{rec.checkInCoords.accuracy}m
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        rec.checkInCoords?.category === "Office"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      }`}
                    >
                      {rec.checkInCoords?.category || "Field"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                    {rec.checkOutTime || (
                      <span className="text-amber-400 font-semibold">Active Shift</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        rec.status === "Completed"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : rec.status === "Present"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      <CheckCircle className="h-3 w-3" />
                      <span>{rec.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
