// ============================================================================
// MANAS ADVERTISING - BACKEND API CLIENT & HTTP BRIDGE
// Connects React UI to Node.js + Express backend (Sections 11 & 12)
// Falls back seamlessly to browser localStorage if server is offline.
// ============================================================================

import {
  getPortalData,
  savePortalData,
  authenticateUser,
  calculateDistanceMeters,
} from "./portalData";

const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "/api";

let authToken = null;
let activeEmpId = null;

export function setApiAuth(token, empId) {
  authToken = token;
  activeEmpId = empId;
}

async function request(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(activeEmpId ? { "X-Employee-Id": activeEmpId } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    // Return null or throw for fallback handler
    throw err;
  }
}

// 1. Check Server Health
export async function apiCheckHealth() {
  try {
    return await request("/health");
  } catch (e) {
    return {
      status: "offline",
      error: e.message,
      message: "Node.js Express server is not reachable on localhost:5000. Operating in offline/client store mode.",
    };
  }
}

// 2. POST /auth/login
export async function apiLogin(identifier, password) {
  try {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
    });
    if (data.token) {
      setApiAuth(data.token, data.user?.id);
    }
    return data;
  } catch (err) {
    // Fallback to local authentication
    console.warn("Backend API login unreachable, using client auth engine:", err.message);
    const localStore = getPortalData();
    const result = authenticateUser(identifier, password, localStore.employees);
    if (!result.success) throw new Error(result.error);
    setApiAuth(`LOCAL_JWT_${result.user.id}`, result.user.id);
    return {
      success: true,
      token: `LOCAL_JWT_${result.user.id}`,
      user: result.user,
      fallbackMode: true,
    };
  }
}

// 3. POST /attendance/check-in
export async function apiCheckIn(coords, notes) {
  try {
    return await request("/attendance/check-in", {
      method: "POST",
      body: JSON.stringify({ coords, notes }),
    });
  } catch (err) {
    console.warn("API check-in unreachable, using client store:", err.message);
    const store = getPortalData();
    const distance = calculateDistanceMeters(
      coords.lat,
      coords.lng,
      store.geofence.lat,
      store.geofence.lng
    );
    const isWithinHq = distance <= store.geofence.radiusMeters;
    const timeStr = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    const newRecord = {
      id: `ATT-2026-${String(store.attendance.length + 1).padStart(3, "0")}`,
      employeeId: activeEmpId || "EMP-003",
      employeeName: "Rahul Sharma",
      date: new Date().toISOString().slice(0, 10),
      shift: "General Shift (09:30 AM - 06:30 PM)",
      checkInTime: timeStr,
      checkInCoords: {
        lat: coords.lat,
        lng: coords.lng,
        accuracy: coords.accuracy || 10,
        category: isWithinHq ? "Office" : "Field",
        address: coords.address || (isWithinHq ? "Indore HQ Office" : "Client Field Location"),
      },
      checkOutTime: null,
      status: isWithinHq ? "Present" : "Field Verified",
      notes,
    };
    store.attendance.unshift(newRecord);
    savePortalData(store);
    return { success: true, record: newRecord, fallbackMode: true };
  }
}

// 4. POST /attendance/check-out
export async function apiCheckOut() {
  try {
    return await request("/attendance/check-out", { method: "POST" });
  } catch (err) {
    const store = getPortalData();
    const today = new Date().toISOString().slice(0, 10);
    const active = store.attendance.find((a) => a.date === today && !a.checkOutTime);
    if (active) {
      active.checkOutTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      savePortalData(store);
      return { success: true, record: active, fallbackMode: true };
    }
    throw err;
  }
}

// 5. POST /visits
export async function apiRecordVisit(visitData) {
  try {
    return await request("/visits", {
      method: "POST",
      body: JSON.stringify(visitData),
    });
  } catch (err) {
    const store = getPortalData();
    const newVisit = {
      id: `VST-2026-${String(store.visits.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      ...visitData,
    };
    store.visits.unshift(newVisit);
    savePortalData(store);
    return { success: true, visit: newVisit, fallbackMode: true };
  }
}

// 6. GET /visits
export async function apiGetVisits(query = {}) {
  try {
    const qStr = new URLSearchParams(query).toString();
    return await request(`/visits?${qStr}`);
  } catch (err) {
    const store = getPortalData();
    return { success: true, visits: store.visits, count: store.visits.length, fallbackMode: true };
  }
}

// 7. POST /quotes
export async function apiCreateQuote(quoteData) {
  try {
    return await request("/quotes", {
      method: "POST",
      body: JSON.stringify(quoteData),
    });
  } catch (err) {
    const store = getPortalData();
    const newQuote = {
      id: `QT-2026-${String(store.quotations.length + 1).padStart(3, "0")}`,
      quoteDate: new Date().toISOString().slice(0, 10),
      ...quoteData,
    };
    store.quotations.unshift(newQuote);
    savePortalData(store);
    return { success: true, quote: newQuote, fallbackMode: true };
  }
}

// 8. PATCH /quotes/:id/status
export async function apiUpdateQuoteStatus(quoteId, status, reason) {
  try {
    return await request(`/quotes/${quoteId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, reason }),
    });
  } catch (err) {
    const store = getPortalData();
    const q = store.quotations.find((item) => item.id === quoteId);
    if (q) {
      q.status = status;
      savePortalData(store);
      return { success: true, quote: q, fallbackMode: true };
    }
    throw err;
  }
}

// 9. GET /admin/overview
export async function apiGetAdminOverview() {
  try {
    return await request("/admin/overview");
  } catch (err) {
    const store = getPortalData();
    return {
      success: true,
      metrics: {
        totalStaff: store.employees.length,
        attendanceToday: store.attendance.length,
        totalQuotes: store.quotations.length,
      },
      fallbackMode: true,
    };
  }
}

// 10. GET /audit-logs
export async function apiGetAuditLogs() {
  try {
    return await request("/audit-logs");
  } catch (err) {
    return {
      success: true,
      logs: [
        {
          id: "AUDIT-LOCAL-001",
          actorName: "Browser Security Engine",
          action: "LOCAL_AUDIT_ACTIVE",
          entityType: "Storage",
          details: "Client-side localStorage encrypted session active.",
          timestamp: new Date().toISOString(),
          severity: "INFO",
        },
      ],
      fallbackMode: true,
    };
  }
}
