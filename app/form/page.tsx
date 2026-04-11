'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { submitBooking, BookingFormData } from '@/lib/supabase'
import styles from './Form.module.scss'

const programOptions = [
  { value: '', label: '-- कार्यक्रम निवडा --' },
  { value: 'लग्न संपूर्ण सोहळा', label: 'लग्न संपूर्ण सोहळा' },
  { value: 'साखरपुडा', label: 'साखरपुडा' },
  { value: 'हळदी समारंभ', label: 'हळदी समारंभ' },
  { value: 'मेहंदी समारंभ', label: 'मेहंदी समारंभ' },
  { value: 'संगीत रात्र', label: 'संगीत रात्र' },
  { value: 'रिसेप्शन', label: 'रिसेप्शन' },
  { value: 'वाढदिवस', label: 'वाढदिवस' },
  { value: 'बारसे / नामकरण', label: 'बारसे / नामकरण' },
  { value: 'गृहप्रवेश', label: 'गृहप्रवेश' },
  { value: 'प्री-वेडिंग शूट', label: 'प्री-वेडिंग शूट' },
  { value: 'पोर्ट्रेट शूट', label: 'पोर्ट्रेट शूट' },
  { value: 'कॉर्पोरेट कार्यक्रम', label: 'कॉर्पोरेट कार्यक्रम' },
  { value: 'इतर', label: 'इतर' },
]

