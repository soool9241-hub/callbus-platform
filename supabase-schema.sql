-- ============================================================
-- 콜버스 플랫폼 - Supabase Database Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'driver', 'admin')),
    name TEXT NOT NULL DEFAULT '',
    phone TEXT,
    email TEXT,
    profile_image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. drivers table
CREATE TABLE public.drivers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    company_name TEXT,
    business_number TEXT,
    license_type TEXT,
    license_number TEXT,
    region TEXT[] DEFAULT '{}',
    rating NUMERIC(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    total_trips INTEGER DEFAULT 0,
    approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    bank_name TEXT,
    bank_account TEXT,
    bank_holder TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. vehicles
CREATE TABLE public.vehicles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE CASCADE NOT NULL,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('minivan_15', 'bus_25', 'bus_45', 'limousine', 'premium', 'solati', 'sprinter')),
    vehicle_name TEXT NOT NULL,
    plate_number TEXT UNIQUE NOT NULL,
    seats INTEGER NOT NULL,
    year INTEGER NOT NULL,
    photos TEXT[] DEFAULT '{}',
    options TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. quote_requests
CREATE TABLE public.quote_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    request_number TEXT UNIQUE NOT NULL,
    departure_address TEXT NOT NULL,
    departure_lat NUMERIC(10,7),
    departure_lng NUMERIC(10,7),
    destination_address TEXT NOT NULL,
    destination_lat NUMERIC(10,7),
    destination_lng NUMERIC(10,7),
    waypoints JSONB DEFAULT '[]',
    departure_datetime TIMESTAMPTZ NOT NULL,
    return_datetime TIMESTAMPTZ,
    trip_type TEXT DEFAULT 'round' CHECK (trip_type IN ('one_way', 'round')),
    passenger_count INTEGER NOT NULL,
    vehicle_type TEXT[] NOT NULL,
    purpose TEXT,
    special_requests TEXT,
    contact_phone TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'reserved', 'completed', 'cancelled', 'expired')),
    quote_count INTEGER DEFAULT 0,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. quotes
CREATE TABLE public.quotes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_id UUID REFERENCES public.quote_requests(id) NOT NULL,
    driver_id UUID REFERENCES public.drivers(id) NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
    base_price INTEGER NOT NULL,
    toll_fee INTEGER DEFAULT 0,
    meal_fee INTEGER DEFAULT 0,
    parking_fee INTEGER DEFAULT 0,
    extra_fees JSONB DEFAULT '{}',
    total_price INTEGER NOT NULL,
    vat_included BOOLEAN DEFAULT true,
    message TEXT,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'selected', 'rejected', 'expired')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(request_id, driver_id)
);

-- 6. reservations
CREATE TABLE public.reservations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reservation_number TEXT UNIQUE NOT NULL,
    quote_id UUID REFERENCES public.quotes(id) NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    driver_id UUID REFERENCES public.drivers(id) NOT NULL,
    total_amount INTEGER NOT NULL,
    deposit_amount INTEGER NOT NULL,
    deposit_rate NUMERIC(3,2) DEFAULT 0.20,
    remaining_amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'deposit_paid', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded')),
    driver_deposit INTEGER DEFAULT 0,
    cancellation_reason TEXT,
    cancelled_by TEXT CHECK (cancelled_by IN ('customer', 'driver', 'admin')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 7. reviews
CREATE TABLE public.reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reservation_id UUID REFERENCES public.reservations(id) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    driver_id UUID REFERENCES public.drivers(id) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    content TEXT,
    photos TEXT[] DEFAULT '{}',
    driver_reply TEXT,
    driver_replied_at TIMESTAMPTZ,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. chat_rooms
CREATE TABLE public.chat_rooms (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_id UUID REFERENCES public.quote_requests(id),
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    driver_id UUID REFERENCES public.profiles(id) NOT NULL,
    last_message TEXT,
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. chat_messages
CREATE TABLE public.chat_messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) NOT NULL,
    message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'system')),
    content TEXT NOT NULL,
    image_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. notifications
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============= INDEXES =============
CREATE INDEX idx_quote_requests_status ON quote_requests(status, created_at DESC);
CREATE INDEX idx_quote_requests_customer ON quote_requests(customer_id);
CREATE INDEX idx_quotes_request ON quotes(request_id);
CREATE INDEX idx_quotes_driver ON quotes(driver_id);
CREATE INDEX idx_reservations_customer ON reservations(customer_id);
CREATE INDEX idx_reservations_driver ON reservations(driver_id);
CREATE INDEX idx_chat_messages_room ON chat_messages(room_id, created_at);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ============= TRIGGERS =============
-- Auto-increment quote_count
CREATE OR REPLACE FUNCTION update_quote_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE quote_requests SET quote_count = quote_count + 1, updated_at = now() WHERE id = NEW.request_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_quote_count AFTER INSERT ON quotes FOR EACH ROW EXECUTE FUNCTION update_quote_count();

