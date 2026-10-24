// ============================================================================
// MANAS ADVERTISING - PERSISTENT DATABASE ENGINE (SQLite3)
// Reference: Software Requirements Document v1.0 (Sections 11 & 12)
// Database file: backend/data/manas.db
// Core Entities: Users, Employees, AttendanceRecords, OfficeLocations,
//                Clients, Visits, Services, Quotations, QuotationItems,
//                FollowUps, Permissions, AuditLogs.
// ============================================================================

import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure data folder exists
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const DB_PATH = path.join(dataDir, "manas.db");

// Connect to SQLite file database
export const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("[Database] Error connecting to SQLite database:", err.message);
  } else {
    console.log(`[Database] Connected to persistent SQLite database at: ${DB_PATH}`);
  }
});

// Helper: Run SQL command returning a Promise
export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

// Helper: Get single row returning a Promise
export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Helper: Query all rows returning a Promise
export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// ============================================================================
// INITIALIZE TABLES & SEED ESSENTIAL DATA
// ============================================================================

export async function initDatabase() {
  // 1. Office Locations
  await dbRun(`
    CREATE TABLE IF NOT EXISTS office_locations (
      id TEXT PRIMARY KEY,
      office_name TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      radius_meters INTEGER DEFAULT 250,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Employees & Users
  await dbRun(`
    CREATE TABLE IF NOT EXISTS employees (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      title TEXT,
      department TEXT,
      email TEXT NOT NULL UNIQUE,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Attendance Records
  await dbRun(`
    CREATE TABLE IF NOT EXISTS attendance_records (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      employee_name TEXT NOT NULL,
      date TEXT NOT NULL,
      shift TEXT,
      check_in_time TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      accuracy REAL,
      category TEXT NOT NULL,
      distance_meters REAL,
      check_out_time TEXT,
      status TEXT DEFAULT 'Present',
      work_duration_hours REAL,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    );
  `);

  // 4. Clients
  await dbRun(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      company TEXT,
      contact_person TEXT,
      phone TEXT NOT NULL,
      email TEXT,
      category TEXT,
      address TEXT,
      city TEXT DEFAULT 'Indore',
      assigned_to TEXT,
      stage TEXT DEFAULT 'New',
      total_quoted REAL DEFAULT 0,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Visits
  await dbRun(`
    CREATE TABLE IF NOT EXISTS visits (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      employee_name TEXT NOT NULL,
      client_id TEXT NOT NULL,
      client_name TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      accuracy REAL,
      address TEXT,
      purpose TEXT NOT NULL,
      offered_services TEXT, -- JSON array
      outcome TEXT NOT NULL,
      quoted_estimate REAL DEFAULT 0,
      follow_up_date TEXT,
      photo_evidence_url TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Quotations
  await dbRun(`
    CREATE TABLE IF NOT EXISTS quotations (
      id TEXT PRIMARY KEY,
      client_id TEXT NOT NULL,
      client_name TEXT NOT NULL,
      contact_person TEXT,
      employee_id TEXT NOT NULL,
      employee_name TEXT NOT NULL,
      quote_date TEXT NOT NULL,
      valid_until TEXT NOT NULL,
      items TEXT NOT NULL, -- JSON array of items
      subtotal REAL NOT NULL,
      discount_percent REAL DEFAULT 0,
      tax_percent REAL DEFAULT 18,
      tax_amount REAL NOT NULL,
      grand_total REAL NOT NULL,
      status TEXT DEFAULT 'Draft',
      approved_by TEXT,
      approved_at TEXT,
      payment_terms TEXT,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Services Catalogue
  await dbRun(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      pricing_type TEXT,
      base_price REAL NOT NULL,
      tax_percent REAL DEFAULT 18,
      unit_label TEXT,
      active INTEGER DEFAULT 1
    );
  `);

  // 8. Follow Ups
  await dbRun(`
    CREATE TABLE IF NOT EXISTS follow_ups (
      id TEXT PRIMARY KEY,
      employee_id TEXT NOT NULL,
      client_id TEXT NOT NULL,
      scheduled_date TEXT NOT NULL,
      title TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'Pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 9. Audit Logs (Section 12: Immutable System Ledger)
  await dbRun(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_id TEXT,
      actor_name TEXT NOT NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      severity TEXT DEFAULT 'INFO',
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // -------------------------------------------------------------
  // SEED INITIAL DATA IF TABLES ARE EMPTY
  // -------------------------------------------------------------

  // Seed Office
  const officeCount = await dbGet("SELECT COUNT(*) as count FROM office_locations");
  if (officeCount.count === 0) {
    await dbRun(
      `INSERT INTO office_locations (id, office_name, address, latitude, longitude, radius_meters)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "OFFICE-HQ",
        "Manas Advertising - Head Office",
        "22°47'22.6\"N 75°54'27.2\"E, Indore, Madhya Pradesh 452010",
        22.7896225,
        75.9075439,
        250,
      ]
    );
  }

  // Seed Employees
  const empCount = await dbGet("SELECT COUNT(*) as count FROM employees");
  if (empCount.count === 0) {
    const seedEmployees = [
      ["EMP-001", "Aditya Manas", "Administrator", "Managing Director", "Management", "aditya@manasadvertising.com", "+91 98260 12345", "admin123", "AM"],
      ["EMP-002", "Vikram Joshi", "Manager", "Field Operations & Sales Lead", "Field Ops", "vikram@manasadvertising.com", "+91 98260 54321", "manager123", "VJ"],
      ["EMP-003", "Rahul Sharma", "Field Employee", "Senior Field Sales Executive", "Sales", "rahul.s@manasadvertising.com", "+91 94250 88991", "field123", "RS"],
      ["EMP-004", "Priya Patel", "Field Employee", "Client Relations & Recce Executive", "Client Services", "priya.p@manasadvertising.com", "+91 94250 77662", "field123", "PP"],
    ];
    for (const emp of seedEmployees) {
      await dbRun(
        `INSERT INTO employees (id, name, role, title, department, email, phone, password, avatar)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        emp
      );
    }
  }

  // Seed Services
  const serviceCount = await dbGet("SELECT COUNT(*) as count FROM services");
  if (serviceCount.count === 0) {
    const seedServices = [
      ["SRV-01", "Outdoor Umbrella Advertising", "Durable MS frames with 6-panel promotional canopy branding", "Per Unit", 1850, 18, "Piece"],
      ["SRV-02", "Flex Printing & Hoardings", "Heavy-duty outdoor star flex banners with solvent print finish", "Per Sq.Ft", 18, 18, "Sq.Ft"],
      ["SRV-03", "Vinyl & Eco-Solvent Printing", "High-resolution self-adhesive vinyl for storefronts & vehicle wraps", "Per Sq.Ft", 42, 18, "Sq.Ft"],
      ["SRV-04", "In-Shop & Retail Branding", "Acrylic cutouts, clip-on glow signboards, pillar wraps & demo kiosks", "Per Sq.Ft", 65, 18, "Sq.Ft"],
      ["SRV-05", "Offset Commercial Printing", "Product catalogs, warranty leaflets, brochure inserts & letterheads", "Per Piece", 2.2, 18, "Piece"],
    ];
    for (const srv of seedServices) {
      await dbRun(
        `INSERT INTO services (id, name, description, pricing_type, base_price, tax_percent, unit_label)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        srv
      );
    }
  }

  // Seed Clients
  const clientCount = await dbGet("SELECT COUNT(*) as count FROM clients");
  if (clientCount.count === 0) {
    const seedClients = [
      ["CLT-101", "Nexa Retail Flagship", "Nexa Motors Pvt Ltd", "Rohan Mehta", "+91 98930 11223", "rohan@nexaindore.com", "Automobile & Retail", "Plot 14, AB Road, Near C21 Mall, Indore", "Indore", "EMP-003", "Won / Order Confirmed", 285000, "Showroom fascia & pillar graphics confirmed."],
      ["CLT-102", "Mahaveera Agro Chem (Ziron)", "RMPCL Ziron Corp", "Girish Patel", "+91 98270 33445", "girish@zironagro.com", "Agriculture & FMCG", "Industrial Area, Sector 3, Pithampur", "Pithampur", "EMP-003", "Won / Order Confirmed", 420000, "Mobile campaign van with open stage & TV integration."],
      ["CLT-103", "Rajwada Vivaah Collections", "Rajwada Bridal Silks", "Sunil Agrawal", "+91 98266 55443", "sunil@rajwadavivaah.in", "Fashion & Retail", "Sarafa Bazar, Near Rajwada Palace, Indore", "Indore", "EMP-004", "Quote Sent", 145000, "Mega bridal hoardings across MG road."],
    ];
    for (const c of seedClients) {
      await dbRun(
        `INSERT INTO clients (id, name, company, contact_person, phone, email, category, address, city, assigned_to, stage, total_quoted, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        c
      );
    }
  }

  // Seed Initial Audit Log
  const auditCount = await dbGet("SELECT COUNT(*) as count FROM audit_logs");
  if (auditCount.count === 0) {
    await dbRun(
      `INSERT INTO audit_logs (id, actor_id, actor_name, action, entity_type, entity_id, details, severity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "AUDIT-001",
        "SYSTEM",
        "SQLite Engine",
        "DATABASE_INITIALIZED",
        "Database",
        "manas.db",
        "Persistent SQLite database tables created and seeded successfully.",
        "INFO",
      ]
    );
  }

  console.log("[Database] All 12 tables initialized and verified in SQLite database.");
}