const dayOptions = [
  { value: 0, label: '-- दिवस निवडा --' },
  { value: 1, label: '१ दिवस' },
  { value: 2, label: '२ दिवस' },
  { value: 3, label: '३ दिवस' },
  { value: 4, label: '४ दिवस' },
  { value: 5, label: '५ दिवस' },
  { value: 6, label: '६ दिवस' },
  { value: 7, label: '७ दिवस' },
  { value: 8, label: '७+ दिवस' },
]

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone_primary: '',
    phone_alternate: '',
    full_address: '',
    program: '',
    num_days: 0,
    booking_dates: [''],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'num_days' ? parseInt(value) : value,
    }))
  }

  const handleDateChange = (index: number, value: string) => {
    const newDates = [...formData.booking_dates]
    newDates[index] = value
    setFormData(prev => ({ ...prev, booking_dates: newDates }))
  }

  const addDateField = () => {
    setFormData(prev => ({
      ...prev,
      booking_dates: [...prev.booking_dates, ''],
    }))
  }

  const removeDateField = (index: number) => {
    if (formData.booking_dates.length <= 1) return
    const newDates = formData.booking_dates.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, booking_dates: newDates }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    // Validation
    if (!formData.name.trim()) {
      setErrorMessage('कृपया तुमचे नाव भरा')
      setIsSubmitting(false)
      return
    }
    if (!formData.phone_primary.trim()) {
      setErrorMessage('कृपया तुमचा फोन नंबर भरा')
      setIsSubmitting(false)
      return
    }
    if (!formData.full_address.trim()) {
      setErrorMessage('कृपया तुमचा संपूर्ण पत्ता भरा')
      setIsSubmitting(false)
      return
    }
    if (!formData.program) {
      setErrorMessage('कृपया कार्यक्रम निवडा')
      setIsSubmitting(false)
      return
    }
    if (formData.num_days === 0) {
      setErrorMessage('कृपया दिवसांची संख्या निवडा')
      setIsSubmitting(false)
      return
    }
    if (!formData.booking_dates[0]) {
      setErrorMessage('कृपया किमान एक बुकिंग तारीख भरा')
      setIsSubmitting(false)
      return
    }

    try {
      const submissionData: BookingFormData = {
        name: formData.name.trim(),
        phone_primary: formData.phone_primary.trim(),
        phone_alternate: formData.phone_alternate.trim() || undefined,
        full_address: formData.full_address.trim(),
        program: formData.program,
        num_days: formData.num_days,
        booking_dates: formData.booking_dates.filter(d => d !== ''),
      }

      await submitBooking(submissionData)
      setSubmitStatus('success')
      // Reset form
      setFormData({
        name: '',
        phone_primary: '',
        phone_alternate: '',
        full_address: '',
        program: '',
        num_days: 0,
        booking_dates: [''],
      })
    } catch (error: any) {
      setSubmitStatus('error')
      setErrorMessage(error.message || 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Dynamic date fields based on num_days
  const showMultipleDates = formData.num_days > 2

  return (
    <div className={styles.formPage}>
      {/* Decorative background */}
      <div className={styles.bgDecoration}>
        <div className={styles.bgCircle1}></div>
        <div className={styles.bgCircle2}></div>
        <div className={styles.bgCircle3}></div>
      </div>

      <div className={styles.formContainer}>
        {/* Form Header */}
        <div className={styles.formHeader}>
          <div className={styles.logoSection}>
            <Image
              src="/assets/aaditi-logo.png"
              alt="आदिती फोटोग्राफी"
              width={90}
              height={90}
              className={styles.formLogo}
            />
          </div>
          <h1 className={styles.formTitle}>
            <span className={styles.titleAccent}>आदिती</span>
            <span className={styles.titleSub}>फोटोग्राफी</span>
          </h1>
          <p className={styles.formSubtitle}>बुकिंग फॉर्म</p>
          <div className={styles.titleDivider}>
            <div className={styles.dividerLine}></div>
            <div className={styles.dividerIcon}>📸</div>
            <div className={styles.dividerLine}></div>
          </div>
          <p className={styles.formDescription}>
            तुमच्या अनमोल क्षणांना कायमस्वरूपी जपण्यासाठी खालील माहिती भरा
          </p>
        </div>

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✅</div>
            <h3>बुकिंग यशस्वीरित्या पाठवले!</h3>
            <p>आम्ही तुमच्याशी लवकरच संपर्क साधू. धन्यवाद!</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && submitStatus !== 'success' && (
          <div className={styles.errorMessage}>
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Name Field */}
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              संपूर्ण नाव <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="तुमचे संपूर्ण नाव लिहा"
              className={styles.input}
              required
            />
          </div>

          {/* Phone Numbers */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="phone_primary" className={styles.label}>
                मोबाईल नंबर <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                id="phone_primary"
                name="phone_primary"
                value={formData.phone_primary}
                onChange={handleChange}
                placeholder="उदा. ९८७६५४३२१०"
                className={styles.input}
                required
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone_alternate" className={styles.label}>
                पर्यायी नंबर <span className={styles.optional}>(ऐच्छिक)</span>
              </label>
              <input
                type="tel"
                id="phone_alternate"
                name="phone_alternate"
                value={formData.phone_alternate}
                onChange={handleChange}
                placeholder="पर्यायी नंबर लिहा"
                className={styles.input}
                pattern="[0-9]{10}"
                maxLength={10}
              />
            </div>
          </div>

          {/* Full Address */}
          <div className={styles.formGroup}>
            <label htmlFor="full_address" className={styles.label}>
              संपूर्ण पत्ता <span className={styles.required}>*</span>
            </label>
            <textarea
              id="full_address"
              name="full_address"
              value={formData.full_address}
              onChange={handleChange}
              placeholder="तुमचा संपूर्ण पत्ता लिहा (गाव/शहर, तालुका, जिल्हा)"
              className={styles.textarea}
              rows={3}
              required
            />
          </div>

          {/* Program Dropdown */}
          <div className={styles.formGroup}>
            <label htmlFor="program" className={styles.label}>
              कार्यक्रम <span className={styles.required}>*</span>
            </label>
            <select
              id="program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              className={styles.select}
              required
            >
              {programOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Days */}
          <div className={styles.formGroup}>
            <label htmlFor="num_days" className={styles.label}>
              किती दिवस <span className={styles.required}>*</span>
            </label>
            <select
              id="num_days"
              name="num_days"
              value={formData.num_days}
              onChange={handleChange}
              className={styles.select}
              required
            >
              {dayOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Booking Dates */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              बुकिंग तारीख {showMultipleDates && <span className={styles.dateHint}>(अनेक तारखा भरता येतील)</span>}
              <span className={styles.required}>*</span>
            </label>
            <div className={styles.datesContainer}>
              {formData.booking_dates.map((date, index) => (
                <div key={index} className={styles.dateRow}>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    className={styles.input}
                    required={index === 0}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {formData.booking_dates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDateField(index)}
                      className={styles.removeDateBtn}
                      aria-label="तारीख काढा"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              {showMultipleDates && (
                <button
                  type="button"
                  onClick={addDateField}
                  className={styles.addDateBtn}
                >
                  + आणखी तारीख जोडा
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className={styles.submitLoading}>
                <span className={styles.spinner}></span>
                पाठवत आहे...
              </span>
            ) : (
              'बुकिंग पाठवा'
            )}
          </button>
        </form>

        {/* Contact Info */}
        <div className={styles.contactInfo}>
          <p>काही शंका असल्यास संपर्क करा:</p>
          <a href="tel:+918766590188" className={styles.contactLink}>
            📞 +91 8766590188
          </a>
          <a href="https://wa.me/918766590188" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
            💬 व्हॉट्सॲपवर संपर्क करा
          </a>
        </div>
      </div>
    </div>
  )
}
