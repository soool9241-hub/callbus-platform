-- ============================================================
-- 콜버스 플랫폼 v3.1 - Additive Schema Migration
-- Run this AFTER supabase-schema.sql has been applied.
-- ============================================================

-- ============================================================
-- 1. ALTER profiles: add 'pension_owner' role
-- ============================================================
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('customer', 'driver', 'admin', 'pension_owner'));

-- ============================================================
-- 2. Update handle_new_user() to support pension_owner role
--    and auto-create a pension_owners row when role = 'pension_owner'
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    _role TEXT;
BEGIN
    _role := COALESCE(NEW.raw_user_meta_data->>'role', 'customer');

    INSERT INTO public.profiles (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        _role
    );

    -- If signing up as pension_owner, seed the pension_owners row
    IF _role = 'pension_owner' THEN
        INSERT INTO public.pension_owners (user_id, business_name, representative_name, phone)
        VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'business_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'name', ''),
            COALESCE(NEW.raw_user_meta_data->>'phone', '')
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 3. Add insurance fields to drivers
-- ============================================================
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS insurance_expires_at TIMESTAMPTZ;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS insurance_verified BOOLEAN DEFAULT false;

-- ============================================================
-- 4. Add amenities to vehicles
-- ============================================================
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT '{}';

-- ============================================================
-- 5. Extend quote_requests
-- ============================================================
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS requester_type TEXT DEFAULT 'customer'
    CHECK (requester_type IN ('customer', 'pension_owner'));
ALTER TABLE quote_requests ADD COLUMN IF NOT EXISTS pension_owner_id UUID REFERENCES profiles(id);

-- ============================================================
-- 6. Extend reservations
-- ============================================================
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS reservation_type TEXT DEFAULT 'bus'
    CHECK (reservation_type IN ('bus', 'package', 'shuttle'));
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS package_id UUID;

-- ============================================================
-- 7. Extend reviews
-- ============================================================
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS target_type TEXT DEFAULT 'driver'
    CHECK (target_type IN ('driver', 'pension'));
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS pension_id UUID;

