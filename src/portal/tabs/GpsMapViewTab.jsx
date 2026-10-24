import React, { useState } from "react";
import {
  MapPin,
  ExternalLink,
  Clock,
  User,
  Building,
  Compass,
  Crosshair,
  Filter,
  CheckCircle,
} from "lucide-react";

export default function GpsMapViewTab({ portalData }) {
  const [filterType, setFilterType] = useState("all"); // "all", "attendance", "visits"
  const [selectedPoint, setSelectedPoint] = useState(null);

  const geofence = portalData.geofence;

  // Build points list
  const attendancePoints = portalData.attendance
    .filter((a) => a.checkInCoords?.lat)
    .map((a) => ({
      id: a.id,
      type: "attendance",
      title: `${a.employeeName} Check-in`,
      subtitle: a.checkInCoords.address,
      employee: a.employeeName,
      time: `${a.date} at ${a.checkInTime}`,
      lat: a.checkInCoords.lat,
      lng: a.checkInCoords.lng,
      accuracy: a.checkInCoords.accuracy,
      category: a.checkInCoords.category,
      mapUrl: `https://www.google.com/maps?q=${a.checkInCoords.lat},${a.checkInCoords.lng}`,
    }));

  const visitPoints = portalData.visits
    .filter((v) => v.gps?.lat)
    .map((v) => ({
      id: v.id,
      type: "visit",
      title: `Visit: ${v.clientName}`,
      subtitle: v.purpose,
      employee: v.employeeName,
      time: `${v.date} at ${v.time}`,
      lat: v.gps.lat,
      lng: v.gps.lng,
      accuracy: v.gps.accuracy,
      outcome: v.outcome,
      photo: v.photo,
      mapUrl: v.gps.mapUrl || `https://www.google.com/maps?q=${v.gps.lat},${v.gps.lng}`,
    }));

  const allPoints = [
    ...(filterType === "all" || filterType === "attendance" ? attendancePoints : []),
    ...(filterType === "all" || filterType === "visits" ? visitPoints : []),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            <span>GPS Event Verification & Location Map</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Section 7: Event-based location pins showing field attendance check-ins & client site visits
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
              filterType === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-white"
            }`}
          >
            All Points ({attendancePoints.length + visitPoints.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("visits")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
              filterType === "visits" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-white"
            }`}
          >
            Client Visits ({visitPoints.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("attendance")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
              filterType === "attendance" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-white"
            }`}
          >
            Staff Check-ins ({attendancePoints.length})
          </button>
        </div>
      </div>

      {/* Interactive Map Presentation */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Visual Map Canvas / Radar Box */}
        <div className="lg:col-span-2 relative min-h-[460px] rounded-3xl border border-white/10 bg-[#0d0e14] p-6 shadow-xl overflow-hidden flex flex-col justify-between">
          {/* Subtle Grid / Radar Background lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

          {/* Map Top Indicator */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="rounded-2xl border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur text-xs text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Indore Region · Live Field Grid</span>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur text-xs text-muted-foreground">
              HQ: {geofence.lat.toFixed(4)}, {geofence.lng.toFixed(4)}
            </div>
          </div>

          {/* Interactive Event Pins on Radar Canvas */}
          <div className="relative z-10 my-8 flex flex-wrap gap-4 items-center justify-center">
            {/* HQ Office Pin */}
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/20 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur hover:scale-105 transition">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>Indore HQ (Geofence Center)</span>
              </div>
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-primary/80 whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
                Radius: {geofence.radiusMeters}m
              </div>
            </div>

            {/* Plotted Events */}
            {allPoints.map((pt) => {
              const isVisit = pt.type === "visit";
              return (
                <div
                  key={pt.id}
                  onClick={() => setSelectedPoint(pt)}
                  className={`cursor-pointer rounded-2xl border p-3 backdrop-blur shadow-lg transition-all hover:scale-105 max-w-[200px] ${
                    isVisit
                      ? "border-accent/40 bg-accent/10 hover:border-accent"
                      : "border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-500"
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-white truncate">
                    <MapPin className={`h-3.5 w-3.5 ${isVisit ? "text-accent" : "text-emerald-400"}`} />
                    <span className="truncate">{pt.title}</span>
                  </div>
                  <div className="mt-1 text-[10px] text-muted-foreground truncate">
                    {pt.employee} · {pt.time.split("at")[1] || pt.time}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[9px] text-white/50">
                    <span>±{pt.accuracy}m</span>
                    <span className="text-accent hover:underline">Inspect →</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Footer Helper */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-accent" />
                <span>Client Site Visits</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span>Field Check-ins</span>
              </span>
            </div>

            <a
              href={`https://www.google.com/maps/search/Indore+Madhya+Pradesh/@${geofence.lat},${geofence.lng},13z`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Full Google Maps Overview</span>
            </a>
          </div>
        </div>

        {/* Selected Point Inspector */}
        <div className="rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Crosshair className="h-4 w-4 text-primary" />
                <span>GPS Point Inspector</span>
              </h3>
              <span className="text-xs text-muted-foreground">
                {selectedPoint ? selectedPoint.id : "Click pin to inspect"}
              </span>
            </div>

            {selectedPoint ? (
              <div className="space-y-3.5 text-xs">
                {selectedPoint.photo && (
                  <img
                    src={selectedPoint.photo}
                    alt={selectedPoint.title}
                    className="h-32 w-full rounded-2xl object-cover border border-white/10 mb-2"
                  />
                )}

                <div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                    Event Name:
                  </span>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {selectedPoint.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {selectedPoint.subtitle}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employee:</span>
                    <span className="font-semibold text-white">{selectedPoint.employee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recorded Time:</span>
                    <span className="text-white">{selectedPoint.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Latitude:</span>
                    <span className="font-mono text-white">{selectedPoint.lat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Longitude:</span>
                    <span className="font-mono text-white">{selectedPoint.lng}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GPS Accuracy:</span>
                    <span className="font-bold text-emerald-400">±{selectedPoint.accuracy} meters</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                Click any GPS event pin on the map to inspect coordinates, accuracy, and premise photo.
              </div>
            )}
          </div>

          {selectedPoint && (
            <a
              href={selectedPoint.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 w-full rounded-2xl bg-primary py-3 text-center text-xs font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Navigate on Google Maps</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
