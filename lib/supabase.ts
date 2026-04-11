import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface BookingFormData {
  name: string
  phone_primary: string
  phone_alternate?: string
  full_address: string
  program: string
  num_days: number
  booking_dates: string[]
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface BookingRecord extends BookingFormData {
  id: string
  created_at: string
  updated_at?: string | null
  status?: BookingStatus | string | null
  phone_alternate: string | null
}

export async function submitBooking(data: BookingFormData) {
  const { data: result, error } = await supabase
    .from('bookings')
    .insert([
      {
        name: data.name,
        phone_primary: data.phone_primary,
        phone_alternate: data.phone_alternate || null,
        full_address: data.full_address,
        program: data.program,
        num_days: data.num_days,
        booking_dates: data.booking_dates,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return result
}

export async function fetchBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as BookingRecord[]
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as BookingRecord
}