-- ============================================================
-- 8. NEW TABLE: pension_owners
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pension_owners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    business_name TEXT NOT NULL,
    business_number TEXT,
    accommodation_license TEXT,
    representative_name TEXT NOT NULL,
    phone TEXT,
    approval_status TEXT DEFAULT 'pending'
        CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    bank_name TEXT,
    bank_account TEXT,
    bank_holder TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 9. NEW TABLE: pensions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pensions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.pension_owners(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    region TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    room_count INTEGER DEFAULT 1,
    max_capacity INTEGER DEFAULT 10,
    check_in_time TEXT DEFAULT '15:00',
    check_out_time TEXT DEFAULT '11:00',
    price_per_night INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    rating NUMERIC(2,1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 10. NEW TABLE: packages
-- ============================================================
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pension_id UUID REFERENCES public.pensions(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    photos TEXT[] DEFAULT '{}',
    region TEXT NOT NULL,
    trip_type TEXT DEFAULT 'round'
        CHECK (trip_type IN ('one_way', 'round')),
    duration TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    min_passengers INTEGER DEFAULT 1,
    max_passengers INTEGER DEFAULT 45,
    price_per_person INTEGER NOT NULL,
    pension_cost INTEGER DEFAULT 0,
    bus_cost INTEGER DEFAULT 0,
    platform_margin INTEGER DEFAULT 0,
    total_price INTEGER DEFAULT 0,
    includes TEXT[] DEFAULT '{}',
    excludes TEXT[] DEFAULT '{}',
    season_start DATE,
    season_end DATE,
    status TEXT DEFAULT 'draft'
        CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 11. NEW TABLE: shuttle_routes
-- ============================================================
CREATE TABLE IF NOT EXISTS public.shuttle_routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pension_id UUID REFERENCES public.pensions(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    departure_address TEXT NOT NULL,
    destination_address TEXT NOT NULL,
    schedule TEXT,
    vehicle_type TEXT NOT NULL,
    total_seats INTEGER NOT NULL,
    price_per_seat INTEGER NOT NULL,
    driver_id UUID REFERENCES public.drivers(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 12. NEW TABLE: shuttle_bookings
-- ============================================================
CREATE TABLE IF NOT EXISTS public.shuttle_bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    route_id UUID REFERENCES public.shuttle_routes(id) NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) NOT NULL,
    booking_date DATE NOT NULL,
    seats INTEGER NOT NULL DEFAULT 1,
    total_price INTEGER NOT NULL,
    status TEXT DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 13. NEW TABLE: payments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reservation_id UUID REFERENCES public.reservations(id) NOT NULL,
    payment_type TEXT NOT NULL
        CHECK (payment_type IN ('deposit', 'remaining', 'refund')),
    amount INTEGER NOT NULL,
    method TEXT,
    pg_provider TEXT DEFAULT 'toss',
    pg_payment_key TEXT,
    pg_order_id TEXT UNIQUE,
    pg_receipt_url TEXT,
    status TEXT DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed', 'failed', 'cancelled', 'refunded')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 14. NEW TABLE: settlements (driver)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.settlements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver_id UUID REFERENCES public.drivers(id) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_revenue INTEGER NOT NULL,
    platform_fee INTEGER NOT NULL,
    fee_rate NUMERIC(4,3) DEFAULT 0.100,
    net_amount INTEGER NOT NULL,
    trip_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'paid', 'disputed')),
    paid_at TIMESTAMPTZ,
    bank_transfer_id TEXT,
    tax_invoice_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 15. NEW TABLE: settlements_pension
-- ============================================================
CREATE TABLE IF NOT EXISTS public.settlements_pension (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pension_owner_id UUID REFERENCES public.pension_owners(id) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    package_revenue INTEGER DEFAULT 0,
    shuttle_revenue INTEGER DEFAULT 0,
    referral_revenue INTEGER DEFAULT 0,
    total_revenue INTEGER NOT NULL,
    platform_fee INTEGER NOT NULL,
    net_amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'paid')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 16. NEW TABLE: price_trends
-- ============================================================
CREATE TABLE IF NOT EXISTS public.price_trends (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    departure_region TEXT NOT NULL,
    destination_region TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    avg_price INTEGER NOT NULL,
    min_price INTEGER NOT NULL,
    max_price INTEGER NOT NULL,
    sample_count INTEGER DEFAULT 0,
    period TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 17. NEW TABLE: coupons + user_coupons
-- ============================================================
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    discount_type TEXT CHECK (discount_type IN ('fixed', 'percent')),
    discount_value INTEGER NOT NULL,
    min_order_amount INTEGER DEFAULT 0,
    max_discount INTEGER,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    max_usage INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_coupons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    coupon_id UUID REFERENCES public.coupons(id) NOT NULL,
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 18. NEW TABLE: manager_assignments
-- ============================================================
CREATE TABLE IF NOT EXISTS public.manager_assignments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reservation_id UUID REFERENCES public.reservations(id) NOT NULL,
    manager_id UUID REFERENCES public.profiles(id) NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'active'
        CHECK (status IN ('active', 'completed'))
);

-- ============================================================
-- 19. NEW TABLE: locations (GPS tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.locations (
    id BIGSERIAL PRIMARY KEY,
    reservation_id UUID REFERENCES public.reservations(id) NOT NULL,
    driver_id UUID REFERENCES public.profiles(id) NOT NULL,
    latitude NUMERIC(10,7) NOT NULL,
    longitude NUMERIC(10,7) NOT NULL,
    speed NUMERIC(5,1),
    heading NUMERIC(5,1),
    recorded_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 20. INDEXES for new tables
-- ============================================================

-- pension_owners
CREATE INDEX IF NOT EXISTS idx_pension_owners_user ON pension_owners(user_id);
CREATE INDEX IF NOT EXISTS idx_pension_owners_status ON pension_owners(approval_status);

-- pensions
CREATE INDEX IF NOT EXISTS idx_pensions_owner ON pensions(owner_id);
CREATE INDEX IF NOT EXISTS idx_pensions_region ON pensions(region);
CREATE INDEX IF NOT EXISTS idx_pensions_active ON pensions(is_active) WHERE is_active = true;

-- packages
CREATE INDEX IF NOT EXISTS idx_packages_pension ON packages(pension_id);
CREATE INDEX IF NOT EXISTS idx_packages_region ON packages(region);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);

-- shuttle_routes
CREATE INDEX IF NOT EXISTS idx_shuttle_routes_pension ON shuttle_routes(pension_id);
CREATE INDEX IF NOT EXISTS idx_shuttle_routes_driver ON shuttle_routes(driver_id);

-- shuttle_bookings
CREATE INDEX IF NOT EXISTS idx_shuttle_bookings_route ON shuttle_bookings(route_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_shuttle_bookings_customer ON shuttle_bookings(customer_id);

-- payments
CREATE INDEX IF NOT EXISTS idx_payments_reservation ON payments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_pg_order ON payments(pg_order_id);

-- settlements
CREATE INDEX IF NOT EXISTS idx_settlements_driver ON settlements(driver_id);
CREATE INDEX IF NOT EXISTS idx_settlements_period ON settlements(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON settlements(status);

-- settlements_pension
CREATE INDEX IF NOT EXISTS idx_settlements_pension_owner ON settlements_pension(pension_owner_id);
CREATE INDEX IF NOT EXISTS idx_settlements_pension_period ON settlements_pension(period_start, period_end);

-- price_trends
CREATE INDEX IF NOT EXISTS idx_price_trends_route ON price_trends(departure_region, destination_region);
CREATE INDEX IF NOT EXISTS idx_price_trends_period ON price_trends(period);

-- coupons
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active) WHERE is_active = true;

-- user_coupons
CREATE INDEX IF NOT EXISTS idx_user_coupons_user ON user_coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coupons_coupon ON user_coupons(coupon_id);

-- manager_assignments
CREATE INDEX IF NOT EXISTS idx_manager_assignments_reservation ON manager_assignments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_manager_assignments_manager ON manager_assignments(manager_id);

-- locations
CREATE INDEX IF NOT EXISTS idx_locations_reservation_time ON locations(reservation_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_locations_driver ON locations(driver_id, recorded_at DESC);

-- extended columns on existing tables
CREATE INDEX IF NOT EXISTS idx_quote_requests_pension_owner ON quote_requests(pension_owner_id) WHERE pension_owner_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reservations_type ON reservations(reservation_type);
CREATE INDEX IF NOT EXISTS idx_reviews_target_type ON reviews(target_type);

-- ============================================================
-- 21. ENABLE RLS on all new tables
-- ============================================================
ALTER TABLE pension_owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE pensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE shuttle_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shuttle_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements_pension ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE manager_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- ---- pension_owners policies ----
CREATE POLICY "pension_owners_read" ON pension_owners
    FOR SELECT USING (true);
CREATE POLICY "pension_owners_insert_own" ON pension_owners
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pension_owners_update_own" ON pension_owners
    FOR UPDATE USING (auth.uid() = user_id);

-- ---- pensions policies ----
CREATE POLICY "pensions_read" ON pensions
    FOR SELECT USING (true);
CREATE POLICY "pensions_manage_own" ON pensions
    FOR ALL USING (
        owner_id IN (SELECT id FROM pension_owners WHERE user_id = auth.uid())
    );

-- ---- packages policies ----
CREATE POLICY "packages_read" ON packages
    FOR SELECT USING (true);
CREATE POLICY "packages_manage_own" ON packages
    FOR ALL USING (
        pension_id IN (
            SELECT p.id FROM pensions p
            JOIN pension_owners po ON p.owner_id = po.id
            WHERE po.user_id = auth.uid()
        )
    );

-- ---- shuttle_routes policies ----
CREATE POLICY "shuttle_routes_read" ON shuttle_routes
    FOR SELECT USING (true);
CREATE POLICY "shuttle_routes_manage_pension_owner" ON shuttle_routes
    FOR ALL USING (
        pension_id IN (
            SELECT p.id FROM pensions p
            JOIN pension_owners po ON p.owner_id = po.id
            WHERE po.user_id = auth.uid()
        )
    );

-- ---- shuttle_bookings policies ----
CREATE POLICY "shuttle_bookings_read_own" ON shuttle_bookings
    FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "shuttle_bookings_read_pension_owner" ON shuttle_bookings
    FOR SELECT USING (
        route_id IN (
            SELECT sr.id FROM shuttle_routes sr
            JOIN pensions p ON sr.pension_id = p.id
            JOIN pension_owners po ON p.owner_id = po.id
            WHERE po.user_id = auth.uid()
        )
    );
CREATE POLICY "shuttle_bookings_insert" ON shuttle_bookings
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- ---- payments policies ----
CREATE POLICY "payments_read_own" ON payments
    FOR SELECT USING (
        reservation_id IN (
            SELECT id FROM reservations WHERE customer_id = auth.uid()
        )
    );
CREATE POLICY "payments_read_driver" ON payments
    FOR SELECT USING (
        reservation_id IN (
            SELECT r.id FROM reservations r
            JOIN drivers d ON r.driver_id = d.id
            WHERE d.user_id = auth.uid()
        )
    );
CREATE POLICY "payments_insert" ON payments
    FOR INSERT WITH CHECK (
        reservation_id IN (
            SELECT id FROM reservations WHERE customer_id = auth.uid()
        )
    );

-- ---- settlements policies ----
CREATE POLICY "settlements_read_own" ON settlements
    FOR SELECT USING (
        driver_id IN (SELECT id FROM drivers WHERE user_id = auth.uid())
    );

-- ---- settlements_pension policies ----
CREATE POLICY "settlements_pension_read_own" ON settlements_pension
    FOR SELECT USING (
        pension_owner_id IN (SELECT id FROM pension_owners WHERE user_id = auth.uid())
    );

-- ---- price_trends policies (public read) ----
CREATE POLICY "price_trends_read" ON price_trends
    FOR SELECT USING (true);

-- ---- coupons policies (public read active) ----
CREATE POLICY "coupons_read_active" ON coupons
    FOR SELECT USING (is_active = true);

-- ---- user_coupons policies ----
CREATE POLICY "user_coupons_read_own" ON user_coupons
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_coupons_insert_own" ON user_coupons
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_coupons_update_own" ON user_coupons
    FOR UPDATE USING (auth.uid() = user_id);

-- ---- manager_assignments policies ----
CREATE POLICY "manager_assignments_read" ON manager_assignments
    FOR SELECT USING (
        auth.uid() = manager_id
        OR auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );
CREATE POLICY "manager_assignments_manage_admin" ON manager_assignments
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
    );

-- ---- locations policies ----
CREATE POLICY "locations_read_participant" ON locations
    FOR SELECT USING (
        auth.uid() = driver_id
        OR reservation_id IN (
            SELECT id FROM reservations WHERE customer_id = auth.uid()
        )
    );
CREATE POLICY "locations_insert_driver" ON locations
    FOR INSERT WITH CHECK (auth.uid() = driver_id);

-- ============================================================
-- 22. ENABLE REALTIME for shuttle_bookings and packages
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE shuttle_bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE packages;

-- ============================================================
-- End of v3.1 migration
-- ============================================================
