'use client'

import { useRouter } from 'next/navigation'

import { useEffect, useMemo, useState } from 'react'
import {
  BookingRecord,
  BookingStatus,
  fetchBookings,
  hideBooking,
  updateBookingPayments,
  updateBookingStatus,
} from '@/lib/supabase'
import toast from 'react-hot-toast'
import styles from './Admin.module.scss'

const AUTH_KEY = 'dr_admin_access'
const FALLBACK_ADMIN_PASSWORD = 'admin123'

const statusOptions: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']

function getStatusLabel(status?: string | null) {
  switch (status) {
    case 'confirmed':
      return 'Confirmed'
    case 'completed':
      return 'Completed'
    case 'cancelled':
      return 'Cancelled'
    default:
      return 'Pending'
  }
}

function formatCreatedAt(value: string) {
  if (!value) return '-'
  const date = new Date(value)
  return date.toLocaleString('mr-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatBookingDates(dates: string[]) {
  if (!dates || dates.length === 0) return '-'

  return dates
    .map((item) => {
      const date = new Date(item)
      return Number.isNaN(date.getTime())
        ? item
        : date.toLocaleDateString('mr-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
    })
    .join(', ')
}

function formatMoney(value?: number | null) {
  if (value === null || value === undefined) return '-'
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value)
}

function formatDateOnly(value?: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString('mr-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
}

export default function AdminPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [updatingId, setUpdatingId] = useState('')
  const [paymentDrafts, setPaymentDrafts] = useState<Record<string, { done: string; total: string }>>({})

  const expectedPassword = process.env.NEXT_PUBLIC_ADMIN_PANEL_PASSWORD || FALLBACK_ADMIN_PASSWORD

  useEffect(() => {
    const hasAccess = window.sessionStorage.getItem(AUTH_KEY) === 'yes'
    setIsAuthed(hasAccess)
  }, [])

  useEffect(() => {
    if (!isAuthed) {
      setLoading(false)
      return
    }

    const loadBookings = async () => {
      try {
        setError('')
        setLoading(true)
        const data = await fetchBookings()
        setBookings(data)
        setPaymentDrafts(
          data.reduce<Record<string, { done: string; total: string }>>((acc, item) => {
            acc[item.id] = {
              done: item.payment_done === null || item.payment_done === undefined ? '' : String(item.payment_done),
              total: item.payment_total === null || item.payment_total === undefined ? '' : String(item.payment_total),
            }
            return acc
          }, {})
        )
      } catch (err: any) {
        setError(err.message || 'डेटा लोड करताना समस्या आली')
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [isAuthed])

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password.trim() !== expectedPassword) {
      setAuthError('चुकीचा पासवर्ड, कृपया पुन्हा प्रयत्न करा.')
      toast.error('Wrong admin password. Please try again.')
      return
    }

    window.sessionStorage.setItem(AUTH_KEY, 'yes')
    setIsAuthed(true)
    setAuthError('')
    setPassword('')
    toast.success('Admin login successful')
  }

  const handleLogout = () => {
    window.sessionStorage.removeItem(AUTH_KEY)
    setIsAuthed(false)
    setBookings([])
    setSearch('')
    toast.success('Logged out successfully')
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const normalizedStatus = (newStatus || 'pending') as BookingStatus
    try {
      setUpdatingId(bookingId)
      const updated = await updateBookingStatus(bookingId, normalizedStatus)
      setBookings((prev) => prev.map((item) => (item.id === bookingId ? { ...item, ...updated } : item)))
      toast.success('Status updated successfully')
    } catch (err: any) {
      setError(err.message || 'स्टेटस अपडेट करताना समस्या आली')
      toast.error(err?.message || 'Failed to update status')
    } finally {
      setUpdatingId('')
    }
  }

  const handleDelete = async (bookingId: string, bookingName: string) => {
    const isConfirmed = window.confirm(`तुम्हाला ${bookingName} ची नोंद delete करायची आहे का?`)
    if (!isConfirmed) return

    try {
      setUpdatingId(bookingId)
      await hideBooking(bookingId)
      setBookings((prev) => prev.filter((item) => item.id !== bookingId))
      toast.success('Booking deleted successfully')
    } catch (err: any) {
      setError(err.message || 'नोंद delete करताना समस्या आली')
      toast.error(err?.message || 'Failed to delete booking')
    } finally {
      setUpdatingId('')
    }
  }

  const handlePaymentDraftChange = (bookingId: string, field: 'done' | 'total', value: string) => {
    setPaymentDrafts((prev) => ({
      ...prev,
      [bookingId]: {
        done: prev[bookingId]?.done ?? '',
        total: prev[bookingId]?.total ?? '',
        [field]: value,
      },
    }))
  }

  const handlePaymentSave = async (bookingId: string) => {
    const draft = paymentDrafts[bookingId] || { done: '', total: '' }
    const doneVal = draft.done.trim() === '' ? null : Number(draft.done)
    const totalVal = draft.total.trim() === '' ? null : Number(draft.total)

    if ((doneVal !== null && (Number.isNaN(doneVal) || doneVal < 0)) || (totalVal !== null && (Number.isNaN(totalVal) || totalVal < 0))) {
      setError('पेमेंट रक्कम वैध आणि 0 पेक्षा मोठी/समान असावी')
      toast.error('Payment values must be valid and non-negative')
      return
    }

    if (doneVal !== null && totalVal !== null && doneVal > totalVal) {
      setError('Done Payment ही Total Payment पेक्षा जास्त असू शकत नाही')
      toast.error('Done payment cannot be greater than total payment')
      return
    }

    try {
      setError('')
      setUpdatingId(bookingId)
      const updated = await updateBookingPayments(bookingId, doneVal, totalVal)
      setBookings((prev) => prev.map((item) => (item.id === bookingId ? { ...item, ...updated } : item)))
      setPaymentDrafts((prev) => ({
        ...prev,
        [bookingId]: {
          done: updated.payment_done === null || updated.payment_done === undefined ? '' : String(updated.payment_done),
          total: updated.payment_total === null || updated.payment_total === undefined ? '' : String(updated.payment_total),
        },
      }))
      toast.success('Payment updated successfully')
    } catch (err: any) {
      setError(err.message || 'पेमेंट अपडेट करताना समस्या आली')
      toast.error(err?.message || 'Failed to update payment')
    } finally {
      setUpdatingId('')
    }
  }

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return bookings

    return bookings.filter((booking) => {
      const haystack = [
        booking.id,
        booking.name,
        booking.phone_primary,
        booking.phone_alternate || '',
        booking.full_address,
        booking.program,
        booking.other_program || '',
        booking.event_place || '',
        booking.album_type,
        booking.album_size,
        booking.mehandi_place || '',
        booking.mandav_place || '',
        booking.halad_place || '',
        booking.lagn_place || '',
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [bookings, search])

  if (!isAuthed) {
    return (
      <main className={styles.adminPage}>
        <div className={styles.bgLayer}>
          <span className={styles.blobOne}></span>
          <span className={styles.blobTwo}></span>
        </div>

        <section className={styles.authCard}>
          <p className={styles.badge}>Admin Access</p>
          <h1>Secure Admin Login</h1>
          <p className={styles.subtitle}>बुकिंग डेटा पाहण्यासाठी पासवर्ड टाका</p>

          <form onSubmit={handleLogin} className={styles.authForm}>
            <input
              type="password"
              placeholder="Admin Password"
              className={styles.searchInput}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {authError && <p className={styles.errorText}>{authError}</p>}
            <button type="submit" className={styles.loginBtn}>
              Login to Dashboard
            </button>
          </form>
        </section>
      </main>
    )
  }

  return (
    <main className={styles.adminPage}>
      <div className={styles.bgLayer}>
        <span className={styles.blobOne}></span>
        <span className={styles.blobTwo}></span>
      </div>

      <section className={styles.panel}>
        <header className={styles.header}>
          <p className={styles.badge}>Admin Dashboard</p>
          <h1>फॉर्म बुकिंग्स</h1>
          <p className={styles.subtitle}>फॉर्ममधील सर्व नोंदी येथे दिसतील</p>
        </header>

        <div className={styles.toolbar}>
          <div className={styles.meta}>
            <span>एकूण नोंदी: </span>
            <strong>{filteredBookings.length}</strong>
          </div>
          <div className={styles.toolbarActions}>
            <input
              type="text"
              placeholder="नाव, फोन, कार्यक्रम शोधा"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
            <button
              type="button"
              className={styles.recevablesBtn}
              onClick={() => {
                window.sessionStorage.setItem('dr_recevables_from_admin', 'yes')
                router.push('/recevables')
              }}
            >
              Recevables
            </button>
            <button
              type="button"
              className={styles.myWorkBtn}
              onClick={() => {
                window.sessionStorage.setItem('dr_mywork_from_admin', 'yes')
                router.push('/mywork')
              }}
            >
              Add Work
            </button>
            <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {loading && <div className={styles.infoCard}>डेटा लोड होत आहे...</div>}

        {error && !loading && <div className={styles.errorCard}>{error}</div>}

        {!loading && !error && filteredBookings.length === 0 && (
          <div className={styles.infoCard}>अजून कोणतीही बुकिंग नोंद नाही.</div>
        )}

        {!loading && !error && filteredBookings.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.bookingTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Primary</th>
                  <th>Alternate</th>
                  <th>Program</th>
                  <th>Other Program</th>
                  <th>Event Place</th>
                  <th>Booking Dates</th>
                  <th>Address</th>
                  <th>Album Type</th>
                  <th>Album Size</th>
                  <th>Total Payment</th>
                  <th>Done Payment</th>
                  <th>Remaining</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Status</th>
                  <th>Action</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => {
                  const currentStatus = booking.status || 'pending'
                  const isUpdating = updatingId === booking.id
                  const draft = paymentDrafts[booking.id] || { done: '', total: '' }
                  const doneVal = draft.done.trim() === '' ? null : Number(draft.done)
                  const totalVal = draft.total.trim() === '' ? null : Number(draft.total)
                  const remainingVal =
                    totalVal === null || Number.isNaN(totalVal) || doneVal === null || Number.isNaN(doneVal)
                      ? booking.payment_remaining
                      : Math.max(totalVal - doneVal, 0)

                  return (
                    <tr key={booking.id} onClick={() => router.push(`/admin/detail?id=${booking.id}`)} style={{ cursor: 'pointer' }}>
                      <td>{index + 1}</td>
                      <td>{booking.id}</td>
                      <td>{booking.name}</td>
                      <td>{booking.phone_primary}</td>
                      <td>{booking.phone_alternate || '-'}</td>
                      <td>{booking.program}</td>
                      <td>{booking.other_program || '-'}</td>
                      <td>{booking.event_place || '-'}</td>
                      <td>{formatBookingDates(booking.booking_dates)}</td>
                      <td className={styles.addressCell}>{booking.full_address}</td>
                      <td>{booking.album_type}</td>
                      <td>{booking.album_size}</td>
                      <td>
                        <div className={styles.paymentFieldWrap}>
                          <span className={styles.currencyPrefix}>Rs.</span>
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={draft.total}
                            onChange={(e) => handlePaymentDraftChange(booking.id, 'total', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className={styles.paymentInput}
                            placeholder="Total"
                            disabled={isUpdating}
                          />
                        </div>
                      </td>
                      <td>
                        <div className={styles.paymentFieldWrap}>
                          <span className={styles.currencyPrefix}>Rs.</span>
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={draft.done}
                            onChange={(e) => handlePaymentDraftChange(booking.id, 'done', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className={styles.paymentInput}
                            placeholder="Done"
                            disabled={isUpdating}
                          />
                        </div>
                        <button
                          type="button"
                          className={styles.paymentSaveBtn}
                          onClick={(e) => { e.stopPropagation(); handlePaymentSave(booking.id) }}
                          disabled={isUpdating}
                        >
                          Save
                        </button>
                      </td>
                      <td>
                        <span className={styles.remainingBadge}>Rs. {formatMoney(remainingVal)}</span>
                      </td>
                      <td>{formatCreatedAt(booking.created_at)}</td>
                      <td>{booking.updated_at ? formatCreatedAt(booking.updated_at) : '-'}</td>
                      <td>
                        <span className={`${styles.statusPill} ${styles[`status${currentStatus}`] || styles.statuspending}`}>
                          {getStatusLabel(currentStatus)}
                        </span>
                      </td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          disabled={isUpdating}
                        >
                          {statusOptions.map((statusItem) => (
                            <option key={statusItem} value={statusItem}>
                              {statusItem}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={(e) => { e.stopPropagation(); handleDelete(booking.id, booking.name) }}
                          disabled={isUpdating}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