-- Auto-update driver rating
CREATE OR REPLACE FUNCTION update_driver_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE drivers SET
        rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE driver_id = NEW.driver_id AND is_visible = true),
        review_count = (SELECT COUNT(*) FROM reviews WHERE driver_id = NEW.driver_id AND is_visible = true),
        updated_at = now()
    WHERE id = NEW.driver_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_driver_rating AFTER INSERT OR UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_driver_rating();

-- Auto-calculate total_price
CREATE OR REPLACE FUNCTION calculate_total_price()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_price := NEW.base_price + COALESCE(NEW.toll_fee, 0) + COALESCE(NEW.meal_fee, 0) + COALESCE(NEW.parking_fee, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_quote_total BEFORE INSERT OR UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION calculate_total_price();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============= RLS POLICIES =============
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "profiles_read" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Drivers: anyone can read approved, own can manage
CREATE POLICY "drivers_read" ON drivers FOR SELECT USING (true);
CREATE POLICY "drivers_insert_own" ON drivers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "drivers_update_own" ON drivers FOR UPDATE USING (auth.uid() = user_id);

-- Vehicles: anyone can read, driver can manage own
CREATE POLICY "vehicles_read" ON vehicles FOR SELECT USING (true);
CREATE POLICY "vehicles_manage" ON vehicles FOR ALL USING (
    driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
);

-- Quote requests: anyone can read open ones, customer manages own
CREATE POLICY "qr_read" ON quote_requests FOR SELECT USING (true);
CREATE POLICY "qr_insert" ON quote_requests FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "qr_update_own" ON quote_requests FOR UPDATE USING (auth.uid() = customer_id);

-- Quotes: readable by request owner and driver, driver manages own
CREATE POLICY "quotes_read" ON quotes FOR SELECT USING (true);
CREATE POLICY "quotes_insert" ON quotes FOR INSERT WITH CHECK (
    driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
);
CREATE POLICY "quotes_update" ON quotes FOR UPDATE USING (
    driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
);

-- Reservations: participants can read
CREATE POLICY "reservations_read" ON reservations FOR SELECT USING (
    auth.uid() = customer_id OR
    auth.uid() IN (SELECT user_id FROM drivers WHERE id = driver_id)
);
CREATE POLICY "reservations_insert" ON reservations FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Reviews: anyone can read visible, customer can create
CREATE POLICY "reviews_read" ON reviews FOR SELECT USING (is_visible = true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Chat: participants only
CREATE POLICY "chat_rooms_access" ON chat_rooms FOR SELECT USING (
    auth.uid() = customer_id OR auth.uid() = driver_id
);
CREATE POLICY "chat_messages_access" ON chat_messages FOR SELECT USING (
    room_id IN (SELECT id FROM chat_rooms WHERE customer_id = auth.uid() OR driver_id = auth.uid())
);
CREATE POLICY "chat_messages_insert" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications: own only
CREATE POLICY "notifications_own" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ============= ENABLE REALTIME =============
ALTER PUBLICATION supabase_realtime ADD TABLE quote_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE quotes;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============= SEED DATA =============
-- Insert some demo data after user signs up
