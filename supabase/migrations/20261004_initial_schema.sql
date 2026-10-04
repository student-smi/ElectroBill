-- ElectroBill Multi-Tenant Database Architecture with Supabase Row Level Security (RLS)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Shops / Tenants
CREATE TABLE shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Maharashtra',
    pincode VARCHAR(10) NOT NULL,
    gstin VARCHAR(20),
    pan VARCHAR(20),
    logo_url TEXT,
    invoice_prefix VARCHAR(10) DEFAULT 'EB-',
    next_invoice_number INT DEFAULT 1001,
    terms_and_conditions TEXT DEFAULT 'Goods once sold are tested. Warranty as per manufacturer policy.',
    plan VARCHAR(20) DEFAULT 'BASIC',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash TEXT NOT NULL,
    role VARCHAR(30) DEFAULT 'CASHIER', -- 'SUPER_ADMIN', 'SHOP_OWNER', 'MANAGER', 'CASHIER'
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Categories & Brands
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    UNIQUE(shop_id, name)
);

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    UNIQUE(shop_id, name)
);

-- 5. Products (Electrical Optimized with Wire Meter Specs & Tier Pricing)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id),
    brand_id UUID REFERENCES brands(id),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    barcode VARCHAR(100),
    description TEXT,
    unit VARCHAR(20) DEFAULT 'PIECE', -- 'PIECE', 'METER', 'BOX', 'BUNDLE', 'ROLL', 'PACKET', 'SET'
    
    -- Multi-tier pricing for electrical market
    purchase_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    retail_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    electrician_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    contractor_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    wholesale_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    
    gst_rate DECIMAL(5, 2) DEFAULT 18.0,
    hsn_code VARCHAR(20) DEFAULT '8536',
    
    opening_stock DECIMAL(12, 2) DEFAULT 0,
    current_stock DECIMAL(12, 2) DEFAULT 0,
    min_stock_alert DECIMAL(12, 2) DEFAULT 10,
    
    -- Wire & Cable Specific Specifications
    is_cable BOOLEAN DEFAULT FALSE,
    cable_type VARCHAR(50),
    core_count INT,
    cross_section VARCHAR(50),
    wire_color VARCHAR(30),
    
    warranty_months INT DEFAULT 0,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(shop_id, sku)
);

-- 6. Customers & Udhaar / Credit Ledger
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    customer_type VARCHAR(30) DEFAULT 'NORMAL', -- 'NORMAL', 'ELECTRICIAN', 'CONTRACTOR', 'BUILDER', 'COMPANY'
    gstin VARCHAR(20),
    opening_balance DECIMAL(12, 2) DEFAULT 0,
    credit_limit DECIMAL(12, 2) DEFAULT 50000,
    current_udhaar DECIMAL(12, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE customer_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    invoice_id UUID,
    amount DECIMAL(12, 2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'DEBIT' (Udhaar), 'CREDIT' (Payment)
    payment_method VARCHAR(30) DEFAULT 'CASH',
    reference_no VARCHAR(100),
    notes TEXT,
    balance_after DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Suppliers & Purchases
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    gstin VARCHAR(20),
    total_purchases DECIMAL(12, 2) DEFAULT 0,
    pending_amount DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    purchase_number VARCHAR(100) NOT NULL,
    bill_number VARCHAR(100),
    purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    subtotal DECIMAL(12, 2) NOT NULL,
    tax_amount DECIMAL(12, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    due_amount DECIMAL(12, 2) DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'UNPAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(shop_id, purchase_number)
);

-- 8. Invoices & Line Items
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    user_id UUID REFERENCES users(id),
    invoice_number VARCHAR(100) NOT NULL,
    invoice_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_type VARCHAR(30) DEFAULT 'NORMAL',
    customer_gstin VARCHAR(20),
    customer_address TEXT,
    
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    discount_rate DECIMAL(5, 2) DEFAULT 0,
    taxable_amount DECIMAL(12, 2) NOT NULL,
    cgst_amount DECIMAL(12, 2) DEFAULT 0,
    sgst_amount DECIMAL(12, 2) DEFAULT 0,
    igst_amount DECIMAL(12, 2) DEFAULT 0,
    total_tax DECIMAL(12, 2) NOT NULL,
    round_off DECIMAL(12, 2) DEFAULT 0,
    grand_total DECIMAL(12, 2) NOT NULL,
    
    payment_method VARCHAR(30) DEFAULT 'CASH',
    payment_status VARCHAR(20) DEFAULT 'PAID',
    paid_amount DECIMAL(12, 2) NOT NULL,
    due_amount DECIMAL(12, 2) DEFAULT 0,
    
    notes TEXT,
    is_returned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(shop_id, invoice_number)
);

CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    hsn_code VARCHAR(20) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    rate DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    taxable_value DECIMAL(12, 2) NOT NULL,
    gst_rate DECIMAL(5, 2) NOT NULL,
    gst_amount DECIMAL(12, 2) NOT NULL,
    total DECIMAL(12, 2) NOT NULL,
    warranty_months INT DEFAULT 0,
    warranty_expiry TIMESTAMP WITH TIME ZONE
);

-- 9. Audit Logs & Notifications
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    previous_value JSONB,
    new_value JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to extract user's current shop_id from JWT session claims
CREATE OR REPLACE FUNCTION current_user_shop_id() RETURNS UUID AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'shop_id', '')::UUID;
$$ LANGUAGE SQL STABLE;

-- Shop isolation policies
CREATE POLICY shop_isolation_products ON products
  FOR ALL
  USING (shop_id = current_user_shop_id())
  WITH CHECK (shop_id = current_user_shop_id());

CREATE POLICY shop_isolation_customers ON customers
  FOR ALL
  USING (shop_id = current_user_shop_id())
  WITH CHECK (shop_id = current_user_shop_id());

CREATE POLICY shop_isolation_invoices ON invoices
  FOR ALL
  USING (shop_id = current_user_shop_id())
  WITH CHECK (shop_id = current_user_shop_id());
