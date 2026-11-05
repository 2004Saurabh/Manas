import React, { useState } from "react";
import {
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  Plus,
  Search,
  Filter,
  ArrowRight,
  FileText,
  Clock,
  Calendar,
  CheckCircle,
  TrendingUp,
  User,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { formatINR } from "../portalData";

export default function ClientCrmTab({
  currentUser,
  portalData,
  onAddClient,
  onUpdateClientStage,
  onSelectClientForVisit,
}) {
  const [viewMode, setViewMode] = useState("kanban"); // "kanban" or "list"
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeClientDrawer, setActiveClientDrawer] = useState(null);
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  // New Client Form
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Retail & Showrooms");
  const [address, setAddress] = useState("");
  const [assignedTo, setAssignedTo] = useState(currentUser.id);
  const [notes, setNotes] = useState("");

  const stages = [
    { id: "New", label: "New Leads", color: "border-blue-500/40 text-blue-400 bg-blue-500/10" },
    { id: "Contacted", label: "Contacted", color: "border-purple-500/40 text-purple-400 bg-purple-500/10" },
    { id: "Meeting Completed", label: "Meeting Done", color: "border-amber-500/40 text-amber-300 bg-amber-500/10" },
    { id: "Quote Sent", label: "Quote Sent", color: "border-accent/40 text-accent bg-accent/10" },
    { id: "Negotiation", label: "Negotiation", color: "border-indigo-500/40 text-indigo-300 bg-indigo-500/10" },
    { id: "Won / Order Confirmed", label: "Won / Order Confirmed", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" },
  ];

  const filteredClients = portalData.clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || c.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const handleCreateClient = (e) => {
    e.preventDefault();
    const newId = `CLT-${Date.now().toString().slice(-3)}`;
    const clientPayload = {
      id: newId,
      name,
      company: company || name,
      contactPerson,
      phone,
      email,
      category,
      address,
      city: "Indore",
      assignedTo,
      stage: "New",
      totalQuoted: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      notes,
    };
    onAddClient(clientPayload);
    setShowAddClientModal(false);
    setName("");
    setCompany("");
    setPhone("");
    setAddress("");
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Client CRM & Field Lead Pipeline</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Section 9: Permanent client IDs, sales progression stages, and audit history
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Kanban / List Toggle */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-1 flex">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                viewMode === "kanban" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-white"
              }`}
            >
              Kanban
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-white"
              }`}
            >
              List View
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddClientModal(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add Client</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search company, brand or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 sm:w-80 rounded-xl border border-white/10 bg-[#12131a] pl-9 pr-3 py-2 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <strong>{filteredClients.length}</strong> accounts in CRM
        </div>
      </div>

      {/* Kanban Pipeline Board */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageClients = filteredClients.filter(
              (c) => c.stage?.toLowerCase() === stage.id.toLowerCase()
            );
            return (
              <div
                key={stage.id}
                className="flex flex-col rounded-3xl border border-white/10 bg-[#12131a]/80 p-3 min-w-[210px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${stage.color.split(" ")[1]}`} />
                    <span className="text-xs font-bold text-white truncate">{stage.label}</span>
                  </div>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    {stageClients.length}
                  </span>
                </div>

                {/* Client Cards in this stage */}
                <div className="space-y-2.5 flex-1">
                  {stageClients.map((client) => {
                    const assignedEmp = portalData.employees.find(
                      (e) => e.id === client.assignedTo
                    );
                    return (
                      <div
                        key={client.id}
                        onClick={() => setActiveClientDrawer(client)}
                        className="group rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-left transition hover:border-primary/50 hover:bg-white/[0.05] cursor-pointer shadow-sm"
                      >
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                          <span className="font-mono text-white/50">{client.id}</span>
                          <span className="text-accent truncate max-w-[90px]">{client.category}</span>
                        </div>

                        <h4 className="text-xs font-bold text-white group-hover:text-primary transition truncate">
                          {client.name}
                        </h4>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {client.company}
                        </p>

                        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                          <span className="text-white/60 truncate">
                            👤 {client.contactPerson}
                          </span>
                          <span className="font-mono font-bold text-emerald-400">
                            {client.totalQuoted > 0 ? formatINR(client.totalQuoted) : "—"}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {stageClients.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/5 p-4 text-center text-[11px] text-muted-foreground/60">
                      No leads
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-muted-foreground uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Client ID & Brand</th>
                  <th className="py-3 px-3">Company</th>
                  <th className="py-3 px-3">Contact & Phone</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Stage</th>
                  <th className="py-3 px-3">Assigned Exec</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredClients.map((client) => {
                  const assignedEmp = portalData.employees.find(
                    (e) => e.id === client.assignedTo
                  );
                  return (
                    <tr
                      key={client.id}
                      onClick={() => setActiveClientDrawer(client)}
                      className="hover:bg-white/[0.02] transition cursor-pointer"
                    >
                      <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                        <div className="text-xs font-bold text-white">{client.name}</div>
                        <span className="font-mono text-[10px] text-muted-foreground">{client.id}</span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                        {client.company}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="text-white font-medium">{client.contactPerson}</div>
                        <div className="text-[10px] text-primary">{client.phone}</div>
                      </td>
                      <td className="py-3 px-3 text-accent whitespace-nowrap">
                        {client.category}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-white">
                          {client.stage}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                        {assignedEmp?.name || "Unassigned"}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveClientDrawer(client);
                          }}
                          className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-white/10"
                        >
                          View 360°
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Client 360° Profile Drawer Modal */}
      {activeClientDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div>
                <span className="font-mono text-xs text-primary font-bold">
                  {activeClientDrawer.id}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {activeClientDrawer.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {activeClientDrawer.company} · {activeClientDrawer.address}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveClientDrawer(null)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Stage Selector */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 mb-5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                Pipeline Stage Progression:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {stages.map((s) => {
                  const isCurrent =
                    activeClientDrawer.stage?.toLowerCase() === s.id.toLowerCase();
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onUpdateClientStage(activeClientDrawer.id, s.id);
                        setActiveClientDrawer({ ...activeClientDrawer, stage: s.id });
                      }}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                        isCurrent
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid gap-3 sm:grid-cols-2 text-xs mb-5">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1">
                <span className="text-muted-foreground block text-[10px]">Contact Person:</span>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>{activeClientDrawer.contactPerson}</span>
                </div>
                <div className="text-white/80 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-accent" />
                  <span>{activeClientDrawer.phone}</span>
                </div>
                <div className="text-white/60 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-purple-400" />
                  <span>{activeClientDrawer.email || "No email registered"}</span>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1">
                <span className="text-muted-foreground block text-[10px]">Location & Area:</span>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{activeClientDrawer.address}</span>
                </div>
                <div className="text-muted-foreground text-[11px]">
                  City: {activeClientDrawer.city} · Category: {activeClientDrawer.category}
                </div>
              </div>
            </div>

            {/* Visit History Timeline for this Client */}
            <div className="border-t border-white/10 pt-4 mb-4">
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Field Visit History & GPS Logs</span>
              </h4>
              <div className="space-y-2">
                {portalData.visits
                  .filter((v) => v.clientId === activeClientDrawer.id)
                  .map((v) => (
                    <div
                      key={v.id}
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{v.purpose}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {v.date} · {v.employeeName} · Outcome: <strong className="text-accent">{v.outcome}</strong>
                        </div>
                      </div>
                      <a
                        href={v.gps?.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-accent hover:underline"
                      >
                        Map Pin ↗
                      </a>
                    </div>
                  ))}

                {portalData.visits.filter((v) => v.clientId === activeClientDrawer.id).length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No field visits logged yet for this account.
                  </p>
                )}
              </div>
            </div>

            {/* Linked Quotations */}
            <div className="border-t border-white/10 pt-4">
              <h4 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-accent" />
                <span>Linked Quotations</span>
              </h4>
              <div className="space-y-2">
                {portalData.quotations
                  .filter((q) => q.clientId === activeClientDrawer.id)
                  .map((q) => (
                    <div
                      key={q.id}
                      className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">
                          {q.id} · {q.status}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {q.date} · Valid: {q.validUntil}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-emerald-400">
                        {formatINR(q.grandTotal)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Client */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                <span>Add New Client Profile</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddClientModal(false)}
                className="grid h-7 w-7 place-items-center rounded-lg bg-white/5 text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">
                  Brand / Account Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phoenix Citadel Showroom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">
                  Company Legal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Phoenix Mills Retail Ltd"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contact name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Phone / Mobile *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">
                  Business Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:border-primary"
                >
                  <option value="Retail & Showrooms" className="bg-[#12131a]">Retail & Showrooms</option>
                  <option value="Automobile" className="bg-[#12131a]">Automobile & Dealerships</option>
                  <option value="Hospitality & F&B" className="bg-[#12131a]">Hospitality & F&B</option>
                  <option value="Healthcare & Pharma" className="bg-[#12131a]">Healthcare & Pharma</option>
                  <option value="Agriculture & FMCG" className="bg-[#12131a]">Agriculture & FMCG</option>
                  <option value="Real Estate" className="bg-[#12131a]">Real Estate & Builders</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">
                  Address / Site Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bypass Road, Indore"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="rounded-xl border border-white/10 px-3 py-1.5 text-muted-foreground hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-4 py-1.5 font-bold text-primary-foreground hover:bg-primary/90"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
