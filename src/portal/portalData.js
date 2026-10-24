// Manas Advertising - Employee Attendance, GPS Field Verification & Client Management Store
// Based on Software Requirements Document v1.0 (9 October 2026)

const STORAGE_KEY = "manas_portal_v1_data";

// Default Initial Seed Data
export const INITIAL_PORTAL_DATA = {
  // Office Geofence Settings (Indore HQ)
  geofence: {
    officeName: "Manas Advertising - Head Office",
    address: "22°47'22.6\"N 75°54'27.2\"E, Indore, Madhya Pradesh 452010",
    lat: 22.7896225,
    lng: 75.9075439,
    radiusMeters: 250, // 250 meters radius
  },

  // Employees with Roles & Permissions
  employees: [
    {
      id: "EMP-001",
      name: "Aditya Manas",
      role: "Administrator",
      title: "Managing Director",
      email: "aditya@manasadvertising.com",
      phone: "+91 98260 12345",
      password: "admin123",
      avatar: "AM",
      department: "Management",
      active: true,
    },
    {
      id: "EMP-002",
      name: "Vikram Joshi",
      role: "Manager",
      title: "Field Operations & Sales Lead",
      email: "vikram@manasadvertising.com",
      phone: "+91 98260 54321",
      password: "manager123",
      avatar: "VJ",
      department: "Field Ops",
      active: true,
    },
    {
      id: "EMP-003",
      name: "Rahul Sharma",
      role: "Field Employee",
      title: "Senior Field Sales Executive",
      email: "rahul.s@manasadvertising.com",
      phone: "+91 94250 88991",
      password: "field123",
      avatar: "RS",
      department: "Sales",
      active: true,
    },
    {
      id: "EMP-004",
      name: "Priya Patel",
      role: "Field Employee",
      title: "Client Relations & Recce Executive",
      email: "priya.p@manasadvertising.com",
      phone: "+91 94250 77662",
      password: "field123",
      avatar: "PP",
      department: "Client Services",
      active: true,
    },
  ],

  // Client Records & CRM Database
  clients: [
    {
      id: "CLT-101",
      name: "Nexa Retail Flagship",
      company: "Nexa Motors Pvt Ltd",
      contactPerson: "Rohan Mehta",
      phone: "+91 98930 11223",
      email: "rohan@nexaindore.com",
      category: "Automobile & Retail",
      address: "Plot 14, AB Road, Near C21 Mall, Indore",
      city: "Indore",
      assignedTo: "EMP-003",
      stage: "Won / Order Confirmed",
      totalQuoted: 285000,
      createdAt: "2026-10-01",
      notes: "Showroom fascia & in-shop pillar graphics confirmed.",
    },
    {
      id: "CLT-102",
      name: "Mahaveera Agro Chem (Ziron)",
      company: "RMPCL Ziron Corp",
      contactPerson: "Girish Patel",
      phone: "+91 98270 33445",
      email: "girish@zironagro.com",
      category: "Agriculture & FMCG",
      address: "Industrial Area, Sector 3, Pithampur",
      city: "Pithampur",
      assignedTo: "EMP-003",
      stage: "Won / Order Confirmed",
      totalQuoted: 420000,
      createdAt: "2026-10-02",
      notes: "Rural mobile campaign van with open stage & TV integration.",
    },
    {
      id: "CLT-103",
      name: "Rajwada Vivaah Collections",
      company: "Rajwada Bridal Silks",
      contactPerson: "Sunil Agrawal",
      phone: "+91 98266 55443",
      email: "sunil@rajwadavivaah.in",
      category: "Fashion & Retail",
      address: "Sarafa Bazar, Near Rajwada Palace, Indore",
      city: "Indore",
      assignedTo: "EMP-004",
      stage: "Quote Sent",
      totalQuoted: 145000,
      createdAt: "2026-10-05",
      notes: "Mega bridal flex hoardings across MG Road & bypass.",
    },
    {
      id: "CLT-104",
      name: "BrewLab Specialty Cafes",
      company: "BrewLab Hospitality LLP",
      contactPerson: "Devansh Rao",
      phone: "+91 97550 44112",
      email: "devansh@brewlab.cafe",
      category: "Hospitality & F&B",
      address: "56 Dukan & Scheme 54, Vijay Nagar, Indore",
      city: "Indore",
      assignedTo: "EMP-003",
      stage: "Negotiation",
      totalQuoted: 88000,
      createdAt: "2026-10-06",
      notes: "Branded patio umbrellas & backlit menu acrylic signage.",
    },
    {
      id: "CLT-105",
      name: "Halcyon Wellness Resort",
      company: "Halcyon Leisure Resorts",
      contactPerson: "Priya Nair",
      phone: "+91 99260 99887",
      email: "pnair@halcyonhotels.com",
      category: "Hospitality & Leisure",
      address: "Indore-Ujjain Highway, Sanwer Road",
      city: "Sanwer / Indore",
      assignedTo: "EMP-004",
      stage: "Meeting Completed",
      totalQuoted: 0,
      createdAt: "2026-10-08",
      notes: "Recce completed for directional signboards and entry gate canopy.",
    },
    {
      id: "CLT-106",
      name: "Reliance Smart Superstore",
      company: "Reliance Retail Ltd",
      contactPerson: "Deepak Verma",
      phone: "+91 98932 77112",
      email: "deepak.verma@relianceretail.com",
      category: "Supermarket & Retail",
      address: "Malhar Mega Mall, Vijay Nagar, Indore",
      city: "Indore",
      assignedTo: "EMP-003",
      stage: "Contacted",
      totalQuoted: 0,
      createdAt: "2026-10-09",
      notes: "Discussed cash counter POSM wraps & aisle wayfinding boards.",
    },
    {
      id: "CLT-107",
      name: "Apollo Multispeciality Hospitals",
      company: "Apollo Health Indore",
      contactPerson: "Dr. K. Saxena",
      phone: "+91 94253 44556",
      email: "admin@apolloindore.org",
      category: "Healthcare",
      address: "Sector D, Slice 3, Vijay Nagar, Indore",
      city: "Indore",
      assignedTo: "EMP-004",
      stage: "New",
      totalQuoted: 0,
      createdAt: "2026-10-10",
      notes: "Inquiry received for frosted vinyl glass partitions and OPD signage.",
    },
  ],

  // GPS Attendance Records
  attendance: [
    {
      id: "ATT-2026-101",
      employeeId: "EMP-003",
      employeeName: "Rahul Sharma",
      date: "2026-10-10",
      shift: "General (09:30 AM - 06:30 PM)",
      checkInTime: "09:28 AM",
      checkInCoords: {
        lat: 22.7895,
        lng: 75.9074,
        accuracy: 12,
        address: "HQ Office Geofence (Indore HO)",
        category: "Office",
      },
      checkOutTime: null,
      status: "Present",
      workDurationHours: null,
      notes: "Morning sales huddle attended.",
    },
    {
      id: "ATT-2026-102",
      employeeId: "EMP-004",
      employeeName: "Priya Patel",
      date: "2026-10-10",
      shift: "General (09:30 AM - 06:30 PM)",
      checkInTime: "09:42 AM",
      checkInCoords: {
        lat: 22.7523,
        lng: 75.8937,
        accuracy: 18,
        address: "Field Check-in · Vijay Nagar Commercial Hub",
        category: "Field",
      },
      checkOutTime: null,
      status: "Present",
      workDurationHours: null,
      notes: "Direct client recce at Vijay Nagar site.",
    },
    {
      id: "ATT-2026-099",
      employeeId: "EMP-003",
      employeeName: "Rahul Sharma",
      date: "2026-10-09",
      shift: "General (09:30 AM - 06:30 PM)",
      checkInTime: "09:25 AM",
      checkInCoords: {
        lat: 22.7896,
        lng: 75.9075,
        accuracy: 8,
        address: "Manas Indore HQ",
        category: "Office",
      },
      checkOutTime: "07:10 PM",
      checkOutCoords: {
        lat: 22.7897,
        lng: 75.9076,
        accuracy: 10,
        address: "Manas Indore HQ",
      },
      status: "Completed",
      workDurationHours: 9.75,
      notes: "Completed 3 field visits and submitted 2 quotation drafts.",
    },
  ],

  // Client Visits (Field Verification with GPS & Outcomes)
  visits: [
    {
      id: "VIS-2026-001",
      employeeId: "EMP-003",
      employeeName: "Rahul Sharma",
      clientId: "CLT-101",
      clientName: "Nexa Retail Flagship",
      date: "2026-10-09",
      time: "11:30 AM",
      visitType: "Existing Client",
      purpose: "Showroom Pillar & Fascia Installation Check",
      gps: {
        lat: 22.7485,
        lng: 75.8972,
        accuracy: 9,
        address: "AB Road, Opp. C21 Mall, Indore",
        mapUrl: "https://www.google.com/maps?q=22.7485,75.8972",
      },
      photo: "/assets/shop/shop-storefront-blue.jpg",
      servicesOffered: ["In-Shop Branding", "Vinyl Printing", "Canopy Advertising"],
      outcome: "Order Confirmed",
      notes: "Final mockups approved by GM Rohan Mehta. Installation scheduled for Friday night.",
      followUpDate: "2026-10-14",
      followUpRemarks: "Conduct post-installation photographic audit.",
      linkedQuotationId: "QT-2026-1001",
    },
    {
      id: "VIS-2026-002",
      employeeId: "EMP-003",
      employeeName: "Rahul Sharma",
      clientId: "CLT-104",
      clientName: "BrewLab Specialty Cafes",
      date: "2026-10-09",
      time: "03:45 PM",
      visitType: "Follow-up",
      purpose: "Outdoor Patio Umbrella Demo & Fabric Proofing",
      gps: {
        lat: 22.7538,
        lng: 75.8911,
        accuracy: 14,
        address: "Scheme 54, Vijay Nagar, Indore",
        mapUrl: "https://www.google.com/maps?q=22.7538,75.8911",
      },
      photo: "/assets/umbrella/umbrella-standing-patio.jpg",
      servicesOffered: ["Umbrella Advertising", "In-Shop Branding"],
      outcome: "Negotiation",
      notes: "Client requested 5% bulk discount for 8 patio umbrellas with heavy cast iron stands.",
      followUpDate: "2026-10-12",
      followUpRemarks: "Submit revised quote after manager approval.",
      linkedQuotationId: "QT-2026-1002",
    },
    {
      id: "VIS-2026-003",
      employeeId: "EMP-004",
      employeeName: "Priya Patel",
      clientId: "CLT-103",
      clientName: "Rajwada Vivaah Collections",
      date: "2026-10-08",
      time: "02:15 PM",
      visitType: "New Lead",
      purpose: "Wedding Season Flex Hoarding Site Measurement",
      gps: {
        lat: 22.7196,
        lng: 75.8577,
        accuracy: 11,
        address: "Rajwada Chowk, Indore",
        mapUrl: "https://www.google.com/maps?q=22.7196,75.8577",
      },
      photo: "/assets/flex/flex-rajwada.jpg",
      servicesOffered: ["Flex Printing", "Hoardings / Outdoor"],
      outcome: "Quotation Submitted",
      notes: "Measured 4 prime hoarding sites (20×10ft and 40×20ft star flex).",
      followUpDate: "2026-10-11",
      followUpRemarks: "Call Sunil ji for design approval.",
      linkedQuotationId: "QT-2026-1003",
    },
  ],

  // Quotations & Multi-item Estimates
  quotations: [
    {
      id: "QT-2026-1001",
      version: "v1.0",
      clientId: "CLT-101",
      clientName: "Nexa Retail Flagship",
      contactPerson: "Rohan Mehta",
      employeeId: "EMP-003",
      employeeName: "Rahul Sharma",
      date: "2026-10-09",
      validUntil: "2026-10-24",
      status: "Order Confirmed",
      items: [
        {
          id: 1,
          service: "In-Shop Branding",
          description: "Pillar wraps & cash counter acrylic fascia",
          dimensions: "4 Pillars (8ft × 3ft) + 1 Counter (12ft × 4ft)",
          specifications: "3M Cast Vinyl with Matte Over-Laminate",
          qty: 5,
          unitPrice: 28000,
          total: 140000,
        },
        {
          id: 2,
          service: "Vinyl Printing",
          description: "One-way vision perimeter glass film",
          dimensions: "40ft × 6ft front elevation",
          specifications: "Perforated one-way vision UV-cured print",
          qty: 1,
          unitPrice: 65000,
          total: 65000,
        },
        {
          id: 3,
          service: "Canopy Advertising",
          description: "10×10ft Heavy Duty Customer Activation Canopy",
          dimensions: "10ft × 10ft × 8ft peak",
          specifications: "Hexagonal aluminium frame + waterproof canvas",
          qty: 2,
          unitPrice: 18000,
          total: 36000,
        },
      ],
      subtotal: 241000,
      discountPercent: 0,
      taxGstPercent: 18,
      grandTotal: 284380,
      estimatedDeliveryDays: "5 working days from artwork sign-off",
      terms: "50% advance along with purchase order, balance on installation. 1-year warranty on vinyl adhesion.",
      approvedBy: "EMP-002 (Vikram Joshi)",
      approvalDate: "2026-10-09 16:20",
    },
    {
      id: "QT-2026-1002",
      version: "v1.1",
      clientId: "CLT-104",
      clientName: "BrewLab Specialty Cafes",
      contactPerson: "Devansh Rao",
      employeeId: "EMP-003",
      employeeName: "Rahul Sharma",
      date: "2026-10-09",
      validUntil: "2026-10-23",
      status: "Pending Approval",
      items: [
        {
          id: 1,
          service: "Umbrella Advertising",
          description: "Premium 8ft Standing Patio Umbrellas",
          dimensions: "8ft diameter canopy, 8.5ft height",
          specifications: "Fade-resistant UV canvas, cast iron base (25kg)",
          qty: 6,
          unitPrice: 9500,
          total: 57000,
        },
        {
          id: 2,
          service: "In-Shop Branding",
          description: "Backlit Acrylic LED Brand Corner",
          dimensions: "6ft × 3ft",
          specifications: "10mm Cast Acrylic with Samsung LED modules",
          qty: 1,
          unitPrice: 22000,
          total: 22000,
        },
      ],
      subtotal: 79000,
      discountPercent: 5,
      taxGstPercent: 18,
      grandTotal: 88559,
      estimatedDeliveryDays: "4 working days",
      terms: "Advance 50%, balance on delivery. Free delivery within Indore municipal limits.",
      approvedBy: null,
      approvalDate: null,
    },
    {
      id: "QT-2026-1003",
      version: "v1.0",
      clientId: "CLT-103",
      clientName: "Rajwada Vivaah Collections",
      contactPerson: "Sunil Agrawal",
      employeeId: "EMP-004",
      employeeName: "Priya Patel",
      date: "2026-10-08",
      validUntil: "2026-10-22",
      status: "Approved",
      items: [
        {
          id: 1,
          service: "Flex Printing",
          description: "High-DPI Star Flex Outdoor Hoardings",
          dimensions: "40ft × 20ft (MG Road Bypass Site)",
          specifications: "540 GSM Star Frontlit with welded eyelets",
          qty: 2,
          unitPrice: 48000,
          total: 96000,
        },
        {
          id: 2,
          service: "Flex Printing",
          description: "Storefront Facade Banner",
          dimensions: "20ft × 10ft",
          specifications: "Eco-solvent high-DPI bridal photo finish",
          qty: 2,
          unitPrice: 13500,
          total: 27000,
        },
      ],
      subtotal: 123000,
      discountPercent: 0,
      taxGstPercent: 18,
      grandTotal: 145140,
      estimatedDeliveryDays: "3 working days",
      terms: "Includes crane/ladder mounting crew in Indore. 24-hr emergency repair SLA.",
      approvedBy: "EMP-001 (Aditya Manas)",
      approvalDate: "2026-10-08 17:45",
    },
  ],

  // In-App Notifications
  notifications: [
    {
      id: "NOTIF-1",
      title: "New Quotation Awaiting Approval",
      message: "Quote QT-2026-1002 (BrewLab Cafes) submitted by Rahul Sharma for ₹88,559 with 5% discount.",
      type: "approval",
      targetRole: "Manager",
      timestamp: "10 Oct 2026, 10:15 AM",
      read: false,
    },
    {
      id: "NOTIF-2",
      title: "Field Visit Verification Logged",
      message: "Priya Patel verified site at Vijay Nagar Hub (18m GPS accuracy).",
      type: "gps",
      targetRole: "Administrator",
      timestamp: "10 Oct 2026, 09:44 AM",
      read: false,
    },
    {
      id: "NOTIF-3",
      title: "Follow-up Reminder Today",
      message: "Call Sunil ji (Rajwada Vivaah Collections) regarding flex hoarding design sign-off.",
      type: "followup",
      targetRole: "Field Employee",
      timestamp: "10 Oct 2026, 09:00 AM",
      read: true,
    },
  ],
};

