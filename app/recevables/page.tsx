'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import styles from './Recevables.module.scss'
import { fetchMyWorkEntries, MyWorkRecord, updateMyWorkReceived } from '@/lib/supabase'

const AUTH_KEY = 'dr_admin_access'
const RECEVABLES_FROM_ADMIN_KEY = 'dr_recevables_from_admin'

function formatDate(value?: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('mr-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatDates(values?: string[] | null) {
  if (!values || values.length === 0) return '-'
  return values.map((v) => formatDate(v)).join(', ')
}

function formatMoney(value?: number | null) {
  if (value === null || value === undefined) return '0'
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(value)
}

export default function RecevablesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [entries, setEntries] = useState<MyWorkRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')
  const [receivedDrafts, setReceivedDrafts] = useState<Record<string, string>>({})

  useEffect(() => {
    const fromAdmin = searchParams.get('from') === 'admin'
    const fromAdminFlag = window.sessionStorage.getItem(RECEVABLES_FROM_ADMIN_KEY) === 'yes'
    const fromAdminReferrer = (() => {
      if (!document.referrer) return false
      try {
        const ref = new URL(document.referrer)
        return ref.pathname.startsWith('/admin')
      } catch {
        return false
      }
    })()

    const allowWithoutAuth = fromAdmin || fromAdminFlag || fromAdminReferrer
    if (fromAdminFlag) {
      window.sessionStorage.removeItem(RECEVABLES_FROM_ADMIN_KEY)
    }

    const hasAccess = window.sessionStorage.getItem(AUTH_KEY) === 'yes'
    if (!allowWithoutAuth && !hasAccess) {
      router.replace('/admin')
      return
    }

    const loadEntries = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchMyWorkEntries()
        setEntries(data)
        setReceivedDrafts(
          data.reduce<Record<string, string>>((acc, item) => {
            acc[item.id] = item.total_received === null || item.total_received === undefined
              ? ''
              : String(item.total_received)
            return acc
          }, {})
        )
      } catch (err: any) {
        setError(err?.message || 'डेटा लोड करताना समस्या आली')
      } finally {
        setLoading(false)
      }
    }

    loadEntries()
  }, [router, searchParams])

  const thisMonthTotals = useMemo(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()

    const currentMonthRows = entries.filter((item) => {
      const d = new Date(item.created_at)
      return d.getMonth() === month && d.getFullYear() === year
    })

    const totalReceivable = currentMonthRows.reduce((sum, item) => sum + Number(item.total_receivable || 0), 0)
    const totalReceived = currentMonthRows.reduce((sum, item) => sum + Number(item.total_received || 0), 0)

    return { totalReceivable, totalReceived }
  }, [entries])

  const handleSaveReceived = async (id: string) => {
    const draft = receivedDrafts[id] ?? ''
    const value = draft.trim() === '' ? null : Number(draft)

    if (value !== null && (Number.isNaN(value) || value < 0)) {
      toast.error('Received amount must be a valid non-negative number')
      return
    }

    const row = entries.find((item) => item.id === id)
    if (row && value !== null && value > Number(row.total_receivable || 0)) {
      toast.error('Received amount cannot be greater than total receivable')
      return
    }

    try {
      setUpdatingId(id)
      const updated = await updateMyWorkReceived(id, value)
      setEntries((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)))
      setReceivedDrafts((prev) => ({
        ...prev,
        [id]: updated.total_received === null || updated.total_received === undefined ? '' : String(updated.total_received),
      }))
      toast.success('Received amount updated successfully')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update received amount')
    } finally {
      setUpdatingId('')
    }
  }

  return (
    <main className={styles.recevablesPage}>
      <section className={styles.panel}>
        <div className={styles.headerRow}>
          <div>
            <p className={styles.badge}>Admin Recevables</p>
            <h1>Recevables Tracker</h1>
            <p className={styles.subtitle}>My Work entries with receivable and received tracking</p>
          </div>
          <button className={styles.backBtn} onClick={() => router.push('/admin')}>
            Back to Admin
          </button>
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <span>This Month Total Receivables</span>
            <strong>Rs. {formatMoney(thisMonthTotals.totalReceivable)}</strong>
          </div>
          <div className={styles.summaryCard}>
            <span>This Month Total Received</span>
            <strong>Rs. {formatMoney(thisMonthTotals.totalReceived)}</strong>
          </div>
        </div>

        {loading && <div className={styles.infoCard}>डेटा लोड होत आहे...</div>}
        {error && !loading && <div className={styles.errorCard}>{error}</div>}

        {!loading && !error && entries.length === 0 && (
          <div className={styles.infoCard}>अजून कोणतीही नोंद नाही.</div>
        )}

        {!loading && !error && entries.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Program</th>
                  <th>Place</th>
                  <th>Dates</th>
                  <th>Total Receivable</th>
                  <th>Total Received</th>
                  <th>Remaining</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((item, index) => {
                  const isUpdating = updatingId === item.id
                  return (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.employee_name}</td>
                      <td>{item.program}</td>
                      <td>{item.work_place}</td>
                      <td>{formatDates(item.work_dates)}</td>
                      <td>Rs. {formatMoney(item.total_receivable)}</td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          className={styles.receivedInput}
                          value={receivedDrafts[item.id] ?? ''}
                          onChange={(e) =>
                            setReceivedDrafts((prev) => ({
                              ...prev,
                              [item.id]: e.target.value,
                            }))
                          }
                          disabled={isUpdating}
                        />
                      </td>
                      <td>
                        Rs. {formatMoney(item.receivable_remaining)}
                      </td>
                      <td>{formatDate(item.created_at)}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.saveBtn}
                          onClick={() => handleSaveReceived(item.id)}
                          disabled={isUpdating}
                        >
                          {isUpdating ? 'Saving...' : 'Save'}
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
