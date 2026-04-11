'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookingRecord, fetchBookings } from '@/lib/supabase'
import styles from './Admin.module.scss'

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

  useEffect(() => {
    const loadBookings = async () => {
      try {
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
  }, [])

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
          <input
            type="text"
            placeholder="नाव, फोन, कार्यक्रम शोधा"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {loading && <div className={styles.infoCard}>डेटा लोड होत आहे...</div>}

        {error && !loading && <div className={styles.errorCard}>{error}</div>}

        {!loading && !error && filteredBookings.length === 0 && (
          <div className={styles.infoCard}>अजून कोणतीही बुकिंग नोंद नाही.</div>
        )}

        {!loading && !error && filteredBookings.length > 0 && (
          <>
            <div className={styles.desktopTableWrap}>
              <table className={styles.bookingTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>नाव</th>
                    <th>मोबाईल</th>
                    <th>पर्यायी</th>
                    <th>पत्ता</th>
                    <th>कार्यक्रम</th>
                    <th>दिवस</th>
                    <th>तारखा</th>
                    <th>सबमिट वेळ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, index) => (
                    <tr key={booking.id}>
                      <td>{index + 1}</td>
                      <td>{booking.name}</td>
                      <td>{booking.phone_primary}</td>
                      <td>{booking.phone_alternate || '-'}</td>
                      <td className={styles.addressCell}>{booking.full_address}</td>
                      <td>{booking.program}</td>
                      <td>{booking.num_days}</td>
                      <td>{formatBookingDates(booking.booking_dates)}</td>
                      <td>{formatCreatedAt(booking.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.mobileCards}>
              {filteredBookings.map((booking, index) => (
                <article key={booking.id} className={styles.bookingCard}>
                  <div className={styles.cardTop}>
                    <span>नोंद {index + 1}</span>
                    <strong>{booking.program}</strong>
                  </div>
                  <h3>{booking.name}</h3>
                  <p><span>मोबाईल:</span> {booking.phone_primary}</p>
                  <p><span>पर्यायी:</span> {booking.phone_alternate || '-'}</p>
                  <p><span>पत्ता:</span> {booking.full_address}</p>
                  <p><span>दिवस:</span> {booking.num_days}</p>
                  <p><span>तारखा:</span> {formatBookingDates(booking.booking_dates)}</p>
                  <p><span>सबमिट:</span> {formatCreatedAt(booking.created_at)}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