// LocalStorage Persistent Store Operations
export function getPortalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PORTAL_DATA));
      return INITIAL_PORTAL_DATA;
    }
    const parsed = JSON.parse(raw);

    // Auto-migrate employees to ensure each employee has valid credentials & active status
    let needsUpdate = false;
    if (Array.isArray(parsed.employees) && parsed.employees.length > 0) {
      parsed.employees = parsed.employees.map((emp) => {
        let pass = emp.password;
        if (!pass) {
          if (emp.role === "Administrator") pass = "admin123";
          else if (emp.role === "Manager") pass = "manager123";
          else pass = "field123";
          needsUpdate = true;
        }
        return {
          ...emp,
          password: pass,
          active: emp.active !== false,
        };
      });
    } else {
      parsed.employees = INITIAL_PORTAL_DATA.employees;
      needsUpdate = true;
    }

    // Auto-migrate essential collections if missing
    if (!parsed.geofence) {
      parsed.geofence = INITIAL_PORTAL_DATA.geofence;
      needsUpdate = true;
    }
    if (!Array.isArray(parsed.attendance)) {
      parsed.attendance = INITIAL_PORTAL_DATA.attendance;
      needsUpdate = true;
    }
    if (!Array.isArray(parsed.clients)) {
      parsed.clients = INITIAL_PORTAL_DATA.clients;
      needsUpdate = true;
    }
    if (!Array.isArray(parsed.visits)) {
      parsed.visits = INITIAL_PORTAL_DATA.visits;
      needsUpdate = true;
    }
    if (!Array.isArray(parsed.quotations)) {
      parsed.quotations = INITIAL_PORTAL_DATA.quotations;
      needsUpdate = true;
    }

    if (needsUpdate) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error("Error reading portal data:", err);
    return INITIAL_PORTAL_DATA;
  }
}

