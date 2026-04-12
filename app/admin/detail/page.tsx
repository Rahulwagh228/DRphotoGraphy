'use client'

import { Suspense, useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  BookingRecord,
  BookingStatus,
  BookingExpense,
  ExpenseCategory,
  fetchBookingById,
  fetchExpensesByBookingId,
  updateBookingStatus,
  updateBookingPayments,
  hideBooking,
  addExpense,
  updateExpense,
  deleteExpense,
} from '@/lib/supabase'
import toast from 'react-hot-toast'
import styles from './Detail.module.scss'

/* ─── Constants ─── */
const AUTH_KEY = 'dr_admin_access'
const statusOptions: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']
const expenseCategories: { value: ExpenseCategory; label: string }[] = [
  { value: 'crew', label: 'Crew / कामगार' },
  { value: 'album_making', label: 'Album Making' },
  { value: 'editor', label: 'Editor' },
  { value: 'other', label: 'Other' },
]

/* ─── Helpers ─── */
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

function formatDateTime(value?: string | null) {
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

function formatBookingDates(dates: string[]) {
  if (!dates || dates.length === 0) return '-'
  return dates
    .map((item) => {
      const date = new Date(item)
      return Number.isNaN(date.getTime())
        ? item
        : date.toLocaleDateString('mr-IN', { day: '2-digit', month: 'short', year: 'numeric' })
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

function getCategoryStyle(category: string) {
  switch (category) {
    case 'album_making':
      return styles.catAlbumMaking
    case 'editor':
      return styles.catEditor
    case 'crew':
      return styles.catCrew
    default:
      return styles.catOther
  }
}

function getCategoryLabel(category: string) {
  const found = expenseCategories.find((c) => c.value === category)
  return found ? found.label : category
}

/* ─── Empty expense form ─── */
const emptyExpenseForm = {
  category: 'crew' as ExpenseCategory,
  person_name: '',
  description: '',
  amount: '',
}

/* ═══════════════════════════════════════════
   Detail Page Component
   ═══════════════════════════════════════════ */
function BookingDetailInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('id') || ''

  /* ─── State ─── */
  const [booking, setBooking] = useState<BookingRecord | null>(null)
  const [expenses, setExpenses] = useState<BookingExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  // Payment draft
  const [paymentDraft, setPaymentDraft] = useState({ done: '', total: '' })

  // Expense form modal
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)
  const [expenseForm, setExpenseForm] = useState(emptyExpenseForm)

  /* ─── Auth check ─── */
  const [isAuthed, setIsAuthed] = useState(false)
  useEffect(() => {
    const hasAccess = window.sessionStorage.getItem(AUTH_KEY) === 'yes'
    if (!hasAccess) {
      router.replace('/admin')
      return
    }
    setIsAuthed(true)
  }, [router])

  /* ─── Load data ─── */
  const loadData = useCallback(async () => {
    if (!bookingId) {
      setError('Booking ID not found in URL')
      setLoading(false)
      return
    }

    try {
      setError('')
      setLoading(true)
      const [bk, exps] = await Promise.all([
        fetchBookingById(bookingId),
        fetchExpensesByBookingId(bookingId),
      ])
      setBooking(bk)
      setExpenses(exps)
      setPaymentDraft({
        done: bk.payment_done === null || bk.payment_done === undefined ? '' : String(bk.payment_done),
        total: bk.payment_total === null || bk.payment_total === undefined ? '' : String(bk.payment_total),
      })
    } catch (err: any) {
      setError(err.message || 'डेटा लोड करताना समस्या आली')
      toast.error(err?.message || 'Failed to load booking details')
    } finally {
      setLoading(false)
    }
  }, [bookingId])

  useEffect(() => {
    if (isAuthed) loadData()
  }, [isAuthed, loadData])

  /* ─── Status change ─── */
  const handleStatusChange = async (newStatus: string) => {
    if (!booking) return
    try {
      setUpdatingId('status')
      const updated = await updateBookingStatus(booking.id, newStatus as BookingStatus)
      setBooking((prev) => (prev ? { ...prev, ...updated } : prev))
      toast.success('Status updated successfully')
    } catch (err: any) {
      setError(err.message || 'Status update failed')
      toast.error(err?.message || 'Status update failed')
    } finally {
      setUpdatingId('')
    }
  }

  /* ─── Delete (hide) ─── */
  const handleDelete = async () => {
    if (!booking) return
    const ok = window.confirm(`तुम्हाला ${booking.name} ची नोंद delete करायची आहे का?`)
    if (!ok) return
    try {
      setUpdatingId('delete')
      await hideBooking(booking.id)
      toast.success('Booking deleted successfully')
      router.replace('/admin')
    } catch (err: any) {
      setError(err.message || 'Delete failed')
      toast.error(err?.message || 'Delete failed')
    } finally {
      setUpdatingId('')
    }
  }

  /* ─── Payment save ─── */
  const handlePaymentSave = async () => {
    if (!booking) return
    const doneVal = paymentDraft.done.trim() === '' ? null : Number(paymentDraft.done)
    const totalVal = paymentDraft.total.trim() === '' ? null : Number(paymentDraft.total)

    if (
      (doneVal !== null && (Number.isNaN(doneVal) || doneVal < 0)) ||
      (totalVal !== null && (Number.isNaN(totalVal) || totalVal < 0))
    ) {
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
      setUpdatingId('payment')
      const updated = await updateBookingPayments(booking.id, doneVal, totalVal)
      setBooking((prev) => (prev ? { ...prev, ...updated } : prev))
      setPaymentDraft({
        done: updated.payment_done === null ? '' : String(updated.payment_done),
        total: updated.payment_total === null ? '' : String(updated.payment_total),
      })
      toast.success('Payment updated successfully')
    } catch (err: any) {
      setError(err.message || 'Payment update failed')
      toast.error(err?.message || 'Payment update failed')
    } finally {
      setUpdatingId('')
    }
  }

  /* ─── Expense CRUD ─── */
  const openAddExpense = () => {
    setEditingExpenseId(null)
    setExpenseForm({ ...emptyExpenseForm })
    setShowExpenseForm(true)
  }

  const openEditExpense = (exp: BookingExpense) => {
    setEditingExpenseId(exp.id)
    setExpenseForm({
      category: exp.category,
      person_name: exp.person_name,
      description: exp.description,
      amount: String(exp.amount),
    })
    setShowExpenseForm(true)
  }

  const handleExpenseSubmit = async () => {
    if (!booking) return
    const amt = Number(expenseForm.amount)
    if (!expenseForm.person_name.trim()) {
      setError('Person / vendor name is required')
      toast.error('Person or vendor name is required')
      return
    }
    if (Number.isNaN(amt) || amt < 0) {
      setError('Amount must be a valid positive number')
      toast.error('Amount must be a valid positive number')
      return
    }

    try {
      setError('')
      setUpdatingId('expense')
      if (editingExpenseId) {
        const updated = await updateExpense(editingExpenseId, {
          category: expenseForm.category,
          person_name: expenseForm.person_name,
          description: expenseForm.description,
          amount: amt,
        })
        setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
        toast.success('Expense updated successfully')
      } else {
        const created = await addExpense({
          booking_id: booking.id,
          category: expenseForm.category,
          person_name: expenseForm.person_name,
          description: expenseForm.description,
          amount: amt,
        })
        setExpenses((prev) => [...prev, created])
        toast.success('Expense added successfully')
      }
      setShowExpenseForm(false)
    } catch (err: any) {
      setError(err.message || 'Expense save failed')
      toast.error(err?.message || 'Expense save failed')
    } finally {
      setUpdatingId('')
    }
  }

  const handleExpenseDelete = async (expId: string) => {
    const ok = window.confirm('Delete this expense?')
    if (!ok) return
    try {
      setUpdatingId('expense')
      await deleteExpense(expId)
      setExpenses((prev) => prev.filter((e) => e.id !== expId))
      toast.success('Expense deleted successfully')
    } catch (err: any) {
      setError(err.message || 'Expense delete failed')
      toast.error(err?.message || 'Expense delete failed')
    } finally {
      setUpdatingId('')
    }
  }

  /* ─── Expense breakdowns ─── */
  const expenseBreakdown = useMemo(() => {
    const groups: Record<string, { total: number; items: BookingExpense[] }> = {}
    let grandTotal = 0
    for (const exp of expenses) {
      if (!groups[exp.category]) groups[exp.category] = { total: 0, items: [] }
      groups[exp.category].total += exp.amount
      groups[exp.category].items.push(exp)
      grandTotal += exp.amount
    }
    return { groups, grandTotal }
  }, [expenses])

  /* ─── Render ─── */
  if (!isAuthed) return null

  if (loading) {
    return (
      <main className={styles.detailPage}>
        <div className={styles.bgLayer}>
          <span className={styles.blobOne} />
          <span className={styles.blobTwo} />
        </div>
        <div className={styles.panel}>
          <div className={styles.infoCard}>डेटा लोड होत आहे...</div>
        </div>
      </main>
    )
  }

  if (error && !booking) {
    return (
      <main className={styles.detailPage}>
        <div className={styles.bgLayer}>
          <span className={styles.blobOne} />
          <span className={styles.blobTwo} />
        </div>
        <div className={styles.panel}>
          <button className={styles.backBtn} onClick={() => router.push('/admin')}>
            ← Back to Dashboard
          </button>
          <div className={styles.errorCard}>{error}</div>
        </div>
      </main>
    )
  }

  if (!booking) return null

  const currentStatus = booking.status || 'pending'

  return (
    <main className={styles.detailPage}>
      <div className={styles.bgLayer}>
        <span className={styles.blobOne} />
        <span className={styles.blobTwo} />
      </div>

      <div className={styles.panel}>
        {/* Back Button */}
        <button className={styles.backBtn} onClick={() => router.push('/admin')}>
          ← Back to Dashboard
        </button>

        {/* Error bar */}
        {error && <div className={styles.errorCard}>{error}</div>}

        {/* ═══ Status Header Bar ═══ */}
        <div className={styles.statusBar}>
          <div className={styles.statusBarLeft}>
            <h1>{booking.name}</h1>
            <span className={styles.idText}>ID: {booking.id}</span>
          </div>
          <div className={styles.statusBarRight}>
            <span
              className={`${styles.statusPill} ${styles[`status${currentStatus}`] || styles.statuspending}`}
            >
              {getStatusLabel(currentStatus)}
            </span>
            <select
              className={styles.statusSelect}
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingId === 'status'}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
              disabled={updatingId === 'delete'}
            >
              🗑 Delete
            </button>
          </div>
        </div>

        {/* ═══ Info Cards Grid ═══ */}
        <div className={styles.contentGrid}>
          {/* Contact Info */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span className={styles.cardIcon}>📞</span> Contact Details
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <span className={styles.fieldValue}>{booking.name}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Primary Phone</span>
                <span className={styles.fieldValue}>{booking.phone_primary}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Alternate Phone</span>
                <span className={styles.fieldValue}>{booking.phone_alternate || '-'}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Address</span>
                <span className={styles.fieldValue}>{booking.full_address}</span>
              </div>
            </div>
          </div>

          {/* Program Info */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span className={styles.cardIcon}>🎉</span> Event Details
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Program</span>
                <span className={styles.fieldValue}>{booking.program}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Other Program</span>
                <span className={styles.fieldValue}>{booking.other_program || '-'}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Event Place</span>
                <span className={styles.fieldValue}>{booking.event_place || '-'}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Booking Dates</span>
                <span className={styles.fieldValue}>{formatBookingDates(booking.booking_dates)}</span>
              </div>
            </div>
          </div>

          {/* Album Info */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span className={styles.cardIcon}>📸</span> Album Details
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Album Type</span>
                <span className={styles.fieldValue}>{booking.album_type}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Album Size</span>
                <span className={styles.fieldValue}>{booking.album_size}</span>
              </div>
            </div>
          </div>

          {/* Sub-Event Dates */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span className={styles.cardIcon}>📅</span> Sub-Event Schedule
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Mehandi Date</span>
                <span className={styles.fieldValue}>{formatDateOnly(booking.mehandi_date)}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Mehandi Place</span>
                <span className={styles.fieldValue}>{booking.mehandi_place || '-'}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Mandav Date</span>
                <span className={styles.fieldValue}>{formatDateOnly(booking.mandav_date)}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Mandav Place</span>
                <span className={styles.fieldValue}>{booking.mandav_place || '-'}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Halad Date</span>
                <span className={styles.fieldValue}>{formatDateOnly(booking.halad_date)}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Halad Place</span>
                <span className={styles.fieldValue}>{booking.halad_place || '-'}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Lagn Date</span>
                <span className={styles.fieldValue}>{formatDateOnly(booking.lagn_date)}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Lagn Place</span>
                <span className={styles.fieldValue}>{booking.lagn_place || '-'}</span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className={`${styles.card} ${styles.cardFull}`}>
            <div className={styles.cardTitle}>
              <span className={styles.cardIcon}>🕐</span> Timestamps
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Created At</span>
                <span className={styles.fieldValue}>{formatDateTime(booking.created_at)}</span>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Updated At</span>
                <span className={styles.fieldValue}>
                  {booking.updated_at ? formatDateTime(booking.updated_at) : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ Client Payment Section ═══ */}
        <div className={`${styles.card} ${styles.cardFull}`} style={{ marginBottom: '1.2rem' }}>
          <div className={styles.cardTitle}>
            <span className={styles.cardIcon}>💰</span> Client Payment
          </div>

          <div className={styles.paymentSummary}>
            <div className={`${styles.paymentCard} ${styles.paymentCardTotal}`}>
              <div className={styles.paymentCardLabel}>Total Payment</div>
              <div className={styles.paymentCardValue}>₹{formatMoney(booking.payment_total)}</div>
            </div>
            <div className={`${styles.paymentCard} ${styles.paymentCardDone}`}>
              <div className={styles.paymentCardLabel}>Payment Done</div>
              <div className={styles.paymentCardValue}>₹{formatMoney(booking.payment_done)}</div>
            </div>
            <div className={`${styles.paymentCard} ${styles.paymentCardRemaining}`}>
              <div className={styles.paymentCardLabel}>Remaining</div>
              <div className={styles.paymentCardValue}>₹{formatMoney(booking.payment_remaining)}</div>
            </div>
          </div>

          <div className={styles.paymentEditRow}>
            <div className={styles.paymentFieldGroup}>
              <span className={styles.paymentFieldLabel}>Total Payment</span>
              <div className={styles.paymentFieldWrap}>
                <span className={styles.currencyPrefix}>Rs.</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={paymentDraft.total}
                  onChange={(e) => setPaymentDraft((p) => ({ ...p, total: e.target.value }))}
                  className={styles.paymentInput}
                  placeholder="Total"
                  disabled={updatingId === 'payment'}
                />
              </div>
            </div>
            <div className={styles.paymentFieldGroup}>
              <span className={styles.paymentFieldLabel}>Done Payment</span>
              <div className={styles.paymentFieldWrap}>
                <span className={styles.currencyPrefix}>Rs.</span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={paymentDraft.done}
                  onChange={(e) => setPaymentDraft((p) => ({ ...p, done: e.target.value }))}
                  className={styles.paymentInput}
                  placeholder="Done"
                  disabled={updatingId === 'payment'}
                />
              </div>
            </div>
            <button
              className={styles.paymentSaveBtn}
              onClick={handlePaymentSave}
              disabled={updatingId === 'payment'}
            >
              💾 Save Payment
            </button>
          </div>
        </div>

        {/* ═══ Crew / Vendor Expenses Section ═══ */}
        <div className={`${styles.card} ${styles.cardFull} ${styles.expenseSection}`}>
          <div className={styles.expenseHeader}>
            <div className={styles.cardTitle} style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
              <span className={styles.cardIcon}>👥</span> Crew & Vendor Expenses
            </div>
            <button className={styles.addExpenseBtn} onClick={openAddExpense}>
              ＋ Add Expense
            </button>
          </div>

          {expenses.length === 0 && (
            <div className={styles.emptyState}>No expenses added yet. Click "Add Expense" to start tracking.</div>
          )}

          {expenses.length > 0 && (
            <>
              <div className={styles.expenseTableWrap}>
                <table className={styles.expenseTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Category</th>
                      <th>Person / Vendor</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp, i) => (
                      <tr key={exp.id}>
                        <td>{i + 1}</td>
                        <td>
                          <span className={`${styles.categoryBadge} ${getCategoryStyle(exp.category)}`}>
                            {getCategoryLabel(exp.category)}
                          </span>
                        </td>
                        <td>{exp.person_name}</td>
                        <td>{exp.description || '-'}</td>
                        <td>₹{formatMoney(exp.amount)}</td>
                        <td>{formatDateTime(exp.created_at)}</td>
                        <td>
                          <div className={styles.expenseActions}>
                            <button className={styles.editBtn} onClick={() => openEditExpense(exp)}>
                              ✏️
                            </button>
                            <button
                              className={styles.expDeleteBtn}
                              onClick={() => handleExpenseDelete(exp.id)}
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Category-wise breakdown */}
              <div className={styles.expenseSummary}>
                {expenseCategories.map((cat) => {
                  const group = expenseBreakdown.groups[cat.value]
                  if (!group) return null
                  return (
                    <div className={styles.expenseSumCard} key={cat.value}>
                      <div className={styles.expenseSumLabel}>{cat.label}</div>
                      <div className={styles.expenseSumValue}>₹{formatMoney(group.total)}</div>
                    </div>
                  )
                })}
                <div className={styles.expenseSumCard}>
                  <div className={styles.expenseSumLabel}>Total Expenses</div>
                  <div className={styles.expenseSumValue}>₹{formatMoney(expenseBreakdown.grandTotal)}</div>
                </div>
                {booking.payment_total !== null && booking.payment_total !== undefined && (
                  <div className={styles.expenseSumCard}>
                    <div className={styles.expenseSumLabel}>Net Profit</div>
                    <div className={styles.expenseSumValue}>
                      ₹{formatMoney(booking.payment_total - expenseBreakdown.grandTotal)}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ═══ Add/Edit Expense Modal ═══ */}
      {showExpenseForm && (
        <div className={styles.expenseFormOverlay} onClick={() => setShowExpenseForm(false)}>
          <div className={styles.expenseForm} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.expenseFormTitle}>
              {editingExpenseId ? '✏️ Edit Expense' : '＋ New Expense'}
            </h3>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category</label>
              <select
                className={styles.formSelect}
                value={expenseForm.category}
                onChange={(e) =>
                  setExpenseForm((f) => ({ ...f, category: e.target.value as ExpenseCategory }))
                }
              >
                {expenseCategories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Person / Vendor Name</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="e.g. Rahul - Cameraman"
                value={expenseForm.person_name}
                onChange={(e) => setExpenseForm((f) => ({ ...f, person_name: e.target.value }))}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Description (optional)</label>
              <textarea
                className={styles.formTextarea}
                placeholder="e.g. 2 दिवस शूटिंगसाठी"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Amount (₹)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                className={styles.formInput}
                placeholder="e.g. 5000"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </div>

            <div className={styles.formBtnRow}>
              <button
                className={styles.formSubmitBtn}
                onClick={handleExpenseSubmit}
                disabled={updatingId === 'expense'}
              >
                {editingExpenseId ? 'Update' : 'Add Expense'}
              </button>
              <button className={styles.formCancelBtn} onClick={() => setShowExpenseForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function BookingDetailPage() {
  return (
    <Suspense
      fallback={
        <main className={styles.detailPage}>
          <div className={styles.bgLayer}>
            <span className={styles.blobOne} />
            <span className={styles.blobTwo} />
          </div>
          <div className={styles.panel}>
            <div className={styles.infoCard}>लोड होत आहे...</div>
          </div>
        </main>
      }
    >
      <BookingDetailInner />
    </Suspense>
  )
}
