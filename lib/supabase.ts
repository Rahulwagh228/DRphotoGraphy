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
  other_program?: string
  event_place?: string
  album_type: string
  album_size: string
  booking_dates: string[]
  // लग्न समारंभ sub-event dates
  mehandi_date?: string
  mandav_date?: string
  halad_date?: string
  lagn_date?: string
  // लग्न समारंभ sub-event places
  mehandi_place?: string
  mandav_place?: string
  halad_place?: string
  lagn_place?: string
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface BookingRecord {
  id: string
  name: string
  phone_primary: string
  full_address: string
  program: string
  created_at: string
  updated_at?: string | null
  status?: BookingStatus | string | null
  booking_dates: string[]
  album_type: string
  album_size: string
  phone_alternate: string | null
  other_program: string | null
  event_place: string | null
  mehandi_date: string | null
  mandav_date: string | null
  halad_date: string | null
  lagn_date: string | null
  mehandi_place: string | null
  mandav_place: string | null
  halad_place: string | null
  lagn_place: string | null
}

export async function submitBooking(data: BookingFormData) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  const { data: result, error } = await supabase
    .from('bookings')
    .insert([
      {
        name: data.name,
        phone_primary: data.phone_primary,
        phone_alternate: data.phone_alternate || null,
        full_address: data.full_address,
        program: data.program,
        other_program: data.other_program || null,
        event_place: data.event_place || null,
        album_type: data.album_type,
        album_size: data.album_size,
        booking_dates: data.booking_dates,
        mehandi_date: data.mehandi_date || null,
        mandav_date: data.mandav_date || null,
        halad_date: data.halad_date || null,
        lagn_date: data.lagn_date || null,
        mehandi_place: data.mehandi_place || null,
        mandav_place: data.mandav_place || null,
        halad_place: data.halad_place || null,
        lagn_place: data.lagn_place || null,
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
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

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
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

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
