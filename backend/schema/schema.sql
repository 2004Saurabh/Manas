-- ============================================================================
-- MANAS ADVERTISING - FIELD MANAGEMENT & ATTENDANCE SYSTEM
-- PostgreSQL Database Schema (DDL)
-- Reference: Software Requirements Document v1.0 (Sections 11 & 12)
-- Core Entities: Users, Employees, AttendanceRecords, OfficeLocations,
--                Clients, Visits, Services, Quotations, QuotationItems,
--                FollowUps, Permissions, AuditLogs.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Office Locations & Geofence Coordinates
CREATE TABLE office_locations (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    office_name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    radius_meters INTEGER NOT NULL DEFAULT 250,
    is_headquarters BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (Authentication & Credentials)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Administrator', 'Manager', 'Field Employee')),
    active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Employees (Profile & Operational Hierarchy)
CREATE TABLE employees (
    id VARCHAR(30) PRIMARY KEY, -- e.g. EMP-001
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(120) NOT NULL,
    title VARCHAR(100),
    department VARCHAR(80),
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    avatar_initials VARCHAR(5),
    role VARCHAR(50) NOT NULL,
    reporting_manager_id VARCHAR(30) REFERENCES employees(id),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Permissions (Role & User Matrix)
CREATE TABLE permissions (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    role VARCHAR(50) NOT NULL,
    resource VARCHAR(80) NOT NULL,
    can_create BOOLEAN DEFAULT FALSE,
    can_read BOOLEAN DEFAULT TRUE,
    can_update BOOLEAN DEFAULT FALSE,
    can_delete BOOLEAN DEFAULT FALSE,
    can_approve BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Clients (CRM Accounts & Directory)
CREATE TABLE clients (
    id VARCHAR(30) PRIMARY KEY, -- e.g. CLT-101
    name VARCHAR(150) NOT NULL,
    company VARCHAR(150),
    contact_person VARCHAR(120),
    phone VARCHAR(25) NOT NULL,
    email VARCHAR(150),
    category VARCHAR(80),
    address TEXT,
    city VARCHAR(80) DEFAULT 'Indore',
    assigned_to_employee_id VARCHAR(30) REFERENCES employees(id),
    pipeline_stage VARCHAR(50) DEFAULT 'New' CHECK (pipeline_stage IN ('New', 'Meeting Done', 'Quote Sent', 'Won / Order Confirmed', 'Lost')),
    total_quoted_amount NUMERIC(12, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Services & Product Catalogue
CREATE TABLE services (
    id VARCHAR(30) PRIMARY KEY, -- e.g. SRV-01
    name VARCHAR(120) NOT NULL,
    description TEXT,
    pricing_type VARCHAR(50) NOT NULL, -- e.g. Per Unit, Per Sq.Ft, Per Pc
    base_price NUMERIC(10, 2) NOT NULL,
    tax_rate_percent NUMERIC(5, 2) DEFAULT 18.00, -- 18% GST standard
    unit_label VARCHAR(30),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Attendance Records (GPS Check-in / Check-out)
CREATE TABLE attendance_records (
    id VARCHAR(30) PRIMARY KEY, -- e.g. ATT-2026-001
    employee_id VARCHAR(30) NOT NULL REFERENCES employees(id),
    punch_date DATE NOT NULL,
    shift_name VARCHAR(100) DEFAULT 'General Shift (09:30 AM - 06:30 PM)',
    check_in_time TIME NOT NULL,
    check_in_latitude NUMERIC(10, 7) NOT NULL,
    check_in_longitude NUMERIC(10, 7) NOT NULL,
    check_in_accuracy_meters NUMERIC(8, 2),
    check_in_category VARCHAR(30) NOT NULL CHECK (check_in_category IN ('Office', 'Field', 'Exception')),
    distance_from_office_meters NUMERIC(10, 2),
    check_out_time TIME,
    check_out_latitude NUMERIC(10, 7),
    check_out_longitude NUMERIC(10, 7),
    check_out_accuracy_meters NUMERIC(8, 2),
    status VARCHAR(30) DEFAULT 'Present' CHECK (status IN ('Present', 'Half Day', 'Late', 'Field Verified')),
    work_duration_hours NUMERIC(5, 2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Client Visits (Field Verification & Recce Events)
CREATE TABLE visits (
    id VARCHAR(30) PRIMARY KEY, -- e.g. VST-2026-001
    employee_id VARCHAR(30) NOT NULL REFERENCES employees(id),
    client_id VARCHAR(30) NOT NULL REFERENCES clients(id),
    client_name VARCHAR(150) NOT NULL,
    visit_date DATE NOT NULL,
    visit_time TIME NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    location_accuracy_meters NUMERIC(8, 2),
    location_address TEXT,
    purpose VARCHAR(100) NOT NULL, -- e.g. First Meeting, Recce, Quotation Discussion, Final Signoff
    offered_services JSONB, -- Array of selected services
    outcome TEXT NOT NULL,
    quoted_estimate NUMERIC(12, 2) DEFAULT 0.00,
    follow_up_date DATE,
    photo_evidence_url TEXT,
    is_gps_spoofed_flag BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Quotations (Commercial Proposals & Orders)
CREATE TABLE quotations (
    id VARCHAR(30) PRIMARY KEY, -- e.g. QT-2026-001
    client_id VARCHAR(30) NOT NULL REFERENCES clients(id),
    client_name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(120),
    employee_id VARCHAR(30) NOT NULL REFERENCES employees(id),
    employee_name VARCHAR(120) NOT NULL,
    quote_date DATE NOT NULL,
    valid_until_date DATE NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_percent NUMERIC(5, 2) DEFAULT 0.00,
    tax_rate_percent NUMERIC(5, 2) DEFAULT 18.00, -- 18% GST
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    grand_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Pending Approval', 'Approved', 'Sent to Client', 'Order Confirmed', 'Rejected')),
    approved_by_employee_id VARCHAR(30) REFERENCES employees(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    pdf_document_url TEXT,
    payment_terms TEXT DEFAULT '50% Advance with Purchase Order, 50% upon delivery/installation.',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Quotation Items (Line Items with Pricing)
CREATE TABLE quotation_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_id VARCHAR(30) NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    service_id VARCHAR(30) REFERENCES services(id),
    description TEXT NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
    unit_label VARCHAR(30) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    line_total NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Follow Ups (Automated Tasks & Deadlines)
CREATE TABLE follow_ups (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(30) NOT NULL REFERENCES employees(id),
    client_id VARCHAR(30) NOT NULL REFERENCES clients(id),
    visit_id VARCHAR(30) REFERENCES visits(id),
    quotation_id VARCHAR(30) REFERENCES quotations(id),
    scheduled_date DATE NOT NULL,
    title VARCHAR(150) NOT NULL,
    notes TEXT,
    status VARCHAR(30) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Cancelled', 'Overdue')),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Audit Logs (Section 12: Immutable System & Security Ledger)
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_employee_id VARCHAR(30) REFERENCES employees(id),
    actor_name VARCHAR(120) NOT NULL,
    action VARCHAR(80) NOT NULL, -- e.g. AUTH_LOGIN, PUNCH_CHECK_IN, VISIT_RECORDED, QUOTE_STATUS_CHANGE
    entity_type VARCHAR(50) NOT NULL, -- e.g. Attendance, Visit, Quotation, Geofence
    entity_id VARCHAR(50),
    ip_address VARCHAR(45),
    user_agent TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    details JSONB,
    severity VARCHAR(20) DEFAULT 'INFO' CHECK (severity IN ('INFO', 'WARNING', 'EXCEPTION', 'SECURITY')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance & Query Indexes
CREATE INDEX idx_attendance_emp_date ON attendance_records(employee_id, punch_date);
CREATE INDEX idx_visits_client ON visits(client_id);
CREATE INDEX idx_visits_emp_date ON visits(employee_id, visit_date);
CREATE INDEX idx_quotations_client ON quotations(client_id);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_clients_assigned ON clients(assigned_to_employee_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
