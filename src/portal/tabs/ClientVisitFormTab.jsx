import React, { useState } from "react";
import {
  PlusCircle,
  MapPin,
  Clock,
  Calendar,
  Camera,
  Check,
  AlertCircle,
  FileText,
  User,
  Building,
  Phone,
  Mail,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Crosshair,
} from "lucide-react";

export default function ClientVisitFormTab({
  currentUser,
  portalData,
  onSaveVisit,
  onOpenQuoteModalWithVisit,
}) {
  const [showNewVisitModal, setShowNewVisitModal] = useState(false);
  const [selectedVisitForDetails, setSelectedVisitForDetails] = useState(null);

  // Form State
  const [isExistingClient, setIsExistingClient] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState(
    portalData.clients[0]?.id || ""
  );

  // New Client Fields
  const [newClientName, setNewClientName] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newContactPerson, setNewContactPerson] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCategory, setNewCategory] = useState("Retail & Showrooms");
  const [newAddress, setNewAddress] = useState("");

  // Visit Details
  const [visitType, setVisitType] = useState("New Lead");
  const [purpose, setPurpose] = useState("Storefront Recce & Site Measurement");
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState("Quotation Requested");
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpRemarks, setFollowUpRemarks] = useState("");

  // Products Multi-Select
  const availableServices = [
    "Van Advertising",
    "Canopy Advertising",
    "Umbrella Advertising",
    "Flex Printing",
    "Vinyl Printing",
    "In-Shop Branding",
    "Offset Printing",
    "Signboards & Hoardings",
  ];
  const [selectedServices, setSelectedServices] = useState([
    "In-Shop Branding",
    "Vinyl Printing",
  ]);

  // GPS & Photo State
  const [gpsData, setGpsData] = useState({
    lat: 22.7532,
    lng: 75.8925,
    accuracy: 12,
    address: "Vijay Nagar Commercial Sector, Indore",
  });
  const [isLocating, setIsLocating] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(
    "/assets/shop/shop-storefront-blue.jpg"
  );
  const [openQuoteDirectly, setOpenQuoteDirectly] = useState(false);

  // Capture real GPS
  const handleCaptureGps = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        setGpsData({
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5)),
          accuracy: Math.round(pos.coords.accuracy),
          address: `Field Coordinates (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}) · Indore Site`,
        });
      },
      (err) => {
        setIsLocating(false);
        console.warn("GPS error:", err);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleToggleService = (svc) => {
    if (selectedServices.includes(svc)) {
      setSelectedServices(selectedServices.filter((s) => s !== svc));
    } else {
      setSelectedServices([...selectedServices, svc]);
    }
  };

  const handleSubmitVisit = (e) => {
    e.preventDefault();

    let clientName = "";
    let clientId = selectedClientId;

    if (isExistingClient) {
      const existing = portalData.clients.find((c) => c.id === selectedClientId);
      clientName = existing ? existing.name : "Client";
    } else {
      clientId = `CLT-${Date.now().toString().slice(-3)}`;
      clientName = newClientName || newCompany || "New Client";
    }

    const newVisitId = `VIS-2026-${String(portalData.visits.length + 1).padStart(3, "0")}`;
    const timestamp = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const visitPayload = {
      id: newVisitId,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      clientId: clientId,
      clientName: clientName,
      date: new Date().toISOString().slice(0, 10),
      time: timestamp,
      visitType: visitType,
      purpose: purpose,
      gps: {
        ...gpsData,
        mapUrl: `https://www.google.com/maps?q=${gpsData.lat},${gpsData.lng}`,
      },
      photo: photoPreview,
      servicesOffered: selectedServices,
      outcome: outcome,
      notes: notes,
      followUpDate: followUpDate || null,
      followUpRemarks: followUpRemarks || null,
      linkedQuotationId: null,
    };

    onSaveVisit(visitPayload, {
      isNew: !isExistingClient,
      newClientData: !isExistingClient
        ? {
            id: clientId,
            name: clientName,
            company: newCompany,
            contactPerson: newContactPerson,
            phone: newPhone,
            email: newEmail,
            category: newCategory,
            address: newAddress,
            city: "Indore",
            assignedTo: currentUser.id,
            stage: outcome === "Quotation Requested" ? "Quote Sent" : "Contacted",
          }
        : null,
    });

    setShowNewVisitModal(false);

    if (openQuoteDirectly) {
      onOpenQuoteModalWithVisit(visitPayload);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Field Client Visit Register & GPS Verification</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Section 5: Unique Visit IDs, client records, GPS coordinates, premise photos, and outcomes
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewVisitModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ Log New Client Visit</span>
        </button>
      </div>

      {/* Visits Grid / Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portalData.visits.map((visit) => (
          <div
            key={visit.id}
            className="group rounded-3xl border border-white/10 bg-[#12131a] p-5 shadow-xl transition hover:border-white/20 flex flex-col justify-between"
          >
            <div>
              {/* Photo & Header Badge */}
              <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={visit.photo || "/assets/shop/shop-storefront-blue.jpg"}
                  alt={visit.clientName}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-full bg-black/75 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-white">
                  {visit.id}
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-primary/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-primary-foreground">
                  {visit.visitType}
                </div>
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-black/70 backdrop-blur p-2 text-[10px] text-white/90 truncate flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span className="truncate">{visit.gps?.address}</span>
                </div>
              </div>

              {/* Title & Info */}
              <div className="mt-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-sm font-bold text-white truncate">
                    {visit.clientName}
                  </h3>
                  <span className="shrink-0 rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                    {visit.outcome}
                  </span>
                </div>

                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {visit.purpose}
                </p>

                {/* Services Chips */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {visit.servicesOffered?.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-white/5 border border-white/5 px-2 py-0.5 text-[9px] text-white/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3 text-primary" />
                <span className="truncate max-w-[100px]">{visit.employeeName}</span>
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={visit.gps?.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent hover:underline flex items-center gap-0.5 text-[10px] font-semibold"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>GPS Map</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedVisitForDetails(visit)}
                  className="rounded-lg bg-white/5 px-2 py-1 text-[10px] font-semibold text-white hover:bg-white/10"
                >
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Log New Client Visit Form */}
      {showNewVisitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Record Client Field Visit (GPS Verified)</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Logged by: <strong>{currentUser.name}</strong> · Timestamp:{" "}
                  {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewVisitModal(false)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitVisit} className="space-y-4">
              {/* Client Selection: Existing vs New */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-white">Client Information</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsExistingClient(true)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                        isExistingClient
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      Existing Client
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsExistingClient(false)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                        !isExistingClient
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground hover:text-white"
                      }`}
                    >
                      + New Client
                    </button>
                  </div>
                </div>

                {isExistingClient ? (
                  <div>
                    <label className="text-[11px] text-muted-foreground block mb-1">
                      Select Client from CRM
                    </label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                    >
                      {portalData.clients.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#12131a]">
                          {c.name} · {c.company} ({c.city})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">
                        Brand / Store Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Zara Lifestyle Store"
                        value={newClientName}
                        onChange={(e) => setNewClientName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Inditex Apparels Pvt Ltd"
                        value={newCompany}
                        onChange={(e) => setNewCompany(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">
                        Contact Person & Mobile
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar (+91 98260 00000)"
                        value={newContactPerson}
                        onChange={(e) => setNewContactPerson(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-muted-foreground block mb-1">
                        Store Address / Area
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Treasure Island Mall, MG Road, Indore"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Purpose & Outcome */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Visit Type & Purpose
                  </label>
                  <select
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary mb-2"
                  >
                    <option value="New Lead" className="bg-[#12131a]">New Lead Pitch</option>
                    <option value="Follow-up" className="bg-[#12131a]">Follow-up Meeting</option>
                    <option value="Existing Client" className="bg-[#12131a]">Existing Client Check</option>
                    <option value="Measurement / Recce" className="bg-[#12131a]">Site Measurement / Recce</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Specific purpose (e.g. Façade measurement)"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Visit Outcome
                  </label>
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary mb-2"
                  >
                    <option value="Quotation Requested" className="bg-[#12131a]">Quotation Requested</option>
                    <option value="Interested" className="bg-[#12131a]">Interested / In Discussion</option>
                    <option value="Quotation Submitted" className="bg-[#12131a]">Quotation Submitted</option>
                    <option value="Negotiation" className="bg-[#12131a]">Negotiation Stage</option>
                    <option value="Order Confirmed" className="bg-[#12131a]">Order Confirmed (Won)</option>
                    <option value="Follow-up Needed" className="bg-[#12131a]">Follow-up Needed</option>
                    <option value="Not Interested" className="bg-[#12131a]">Not Interested / Closed</option>
                  </select>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                      title="Next Follow-up Date"
                    />
                    <input
                      type="text"
                      placeholder="Follow-up notes"
                      value={followUpRemarks}
                      onChange={(e) => setFollowUpRemarks(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Products Offered Multi-Select */}
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1.5 font-semibold">
                  Offered Products & Services (Multi-Select)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableServices.map((svc) => {
                    const isSelected = selectedServices.includes(svc);
                    return (
                      <button
                        key={svc}
                        type="button"
                        onClick={() => handleToggleService(svc)}
                        className={`rounded-xl px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                          isSelected
                            ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                            : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {svc}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GPS Capture & Photo Preview */}
              <div className="grid gap-3 sm:grid-cols-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold text-white">
                      Field GPS Verification
                    </span>
                    <button
                      type="button"
                      onClick={handleCaptureGps}
                      className="text-[10px] text-accent font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Crosshair className="h-3 w-3" />
                      <span>{isLocating ? "Locating..." : "Refresh GPS"}</span>
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground bg-white/5 rounded-xl p-2.5 space-y-1">
                    <div className="text-white font-medium truncate">{gpsData.address}</div>
                    <div className="text-[10px] flex justify-between text-white/50">
                      <span>Lat: {gpsData.lat}, Lng: {gpsData.lng}</span>
                      <span className="text-emerald-400 font-bold">±{gpsData.accuracy}m</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-white block mb-1.5">
                    Premise Photo / Proof
                  </label>
                  <div className="flex items-center gap-2">
                    <img
                      src={photoPreview}
                      alt="Premise preview"
                      className="h-12 w-16 rounded-xl object-cover border border-white/10"
                    />
                    <select
                      value={photoPreview}
                      onChange={(e) => setPhotoPreview(e.target.value)}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                    >
                      <option value="/assets/shop/shop-storefront-blue.jpg">Retail Façade (Blue)</option>
                      <option value="/assets/shop/shop-supermarket-posm.jpg">Supermarket POSM</option>
                      <option value="/assets/van/van-side.jpg">Branded Van Site</option>
                      <option value="/assets/flex/flex-rajwada.jpg">Flex Print Hoarding</option>
                      <option value="/assets/canopy/canopy-combo-kit.jpg">Canopy Setup</option>
                      <option value="/assets/umbrella/umbrella-standing-patio.jpg">Patio Umbrella</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Meeting Notes */}
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">
                  Meeting Notes & Client Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="Record client requirements, budget discussions, dimensions noted, or timeline..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                />
              </div>

              {/* Checkbox: Open Quotation Builder Directly */}
              <label className="flex items-center gap-2 text-xs text-accent cursor-pointer">
                <input
                  type="checkbox"
                  checked={openQuoteDirectly}
                  onChange={(e) => setOpenQuoteDirectly(e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
                />
                <span>Immediately draft Quotation for this visit upon saving</span>
              </label>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewVisitModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition cursor-pointer"
                >
                  Save & Verify Field Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedVisitForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Visit Record: {selectedVisitForDetails.id}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {selectedVisitForDetails.date} at {selectedVisitForDetails.time}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVisitForDetails(null)}
                className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedVisitForDetails.photo}
              alt={selectedVisitForDetails.clientName}
              className="h-44 w-full rounded-2xl object-cover border border-white/10 mb-4"
            />

            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-muted-foreground">Client:</span>
                <span className="font-bold text-white">{selectedVisitForDetails.clientName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-muted-foreground">Executive:</span>
                <span className="text-white">{selectedVisitForDetails.employeeName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-muted-foreground">Purpose:</span>
                <span className="text-white font-medium">{selectedVisitForDetails.purpose}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-muted-foreground">Outcome:</span>
                <span className="font-bold text-primary">{selectedVisitForDetails.outcome}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-muted-foreground">GPS Location:</span>
                <span className="text-emerald-400 font-mono text-[11px]">
                  {selectedVisitForDetails.gps?.lat}, {selectedVisitForDetails.gps?.lng} (±{selectedVisitForDetails.gps?.accuracy}m)
                </span>
              </div>
              <div className="pt-1">
                <span className="text-muted-foreground block mb-1">Notes:</span>
                <p className="rounded-xl bg-white/5 p-2 text-white/90">
                  {selectedVisitForDetails.notes || "No additional remarks."}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <a
                href={selectedVisitForDetails.gps?.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
