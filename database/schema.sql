-- Smart Adaptive Recovery System (SARS)
-- PostgreSQL Schema Definition

-- Drop tables if they exist to allow re-running
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS help_center_articles CASCADE;
DROP TABLE IF EXISTS attachments CASCADE;
DROP TABLE IF EXISTS compensation_requests CASCADE;
DROP TABLE IF EXISTS customer_actions CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS recovery_cases CASCADE;
DROP TABLE IF EXISTS abnormal_events CASCADE;
DROP TABLE IF EXISTS tracking_history CASCADE;
DROP TABLE IF EXISTS shipments CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. users
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. customers
CREATE TABLE customers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    customer_type VARCHAR(30) NOT NULL CHECK (customer_type IN ('ONLINE_SHOPPER', 'ONLINE_MERCHANT', 'INDIVIDUAL_SENDER')),
    preferred_language VARCHAR(5) DEFAULT 'vi' CHECK (preferred_language IN ('vi', 'en')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_customer_type ON customers(customer_type);

-- 3. shipments
CREATE TABLE shipments (
    id BIGSERIAL PRIMARY KEY,
    tracking_id VARCHAR(20) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    sender_name VARCHAR(100) NOT NULL,
    sender_phone VARCHAR(20) NOT NULL,
    receiver_name VARCHAR(100) NOT NULL,
    receiver_phone VARCHAR(20) NOT NULL,
    customer_type VARCHAR(30) NOT NULL,
    parcel_category VARCHAR(30) NOT NULL CHECK (parcel_category IN ('COMMERCIAL_GOODS', 'PERSONAL_ITEMS', 'IMPORTANT_DOCUMENTS', 'ONE_OF_A_KIND', 'FRAGILE')),
    insurance_status VARCHAR(15) NOT NULL CHECK (insurance_status IN ('INSURED', 'NOT_INSURED')),
    current_status VARCHAR(30) NOT NULL CHECK (current_status IN ('CREATED', 'CONFIRMED', 'PREPARING', 'IN_TRANSIT_TO_HUB', 'AT_SORTING_HUB', 'OUT_FOR_DELIVERY', 'DELIVERED', 'ABNORMAL_DELAY_DETECTED')),
    recovery_mode VARCHAR(30),
    declared_value DECIMAL(15,2),
    shipping_fee DECIMAL(10,2),
    estimated_delivery TIMESTAMPTZ,
    delay_stage_index INTEGER,
    is_demo BOOLEAN DEFAULT true,
    simulation_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shipments_tracking_id ON shipments(tracking_id);
CREATE INDEX idx_shipments_customer_id ON shipments(customer_id);
CREATE INDEX idx_shipments_status ON shipments(current_status);
CREATE INDEX idx_shipments_simulation ON shipments(simulation_active);

-- 4. tracking_history
CREATE TABLE tracking_history (
    id BIGSERIAL PRIMARY KEY,
    shipment_id BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    location VARCHAR(200),
    description TEXT,
    is_current BOOLEAN DEFAULT false,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tracking_shipment_id ON tracking_history(shipment_id);
CREATE INDEX idx_tracking_occurred_at ON tracking_history(occurred_at);

-- 5. abnormal_events
CREATE TABLE abnormal_events (
    id BIGSERIAL PRIMARY KEY,
    shipment_id BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('ABNORMAL_DELAY', 'LOST', 'DAMAGED')),
    detected_at_status VARCHAR(30) NOT NULL,
    description TEXT,
    delay_minutes INTEGER,
    auto_resolved BOOLEAN DEFAULT false,
    detected_at TIMESTAMPTZ NOT NULL,
    resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_abnormal_shipment_id ON abnormal_events(shipment_id);
CREATE INDEX idx_abnormal_event_type ON abnormal_events(event_type);

-- 6. recovery_cases
CREATE TABLE recovery_cases (
    id BIGSERIAL PRIMARY KEY,
    case_id VARCHAR(20) UNIQUE NOT NULL,
    shipment_id BIGINT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    customer_type VARCHAR(30) NOT NULL,
    parcel_category VARCHAR(30) NOT NULL,
    insurance_status VARCHAR(15) NOT NULL,
    recovery_mode VARCHAR(30) NOT NULL,
    investigation_status VARCHAR(30) NOT NULL DEFAULT 'CREATED' CHECK (investigation_status IN ('CREATED', 'IN_PROGRESS', 'PARCEL_FOUND', 'CONFIRMED_LOST', 'CLOSED')),
    resolution_type VARCHAR(30) CHECK (resolution_type IN ('PARCEL_FOUND', 'CONFIRMED_LOST', NULL)),
    selected_option VARCHAR(30),
    next_update_at TIMESTAMPTZ,
    estimated_resolution_hours INTEGER DEFAULT 7,
    investigation_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

CREATE INDEX idx_recovery_case_id ON recovery_cases(case_id);
CREATE INDEX idx_recovery_shipment_id ON recovery_cases(shipment_id);
CREATE INDEX idx_recovery_status ON recovery_cases(investigation_status);

-- 7. notifications
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    recovery_case_id BIGINT REFERENCES recovery_cases(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(30) NOT NULL CHECK (notification_type IN ('DELAY_DETECTED', 'INVESTIGATION_UPDATE', 'RESOLUTION_FOUND', 'COMPENSATION_PROCESSED', 'GENERAL')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notif_customer_id ON notifications(customer_id);
CREATE INDEX idx_notif_read_status ON notifications(is_read);

-- 8. customer_actions
CREATE TABLE customer_actions (
    id BIGSERIAL PRIMARY KEY,
    recovery_case_id BIGINT NOT NULL REFERENCES recovery_cases(id) ON DELETE CASCADE,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    action_type VARCHAR(30) NOT NULL CHECK (action_type IN ('SELECT_CONTINUE', 'SELECT_REFUND', 'SELECT_REPLACEMENT', 'CONFIRM_CLOSE')),
    action_details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customer_action_case_id ON customer_actions(recovery_case_id);

-- 9. compensation_requests
CREATE TABLE compensation_requests (
    id BIGSERIAL PRIMARY KEY,
    recovery_case_id BIGINT NOT NULL REFERENCES recovery_cases(id) ON DELETE CASCADE,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    compensation_type VARCHAR(30) NOT NULL CHECK (compensation_type IN ('FULL_VALUE', 'SHIPPING_FEE_4X', 'VOUCHER', 'LOYALTY_POINTS')),
    compensation_amount DECIMAL(15,2),
    currency VARCHAR(5) DEFAULT 'VND',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'PROCESSED')),
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_compensation_case_id ON compensation_requests(recovery_case_id);
CREATE INDEX idx_compensation_status ON compensation_requests(status);

-- 10. attachments
CREATE TABLE attachments (
    id BIGSERIAL PRIMARY KEY,
    recovery_case_id BIGINT NOT NULL REFERENCES recovery_cases(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. help_center_articles
CREATE TABLE help_center_articles (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('FAQ', 'POLICY', 'GUIDE')),
    title_vi VARCHAR(200) NOT NULL,
    content_vi TEXT NOT NULL,
    title_en VARCHAR(200) NOT NULL,
    content_en TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_help_slug ON help_center_articles(slug);
CREATE INDEX idx_help_category ON help_center_articles(category);

-- 12. audit_logs
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    performed_by VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at);
