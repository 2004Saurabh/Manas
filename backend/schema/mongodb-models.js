// ============================================================================
// MANAS ADVERTISING - FIELD MANAGEMENT & ATTENDANCE SYSTEM
// MongoDB / Mongoose Data Models
// Reference: Software Requirements Document v1.0 (Sections 11 & 12)
// ============================================================================

export const MongoSchemas = {
  // 1. Office Locations
  OfficeLocationSchema: {
    officeName: { type: String, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radiusMeters: { type: Number, default: 250 },
    isHeadquarters: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    timestamps: true,
  },

  // 2. Users (Authentication)
  UserSchema: {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["Administrator", "Manager", "Field Employee"],
      required: true,
    },
    active: { type: Boolean, default: true },
    lastLoginAt: Date,
    timestamps: true,
  },

  // 3. Employees
  EmployeeSchema: {
    id: { type: String, required: true, unique: true }, // e.g. EMP-001
    userId: { type: String, ref: "User" },
    name: { type: String, required: true },
    title: String,
    department: String,
    email: { type: String, required: true },
    phone: { type: String, required: true },
    avatarInitials: String,
    role: { type: String, required: true },
    reportingManagerId: { type: String, ref: "Employee" },
    active: { type: Boolean, default: true },
    timestamps: true,
  },

  // 4. Attendance Records
  AttendanceRecordSchema: {
    id: { type: String, required: true, unique: true }, // ATT-2026-001
    employeeId: { type: String, ref: "Employee", required: true },
    punchDate: { type: String, required: true }, // YYYY-MM-DD
    shiftName: { type: String, default: "General Shift (09:30 AM - 06:30 PM)" },
    checkInTime: { type: String, required: true },
    checkInCoords: {
      lat: Number,
      lng: Number,
      accuracy: Number,
      category: { type: String, enum: ["Office", "Field", "Exception"] },
      distanceFromHqMeters: Number,
    },
    checkOutTime: String,
    checkOutCoords: {
      lat: Number,
      lng: Number,
      accuracy: Number,
    },
    status: {
      type: String,
      enum: ["Present", "Half Day", "Late", "Field Verified"],
      default: "Present",
    },
    workDurationHours: Number,
    notes: String,
    timestamps: true,
  },

  // 5. Clients
  ClientSchema: {
    id: { type: String, required: true, unique: true }, // CLT-101
    name: { type: String, required: true },
    company: String,
    contactPerson: String,
    phone: { type: String, required: true },
    email: String,
    category: String,
    address: String,
    city: { type: String, default: "Indore" },
    assignedToEmployeeId: { type: String, ref: "Employee" },
    pipelineStage: {
      type: String,
      enum: ["New", "Meeting Done", "Quote Sent", "Won / Order Confirmed", "Lost"],
      default: "New",
    },
    totalQuotedAmount: { type: Number, default: 0 },
    notes: String,
    timestamps: true,
  },

  // 6. Visits
  VisitSchema: {
    id: { type: String, required: true, unique: true }, // VST-2026-001
    employeeId: { type: String, ref: "Employee", required: true },
    clientId: { type: String, ref: "Client", required: true },
    clientName: { type: String, required: true },
    visitDate: { type: String, required: true },
    visitTime: { type: String, required: true },
    coords: {
      lat: Number,
      lng: Number,
      accuracy: Number,
      address: String,
    },
    purpose: String,
    offeredServices: [String],
    outcome: { type: String, required: true },
    quotedEstimate: { type: Number, default: 0 },
    followUpDate: String,
    photoEvidenceUrl: String,
    isGpsSpoofedFlag: { type: Boolean, default: false },
    notes: String,
    timestamps: true,
  },

  // 7. Quotations
  QuotationSchema: {
    id: { type: String, required: true, unique: true }, // QT-2026-001
    clientId: { type: String, ref: "Client", required: true },
    clientName: { type: String, required: true },
    contactPerson: String,
    employeeId: { type: String, ref: "Employee", required: true },
    employeeName: { type: String, required: true },
    quoteDate: { type: String, required: true },
    validUntilDate: { type: String, required: true },
    subtotal: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    taxRatePercent: { type: Number, default: 18 },
    taxAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Draft", "Pending Approval", "Approved", "Sent to Client", "Order Confirmed", "Rejected"],
      default: "Draft",
    },
    approvedByEmployeeId: String,
    approvedAt: Date,
    rejectionReason: String,
    pdfDocumentUrl: String,
    paymentTerms: String,
    notes: String,
    timestamps: true,
  },

  // 8. Quotation Items
  QuotationItemSchema: {
    quotationId: { type: String, ref: "Quotation", required: true },
    serviceId: String,
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitLabel: String,
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
  },

  // 9. Services Catalogue
  ServiceSchema: {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    pricingType: String,
    basePrice: Number,
    taxRatePercent: { type: Number, default: 18 },
    unitLabel: String,
    active: { type: Boolean, default: true },
  },

  // 10. Follow Ups
  FollowUpSchema: {
    employeeId: { type: String, ref: "Employee", required: true },
    clientId: { type: String, ref: "Client", required: true },
    visitId: String,
    quotationId: String,
    scheduledDate: { type: String, required: true },
    title: { type: String, required: true },
    notes: String,
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled", "Overdue"],
      default: "Pending",
    },
    completedAt: Date,
  },

  // 11. Permissions
  PermissionSchema: {
    role: { type: String, required: true },
    resource: { type: String, required: true },
    canCreate: Boolean,
    canRead: Boolean,
    canUpdate: Boolean,
    canDelete: Boolean,
    canApprove: Boolean,
  },

  // 12. Audit Logs (Section 12: Security & Privacy Constraints)
  AuditLogSchema: {
    actorEmployeeId: String,
    actorName: { type: String, required: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: String,
    ipAddress: String,
    userAgent: String,
    latitude: Number,
    longitude: Number,
    details: Object,
    severity: {
      type: String,
      enum: ["INFO", "WARNING", "EXCEPTION", "SECURITY"],
      default: "INFO",
    },
    createdAt: { type: Date, default: Date.now },
  },
};
