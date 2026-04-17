'use client'

import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import toast from 'react-hot-toast'
import styles from './MyWork.module.scss'
import { MyWorkFormData, submitMyWorkEntry } from '@/lib/supabase'

export default function MyWorkPage() {
  const [formData, setFormData] = useState({
    employee_name: '',
    work_place: '',
    total_receivable: '',
    work_dates: [''],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (index: number, value: string) => {
    const updatedDates = [...formData.work_dates]
    updatedDates[index] = value
    setFormData((prev) => ({ ...prev, work_dates: updatedDates }))
  }

  const addDateField = () => {
    setFormData((prev) => ({ ...prev, work_dates: [...prev.work_dates, ''] }))
  }

  const removeDateField = (index: number) => {
    if (formData.work_dates.length <= 1) return
    const updatedDates = formData.work_dates.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, work_dates: updatedDates }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!formData.employee_name.trim()) {
      setErrorMessage('कृपया नाव भरा')
      return
    }

    if (!formData.work_place.trim()) {
      setErrorMessage('कृपया ठिकाण भरा')
      return
    }

    const cleanedDates = formData.work_dates.map((d) => d.trim()).filter((d) => d !== '')
    if (cleanedDates.length === 0) {
      setErrorMessage('कृपया किमान एक तारीख भरा')
      return
    }

    const totalReceivable = Number(formData.total_receivable)
    if (Number.isNaN(totalReceivable) || totalReceivable < 0) {
      setErrorMessage('कृपया एक वैध एकूण घेणे रक्कम भरा')
      return
    }

    setIsSubmitting(true)
    try {
      const payload: MyWorkFormData = {
        employee_name: formData.employee_name.trim(),
        work_place: formData.work_place.trim(),
        work_dates: cleanedDates,
        total_receivable: totalReceivable,
      }

      await submitMyWorkEntry(payload)
      toast.success('My Work नोंद यशस्वीरित्या सेव्ह झाली')
      setFormData({
        employee_name: '',
        work_place: '',
        total_receivable: '',
        work_dates: [''],
      })
    } catch (error: any) {
      const message = error?.message || 'डेटा सेव्ह करताना समस्या आली'
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className={styles.myWorkPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Work Form</h1>
          <p>इतरांच्या बुकिंगवर कर्मचारी म्हणून गेलेल्या दिवसांची नोंद करा</p>
        </div>

        {errorMessage && <div className={styles.errorCard}>{errorMessage}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="employee_name">नाव</label>
            <input
              id="employee_name"
              name="employee_name"
              type="text"
              value={formData.employee_name}
              onChange={handleChange}
              placeholder="उदा. राहुल वाघ"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="work_place">ठिकाण</label>
            <input
              id="work_place"
              name="work_place"
              type="text"
              value={formData.work_place}
              onChange={handleChange}
              placeholder="उदा. पुणे"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>तारीख (एकापेक्षा जास्त जोडू शकता)</label>
            <div className={styles.datesWrap}>
              {formData.work_dates.map((date, index) => (
                <div key={index} className={styles.dateRow}>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    className={styles.input}
                    required={index === 0}
                  />
                  {formData.work_dates.length > 1 && (
                    <button
                      type="button"
                      className={styles.removeBtn}
                      onClick={() => removeDateField(index)}
                      aria-label="तारीख काढा"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" className={styles.addBtn} onClick={addDateField}>
              + आणखी तारीख जोडा
            </button>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="total_receivable">एकूण घेणे (Total Receivable)</label>
            <input
              id="total_receivable"
              name="total_receivable"
              type="number"
              min={0}
              step="0.01"
              value={formData.total_receivable}
              onChange={handleChange}
              placeholder="उदा. 5000"
              className={styles.input}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'सेव्ह होत आहे...' : 'नोंद सेव्ह करा'}
          </button>
        </form>
      </div>
    </section>
  )
}
