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
  shooting_duration: string
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
  hidden: boolean
  booking_dates: string[]
  album_type: string
  album_size: string
  shooting_duration: string | null
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
  payment_total: number | null
  payment_done: number | null
  payment_remaining: number | null
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
        shooting_duration: data.shooting_duration || null,
        booking_dates: data.booking_dates,
        mehandi_date: data.mehandi_date || null,
        mandav_date: data.mandav_date || null,
        halad_date: data.halad_date || null,
        lagn_date: data.lagn_date || null,
        mehandi_place: data.mehandi_place || null,
        mandav_place: data.mandav_place || null,
        halad_place: data.halad_place || null,
        lagn_place: data.lagn_place || null,
        hidden: false,
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
    .eq('hidden', false)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as BookingRecord[]
}

export async function hideBooking(id: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  const { data, error } = await supabase
    .from('bookings')
    .update({
      hidden: true,
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

export async function updateBookingPayments(id: string, paymentDone: number | null, paymentTotal: number | null) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  const computedRemaining =
    paymentTotal === null || paymentDone === null ? null : Math.max(paymentTotal - paymentDone, 0)

  const { data, error } = await supabase
    .from('bookings')
    .update({
      payment_done: paymentDone,
      payment_total: paymentTotal,
      payment_remaining: computedRemaining,
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

/* ─────────────────────────────────────────────
   Booking Expenses — crew / vendor payments
   ───────────────────────────────────────────── */

export type ExpenseCategory = 'album_making' | 'editor' | 'crew' | 'other'

export interface BookingExpense {
  id: string
  booking_id: string
  category: ExpenseCategory
  person_name: string
  description: string
  amount: number
  created_at: string
  updated_at?: string | null
}

export async function fetchBookingById(id: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing.')
  }

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as BookingRecord
}

export async function fetchExpensesByBookingId(bookingId: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing.')
  }

  const { data, error } = await supabase
    .from('booking_expenses')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return (data ?? []) as BookingExpense[]
}

export async function addExpense(expense: {
  booking_id: string
  category: ExpenseCategory
  person_name: string
  description?: string
  amount: number
}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing.')
  }

  const { data, error } = await supabase
    .from('booking_expenses')
    .insert([
      {
        booking_id: expense.booking_id,
        category: expense.category,
        person_name: expense.person_name,
        description: expense.description || '',
        amount: expense.amount,
      },
    ])
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as BookingExpense
}

export async function updateExpense(
  expenseId: string,
  updates: Partial<Pick<BookingExpense, 'category' | 'person_name' | 'description' | 'amount'>>
) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing.')
  }

  const { data, error } = await supabase
    .from('booking_expenses')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', expenseId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as BookingExpense
}

export async function deleteExpense(expenseId: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing.')
  }

  const { error } = await supabase
    .from('booking_expenses')
    .delete()
    .eq('id', expenseId)

  if (error) throw new Error(error.message)
}

/* ─────────────────────────────────────────────
   My Work (day payroll for other bookings)
   ───────────────────────────────────────────── */

export interface MyWorkFormData {
  employee_name: string
  program: string
  work_place: string
  work_dates: string[]
  total_receivable: number
}

export interface MyWorkRecord {
  id: string
  employee_name: string
  program: string
  work_place: string
  work_dates: string[]
  total_receivable: number
  total_received: number | null
  receivable_remaining: number | null
  created_at: string
  updated_at?: string | null
}

export async function submitMyWorkEntry(data: MyWorkFormData) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  const { data: result, error } = await supabase
    .from('my_work_entries')
    .insert([
      {
        employee_name: data.employee_name,
        program: data.program,
        work_place: data.work_place,
        work_dates: data.work_dates,
        total_receivable: data.total_receivable,
        total_received: 0,
        receivable_remaining: data.total_receivable,
        created_at: new Date().toISOString(),
      },
    ])
    .select()

  if (error) {
    throw new Error(error.message)
  }

  return result
}

export async function fetchMyWorkEntries() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  const { data, error } = await supabase
    .from('my_work_entries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []) as MyWorkRecord[]
}

export async function updateMyWorkReceived(id: string, totalReceived: number | null) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  const { data: current, error: currentError } = await supabase
    .from('my_work_entries')
    .select('id, total_receivable')
    .eq('id', id)
    .single()

  if (currentError || !current) {
    throw new Error(currentError?.message || 'Record not found')
  }

  const remaining = totalReceived === null
    ? current.total_receivable
    : Math.max(Number(current.total_receivable || 0) - totalReceived, 0)

  const { data, error } = await supabase
    .from('my_work_entries')
    .update({
      total_received: totalReceived,
      receivable_remaining: remaining,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as MyWorkRecord
}