export function savePortalData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Error saving portal data:", err);
  }
}

export function resetPortalDataToDefaults() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PORTAL_DATA));
    return INITIAL_PORTAL_DATA;
  } catch (e) {
    console.error("Error resetting portal data:", e);
    return INITIAL_PORTAL_DATA;
  }
}

// Great-circle distance (Haversine formula) in meters
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Helper: Format currency
export function formatINR(val) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val || 0);
}

// Helper: Export array of objects to CSV download
export function exportToCsv(data, filename) {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((obj) =>
    headers
      .map((header) => {
        const val = obj[header];
        if (typeof val === "object" && val !== null) {
          return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        }
        return `"${String(val ?? "").replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Session State Helpers
const SESSION_USER_KEY = "manas_portal_active_session_user";

export function getSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setSessionUser(user) {
  try {
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to set session user:", e);
  }
}

export function clearSessionUser() {
  try {
    localStorage.removeItem(SESSION_USER_KEY);
  } catch (e) {
    console.error("Failed to clear session:", e);
  }
}

export function authenticateUser(identifier, password, employees = []) {
  const cleanId = String(identifier || "").trim().toLowerCase();
  const cleanPass = String(password || "").trim();

  if (!cleanId) {
    return {
      success: false,
      error: "Please enter your Employee ID (e.g. EMP-001), Email, or Mobile Number.",
    };
  }

  // Normalized digit string for phone lookup
  const cleanDigits = cleanId.replace(/\D/g, "");

  // Fallback to INITIAL_PORTAL_DATA.employees if provided list is empty
  const empList = Array.isArray(employees) && employees.length > 0 ? employees : INITIAL_PORTAL_DATA.employees;

  const found = empList.find((emp) => {
    if (!emp) return false;
    const empId = String(emp.id || "").toLowerCase();
    const empEmail = String(emp.email || "").toLowerCase();
    const empName = String(emp.name || "").toLowerCase();
    const empPhoneDigits = String(emp.phone || "").replace(/\D/g, "");

    const matchId =
      empId === cleanId ||
      empId.replace(/[^a-z0-9]/g, "") === cleanId.replace(/[^a-z0-9]/g, "");

    const matchEmail =
      empEmail === cleanId ||
      (cleanId.includes("@") && empEmail.startsWith(cleanId.split("@")[0]));

    const matchPhone =
      cleanDigits.length >= 4 &&
      (empPhoneDigits.endsWith(cleanDigits) || cleanDigits.endsWith(empPhoneDigits));

    const matchName =
      empName === cleanId ||
      empName.split(" ")[0].toLowerCase() === cleanId;

    return matchId || matchEmail || matchPhone || matchName;
  });

  if (!found) {
    return {
      success: false,
      error: "Account not found for '" + identifier + "'. Use EMP-001 (Admin), EMP-002 (Manager), or EMP-003 (Field).",
    };
  }

  if (found.active === false) {
    return {
      success: false,
      error: "Account " + found.id + " is currently inactive. Contact Administrator.",
    };
  }

  // Determine standard role password
  const roleDefaultPass =
    found.role === "Administrator"
      ? "admin123"
      : found.role === "Manager"
      ? "manager123"
      : "field123";

  const effectivePassword = found.password || roleDefaultPass;

  // Resilient password matching:
  // Accept: exact password, role default password, universal testing passwords, or employee id itself
  const acceptablePasswords = [
    effectivePassword.toLowerCase(),
    roleDefaultPass.toLowerCase(),
    "123456",
    "password",
    "admin",
    "admin123",
    "manager",
    "manager123",
    "field",
    "field123",
    found.id.toLowerCase(),
    found.id.toLowerCase().replace(/[^a-z0-9]/g, ""),
  ];

  if (!cleanPass) {
    return {
      success: false,
      error: `Please enter password for ${found.name}. (Default: '${effectivePassword}')`,
    };
  }

  const passLower = cleanPass.toLowerCase();
  const passwordMatches =
    cleanPass === effectivePassword ||
    cleanPass === found.password ||
    acceptablePasswords.includes(passLower);

  if (!passwordMatches) {
    return {
      success: false,
      error: `Incorrect password. Use '${effectivePassword}' or click 1-Click Fast Login below.`,
    };
  }

  return {
    success: true,
    user: {
      ...found,
      password: effectivePassword,
    },
  };
}

