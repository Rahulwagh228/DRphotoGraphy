'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookingRecord, BookingStatus, fetchBookings, updateBookingStatus } from '@/lib/supabase'
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

export default function AdminPage() {
  const [bookings, setBookings] = useState<BookingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

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
      return
    }

    window.sessionStorage.setItem(AUTH_KEY, 'yes')
    setIsAuthed(true)
    setAuthError('')
    setPassword('')
  }

  const handleLogout = () => {
    window.sessionStorage.removeItem(AUTH_KEY)
    setIsAuthed(false)
    setBookings([])
    setSearch('')
  }

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    const normalizedStatus = (newStatus || 'pending') as BookingStatus
    try {
      setUpdatingId(bookingId)
      const updated = await updateBookingStatus(bookingId, normalizedStatus)
      setBookings((prev) => prev.map((item) => (item.id === bookingId ? { ...item, ...updated } : item)))
    } catch (err: any) {
      setError(err.message || 'स्टेटस अपडेट करताना समस्या आली')
    } finally {
      setUpdatingId('')
    }
  }

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return bookings

    return bookings.filter((booking) => {
      const haystack = [
        booking.name,
        booking.phone_primary,
        booking.phone_alternate || '',
        booking.full_address,
        booking.program,
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
                  <th>Name</th>
                  <th>Primary</th>
                  <th>Alternate</th>
                  <th>Program</th>
                  <th>Booking Dates</th>
                  <th>Address</th>
                  <th>Created</th>
                  <th>Updated</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => {
                  const currentStatus = booking.status || 'pending'
                  const isUpdating = updatingId === booking.id

                  return (
                    <tr key={booking.id}>
                      <td>{index + 1}</td>
                      <td>{booking.name}</td>
                      <td>{booking.phone_primary}</td>
                      <td>{booking.phone_alternate || '-'}</td>
                      <td>{booking.program}</td>
                      <td>{formatBookingDates(booking.booking_dates)}</td>
                      <td className={styles.addressCell}>{booking.full_address}</td>
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
                          disabled={isUpdating}
                        >
                          {statusOptions.map((statusItem) => (
                            <option key={statusItem} value={statusItem}>
                              {statusItem}
                            </option>
                          ))}
                        </select>
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
