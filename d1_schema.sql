-- ElectroBill Cloudflare D1 Database Schema

CREATE TABLE IF NOT EXISTS shops (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT DEFAULT 'Maharashtra',
    pincode TEXT NOT NULL,
    gstin TEXT,
    invoice_prefix TEXT DEFAULT 'EB-',
    next_invoice_number INTEGER DEFAULT 1001,
    terms_and_conditions TEXT,
    plan TEXT DEFAULT 'PRO',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL REFERENCES shops(id),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'SHOP_OWNER',
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL REFERENCES shops(id),
    category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    sku TEXT NOT NULL,
    barcode TEXT,
    unit TEXT DEFAULT 'PIECE',
    purchase_price REAL DEFAULT 0,
    retail_price REAL DEFAULT 0,
    electrician_price REAL DEFAULT 0,
    contractor_price REAL DEFAULT 0,
    gst_rate REAL DEFAULT 18.0,
    hsn_code TEXT DEFAULT '8536',
    current_stock REAL DEFAULT 0,
    min_stock_alert REAL DEFAULT 10,
    is_cable INTEGER DEFAULT 0,
    cross_section TEXT,
    wire_color TEXT,
    warranty_months INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL REFERENCES shops(id),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    customer_type TEXT DEFAULT 'NORMAL',
    credit_limit REAL DEFAULT 50000,
    current_udhaar REAL DEFAULT 0,
    commission_balance REAL DEFAULT 0,
    total_purchases REAL DEFAULT 0,
    total_paid REAL DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL REFERENCES shops(id),
    customer_id TEXT,
    invoice_number TEXT NOT NULL,
    invoice_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_type TEXT DEFAULT 'NORMAL',
    site_name TEXT,
    is_estimate INTEGER DEFAULT 0,
    subtotal REAL NOT NULL,
    discount_amount REAL DEFAULT 0,
    taxable_amount REAL NOT NULL,
    total_tax REAL NOT NULL,
    grand_total REAL NOT NULL,
    payment_method TEXT DEFAULT 'CASH',
    payment_status TEXT DEFAULT 'PAID',
    paid_amount REAL NOT NULL,
    due_amount REAL DEFAULT 0,
    notes TEXT
);

-- Seed initial shop
INSERT OR IGNORE INTO shops (id, name, slug, owner_name, email, phone, address, city, state, pincode, gstin)
VALUES ('shop-1', 'Shree Ram Electric & Hardware', 'shree-ram-electric', 'Smit Panchal', 'smitpanchal734@gmail.com', '9876543210', 'Shop No 4, Mahavir Darshan, LBS Marg', 'Mumbai', 'Maharashtra', '400086', '27AABCS1429B1Z8');

-- Seed initial admin user
INSERT OR IGNORE INTO users (id, shop_id, name, email, phone, role)
VALUES ('usr-1', 'shop-1', 'Smit Panchal', 'smitpanchal734@gmail.com', '9876543210', 'SHOP_OWNER');
