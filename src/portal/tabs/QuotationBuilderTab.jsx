import React, { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Printer,
  Download,
  AlertCircle,
  Eye,
  Send,
  Building,
  User,
  ShieldCheck,
  Check,
  XCircle,
} from "lucide-react";
import { formatINR } from "../portalData";

export default function QuotationBuilderTab({
  currentUser,
  portalData,
  onSaveQuotation,
  onUpdateQuoteStatus,
  prefillClient,
}) {
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [selectedQuoteForPrint, setSelectedQuoteForPrint] = useState(null);

  // Builder Form State
  const [clientId, setClientId] = useState(
    prefillClient?.clientId || portalData.clients[0]?.id || ""
  );
  const [validityDays, setValidityDays] = useState(15);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [deliveryDays, setDeliveryDays] = useState("5 working days from artwork sign-off");
  const [terms, setTerms] = useState(
    "50% advance along with purchase order, balance upon successful installation/delivery. Rates inclusive of transit insurance within Madhya Pradesh."
  );

  // Line Items
  const [items, setItems] = useState([
    {
      id: 1,
      service: "Flex Printing",
      description: "Star Frontlit High-DPI Outdoor Billboard Banner",
      dimensions: "20ft × 10ft (200 sq.ft)",
      specifications: "540 GSM Star Flex with reinforced brass eyelets",
      qty: 2,
      unitPrice: 12500,
    },
    {
      id: 2,
      service: "In-Shop Branding",
      description: "Storefront Fascia Backlit Glow Sign Board",
      dimensions: "15ft × 3ft",
      specifications: "3mm Acrylic Sheet with Samsung LED modules & iron box",
      qty: 1,
      unitPrice: 28000,
    },
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now(),
        service: "Vinyl Printing",
        description: "Custom Printed Surface Graphics",
        dimensions: "Standard Dimensions",
        specifications: "High-Resolution UV Print with Matte Lamination",
        qty: 1,
        unitPrice: 5000,
      },
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: field === "qty" || field === "unitPrice" ? Number(value) : value,
          };
        }
        return item;
      })
    );
  };

  // Computations
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const discountAmount = (subtotal * (Number(discountPercent) || 0)) / 100;
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = taxableAmount * 0.18; // 18% GST standard
  const grandTotal = Math.round(taxableAmount + gstAmount);

  const handleSubmitQuotation = (e) => {
    e.preventDefault();

    const client = portalData.clients.find((c) => c.id === clientId) || portalData.clients[0];
    const newQuoteId = `QT-2026-${1000 + portalData.quotations.length + 1}`;

    const quotePayload = {
      id: newQuoteId,
      version: "v1.0",
      clientId: client.id,
      clientName: client.name,
      contactPerson: client.contactPerson,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      date: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + validityDays * 86400000).toISOString().slice(0, 10),
      status: currentUser.role === "Administrator" ? "Approved" : "Pending Approval",
      items: items.map((it) => ({
        ...it,
        total: (Number(it.qty) || 0) * (Number(it.unitPrice) || 0),
      })),
      subtotal,
      discountPercent: Number(discountPercent),
      taxGstPercent: 18,
      grandTotal,
      estimatedDeliveryDays: deliveryDays,
      terms,
      approvedBy: currentUser.role === "Administrator" ? `${currentUser.name} (Direct Admin)` : null,
      approvalDate: currentUser.role === "Administrator" ? new Date().toISOString() : null,
    };

    onSaveQuotation(quotePayload);
    setShowBuilderModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Order Confirmed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Approved":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Pending Approval":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Negotiation":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-white/10 text-muted-foreground border-white/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Quotation Builder & Financial Estimates</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Section 6: Multi-item quotes, 18% GST auto-tax, approval hierarchy & branded PDF letterhead
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBuilderModal(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>+ Create Itemized Quotation</span>
        </button>
      </div>

      {/* Quotations List Table */}
      <div className="rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-muted-foreground uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3">Quote #</th>
                <th className="py-3 px-3">Client & Contact</th>
                <th className="py-3 px-3">Prepared By</th>
                <th className="py-3 px-3">Date & Validity</th>
                <th className="py-3 px-3">Items</th>
                <th className="py-3 px-3 text-right">Grand Total</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {portalData.quotations.map((quote) => (
                <tr key={quote.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3 px-3 font-mono font-bold text-white whitespace-nowrap">
                    <div>{quote.id}</div>
                    <span className="text-[10px] text-muted-foreground font-normal">
                      {quote.version}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-white max-w-xs">
                    <div className="font-bold">{quote.clientName}</div>
                    <div className="text-[10px] text-muted-foreground">
                      Attn: {quote.contactPerson}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                    {quote.employeeName}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                    <div>{quote.date}</div>
                    <div className="text-[10px] text-white/40">Valid: {quote.validUntil}</div>
                  </td>
                  <td className="py-3 px-3 text-white font-medium whitespace-nowrap">
                    {quote.items?.length || 1} line item(s)
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400 whitespace-nowrap text-sm">
                    {formatINR(quote.grandTotal)}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusBadge(
                        quote.status
                      )}`}
                    >
                      {quote.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedQuoteForPrint(quote)}
                        className="rounded-lg bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-white/10 transition inline-flex items-center gap-1 cursor-pointer"
                        title="View & Print Official PDF"
                      >
                        <Printer className="h-3 w-3 text-primary" />
                        <span>Print PDF</span>
                      </button>

                      {/* Approval Buttons for Manager/Admin */}
                      {(currentUser.role === "Administrator" || currentUser.role === "Manager") &&
                        quote.status === "Pending Approval" && (
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuoteStatus(
                                quote.id,
                                "Approved",
                                `Approved by ${currentUser.name}`
                              )
                            }
                            className="rounded-lg bg-emerald-600/30 border border-emerald-500/40 px-2 py-1 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-600/50 cursor-pointer"
                          >
                            Approve
                          </button>
                        )}

                      {quote.status === "Approved" && (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuoteStatus(
                              quote.id,
                              "Order Confirmed",
                              `Order confirmed by ${currentUser.name}`
                            )
                          }
                          className="rounded-lg bg-primary/20 border border-primary/40 px-2 py-1 text-[11px] font-semibold text-primary hover:bg-primary/30 cursor-pointer"
                        >
                          Confirm Order
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Itemized Quotation */}
      {showBuilderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-[#12131a] p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Itemized Quotation Builder</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Drafting as: <strong>{currentUser.name}</strong> · Auto GST (18%) & Discount Engine
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBuilderModal(false)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitQuotation} className="space-y-4">
              {/* Client Selection */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Select Client *
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    {portalData.clients.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#12131a]">
                        {c.name} · {c.contactPerson} ({c.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Quotation Validity
                  </label>
                  <select
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  >
                    <option value={7} className="bg-[#12131a]">7 Days Validity</option>
                    <option value={15} className="bg-[#12131a]">15 Days Validity</option>
                    <option value={30} className="bg-[#12131a]">30 Days Validity</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Items Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Service Line Items
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.02] p-3.5 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-primary">
                          Item #{idx + 1}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Remove line item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2">
                        <div>
                          <label className="text-[10px] text-muted-foreground block mb-0.5">
                            Service Category
                          </label>
                          <select
                            value={item.service}
                            onChange={(e) => handleItemChange(item.id, "service", e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                          >
                            <option value="Van Advertising" className="bg-[#12131a]">Van Advertising</option>
                            <option value="Canopy Advertising" className="bg-[#12131a]">Canopy Advertising</option>
                            <option value="Umbrella Advertising" className="bg-[#12131a]">Umbrella Advertising</option>
                            <option value="Flex Printing" className="bg-[#12131a]">Flex Printing</option>
                            <option value="Vinyl Printing" className="bg-[#12131a]">Vinyl Printing</option>
                            <option value="In-Shop Branding" className="bg-[#12131a]">In-Shop Branding</option>
                            <option value="Offset Printing" className="bg-[#12131a]">Offset Printing</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-muted-foreground block mb-0.5">
                            Item Description
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Star Frontlit Billboard Hoarding"
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-muted-foreground block mb-0.5">
                            Size / Dimensions
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 20ft × 10ft (200 sq.ft)"
                            value={item.dimensions}
                            onChange={(e) => handleItemChange(item.id, "dimensions", e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-muted-foreground block mb-0.5">
                            Material & Specs
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 540 GSM Star Flex / 3M Cast Vinyl"
                            value={item.specifications}
                            onChange={(e) => handleItemChange(item.id, "specifications", e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                          <div>
                            <label className="text-[10px] text-muted-foreground block mb-0.5">
                              Quantity
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) => handleItemChange(item.id, "qty", e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-muted-foreground block mb-0.5">
                              Unit Price (₹)
                            </label>
                            <input
                              type="number"
                              min={0}
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(item.id, "unitPrice", e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/5 text-right text-xs">
                        Line Total:{" "}
                        <strong className="text-white font-mono">
                          {formatINR((item.qty || 0) * (item.unitPrice || 0))}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary & Tax Computation Card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal Amount:</span>
                  <span className="font-mono text-white">{formatINR(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Discount Rate:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                      className="w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-right font-mono text-xs text-white"
                    />
                    <span className="text-muted-foreground">%</span>
                  </div>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>GST Tax (18% SGST+CGST):</span>
                  <span className="font-mono text-accent">{formatINR(gstAmount)}</span>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                  <span>Grand Quoted Amount:</span>
                  <span className="font-mono text-emerald-400 text-base">
                    {formatINR(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Delivery & Terms */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Estimated Delivery / Turnaround
                  </label>
                  <input
                    type="text"
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">
                    Payment Terms & Warranty
                  </label>
                  <input
                    type="text"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowBuilderModal(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition cursor-pointer"
                >
                  Save & Generate Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Branded Print / PDF Letterhead Modal */}
      {selectedQuoteForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
          <div className="relative w-full max-w-4xl rounded-3xl border border-white/10 bg-white text-gray-900 p-8 shadow-2xl my-8 print:border-none print:shadow-none print:m-0 print:p-6">
            {/* Top Toolbar (Hidden when printing) */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6 print:hidden">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Official Client Quotation
                </span>
                <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-bold">
                  {selectedQuoteForPrint.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-primary/90"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedQuoteForPrint(null)}
                  className="rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Corporate Letterhead */}
            <div className="flex justify-between items-start border-b-2 border-primary pb-6">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900">
                  MANAS ADVERTISING
                </h1>
                <p className="text-xs font-semibold text-primary">
                  Outdoor Media · Digital Flex · Retail Storefronts · Fleet Graphics
                </p>
                <p className="mt-2 text-xs text-gray-600 max-w-sm">
                  Head Office: 1st Floor Nanaksar Kota Stone, In Front Of ICICI Bank, AB Road, Dewas Naka, Indore (M.P)
                  <br />
                  Phone: +91 98260 12345 · GSTIN: 23AABCM1042P1Z4
                  <br />
                  Email: info@manasadvertising.com · Web: manasadvertising.com
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                  Quotation Number
                </div>
                <div className="text-xl font-mono font-bold text-gray-900">
                  {selectedQuoteForPrint.id}
                </div>
                <div className="mt-1 text-xs text-gray-600">
                  Date: <strong>{selectedQuoteForPrint.date}</strong>
                  <br />
                  Valid Until: <strong>{selectedQuoteForPrint.validUntil}</strong>
                </div>
              </div>
            </div>

            {/* Bill To Info */}
            <div className="my-6 grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">
                  Quotation Prepared For:
                </div>
                <h3 className="font-bold text-sm text-gray-900">
                  {selectedQuoteForPrint.clientName}
                </h3>
                <p className="mt-0.5 text-gray-600">
                  Attn: {selectedQuoteForPrint.contactPerson}
                </p>
                <p className="text-gray-500 text-[11px] mt-1">
                  Assigned Executive: {selectedQuoteForPrint.employeeName}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="font-bold text-gray-500 uppercase tracking-wider text-[10px] mb-1">
                  Project Scope & Turnaround:
                </div>
                <p className="text-gray-700">
                  Estimated Delivery: <strong>{selectedQuoteForPrint.estimatedDeliveryDays}</strong>
                </p>
                <p className="text-gray-600 text-[11px] mt-1">
                  Authorized Signatory:{" "}
                  <strong>{selectedQuoteForPrint.approvedBy || "Management Desk"}</strong>
                </p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="overflow-x-auto my-4">
              <table className="w-full text-left text-xs border border-gray-200">
                <thead className="bg-gray-100 text-gray-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-3 border-b">#</th>
                    <th className="py-2.5 px-3 border-b">Service / Scope</th>
                    <th className="py-2.5 px-3 border-b">Dimensions & Material Specifications</th>
                    <th className="py-2.5 px-3 border-b text-center">Qty</th>
                    <th className="py-2.5 px-3 border-b text-right">Unit Rate (₹)</th>
                    <th className="py-2.5 px-3 border-b text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedQuoteForPrint.items?.map((it, i) => (
                    <tr key={it.id || i}>
                      <td className="py-2.5 px-3 text-gray-500">{i + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-gray-900">
                        <div>{it.service}</div>
                        <div className="text-[11px] text-gray-500 font-normal">{it.description}</div>
                      </td>
                      <td className="py-2.5 px-3 text-gray-700">
                        <div>{it.dimensions}</div>
                        <div className="text-[10px] text-gray-500">{it.specifications}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">{it.qty}</td>
                      <td className="py-2.5 px-3 text-right font-mono">{formatINR(it.unitPrice)}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold">
                        {formatINR((it.qty || 1) * (it.unitPrice || 0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex justify-end my-4">
              <div className="w-72 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal Amount:</span>
                  <span className="font-mono">{formatINR(selectedQuoteForPrint.subtotal)}</span>
                </div>
                {selectedQuoteForPrint.discountPercent > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Discount ({selectedQuoteForPrint.discountPercent}%):</span>
                    <span className="font-mono">
                      - {formatINR((selectedQuoteForPrint.subtotal * selectedQuoteForPrint.discountPercent) / 100)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>GST (18% SGST + CGST):</span>
                  <span className="font-mono">
                    {formatINR((selectedQuoteForPrint.grandTotal * 18) / 118)}
                  </span>
                </div>
                <div className="pt-2 border-t-2 border-gray-900 flex justify-between text-sm font-black text-gray-900">
                  <span>Total Amount (INR):</span>
                  <span className="font-mono text-primary text-base">
                    {formatINR(selectedQuoteForPrint.grandTotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms & Signature Section */}
            <div className="mt-8 pt-4 border-t border-gray-200 grid grid-cols-2 gap-6 text-[11px] text-gray-600">
              <div>
                <div className="font-bold text-gray-800 uppercase tracking-wider text-[10px] mb-1">
                  Terms & Conditions:
                </div>
                <p>{selectedQuoteForPrint.terms}</p>
                <p className="mt-1 font-semibold text-gray-800">
                  Bank Details: HDFC Bank, A/C: 50200088992211, IFSC: HDFC0000182 (Indore)
                </p>
              </div>

              <div className="text-right flex flex-col justify-between items-end">
                <div>
                  <div className="font-bold text-gray-800">For MANAS ADVERTISING</div>
                  <div className="text-[10px] text-gray-500">Authorized Signatory</div>
                </div>
                <div className="h-10 border-b border-gray-400 w-48 mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
