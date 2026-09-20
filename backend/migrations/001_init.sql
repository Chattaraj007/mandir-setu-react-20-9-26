-- Mandir Setu Database Schema Migration
-- Database: PostgreSQL 16+

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Devotees, Priests, Trustees, Super Admins)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL CHECK (role IN ('DEVOTEE', 'PRIEST', 'TRUSTEE', 'SUPER_ADMIN')),
    assigned_temple_id UUID,
    gotra VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Temples Table
CREATE TABLE IF NOT EXISTS temples (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en VARCHAR(255) NOT NULL,
    name_bn VARCHAR(255) NOT NULL,
    deity_en VARCHAR(150) NOT NULL,
    deity_bn VARCHAR(150) NOT NULL,
    district_en VARCHAR(100) NOT NULL,
    district_bn VARCHAR(100) NOT NULL,
    location_en VARCHAR(255) NOT NULL,
    location_bn VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    darshan_timings VARCHAR(100),
    aarti_timings VARCHAR(100),
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Foreign key for user assigned temple
ALTER TABLE users ADD CONSTRAINT fk_user_temple FOREIGN KEY (assigned_temple_id) REFERENCES temples(id) ON DELETE SET NULL;

-- 3. Puja Offerings Table
CREATE TABLE IF NOT EXISTS puja_offerings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    temple_id UUID REFERENCES temples(id) ON DELETE CASCADE,
    title_en VARCHAR(200) NOT NULL,
    title_bn VARCHAR(200) NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    base_price NUMERIC(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    temple_id UUID REFERENCES temples(id) ON DELETE CASCADE,
    offering_id UUID REFERENCES puja_offerings(id) ON DELETE SET NULL,
    devotee_name VARCHAR(150) NOT NULL,
    devotee_phone VARCHAR(20) NOT NULL,
    gotra VARCHAR(100),
    puja_date DATE NOT NULL,
    tithi_time VARCHAR(100),
    sankalp_wish TEXT,
    prasad_address TEXT,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'PAID' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    booking_status VARCHAR(50) DEFAULT 'PENDING' CHECK (booking_status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
    assigned_priest_name VARCHAR(150),
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Donations & Chadhava Table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    temple_id UUID REFERENCES temples(id) ON DELETE CASCADE,
    donor_name VARCHAR(150) NOT NULL,
    cause_type VARCHAR(100) NOT NULL, -- e.g., 'GAU_SEVA', 'TEMPLE_RENOVATION', 'ANNADAN', 'GENERAL'
    amount NUMERIC(10, 2) NOT NULL,
    gotra VARCHAR(100),
    payment_method VARCHAR(50) DEFAULT 'UPI',
    transaction_ref VARCHAR(100),
    status VARCHAR(50) DEFAULT 'SUCCESS',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_temple ON bookings(temple_id);
CREATE INDEX IF NOT EXISTS idx_donations_temple ON donations(temple_id);
