-- ============================================================
-- Booking Expenses — track payments to crew / vendors per booking
-- ============================================================

-- 1. Ensure bookings has payment columns
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS payment_total numeric(12,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_done numeric(12,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS payment_remaining numeric(12,2) DEFAULT NULL;

-- 2. Create expense categories enum-like check
-- Categories: 'album_making', 'editor', 'crew', 'other'

CREATE TABLE IF NOT EXISTS public.booking_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- FK to parent booking
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,

  -- What kind of expense
  category text NOT NULL
    CHECK (category IN ('album_making', 'editor', 'crew', 'other')),

  -- Person / vendor name (e.g. "Rahul - Cameraman", "ABC Studio")
  person_name text NOT NULL DEFAULT '',

  -- Description / note (optional)
  description text DEFAULT '',

  -- Amount paid
  amount numeric(12,2) NOT NULL DEFAULT 0,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

-- Index for fast lookup by booking
CREATE INDEX IF NOT EXISTS idx_booking_expenses_booking_id
  ON public.booking_expenses(booking_id);

-- Enable RLS (optional — adjust policies as needed)
-- ALTER TABLE public.booking_expenses ENABLE ROW LEVEL SECURITY;
