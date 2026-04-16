'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { submitBooking, BookingFormData } from '@/lib/supabase'
import toast from 'react-hot-toast'
import styles from './Form.module.scss'

const programOptions = [
  { value: '', label: '-- कार्यक्रम निवडा --' },
  { value: 'लग्न समारंभ', label: 'लग्न समारंभ' },
  { value: 'प्री वेडिंग', label: 'प्री वेडिंग' },
  { value: 'वाढदिवस', label: 'वाढदिवस' },
  { value: 'डोहाळे', label: 'डोहाळे' },
  { value: 'साखरपुडा', label: 'साखरपुडा' },
  { value: 'इतर', label: 'इतर' },
]

// Sub-events for लग्न समारंभ
const lagnSubEvents = [
  { key: 'mehandi', label: 'मेहंदी' },
  { key: 'mandav', label: 'मंडव' },
  { key: 'halad', label: 'हळद' },
  { key: 'lagn', label: 'लग्न' },
] as const

type SubEventKey = typeof lagnSubEvents[number]['key']

const albumTypeOptions = [
  { value: '', label: '-- अल्बम प्रकार निवडा --' },
  { value: 'photobook', label: 'Photobook' },
  { value: 'karishma', label: 'Karishma' },
  { value: 'thinkbook', label: 'Thinkbook' },
]

const albumSizeOptions = [
  { value: '', label: '-- अल्बम साईज निवडा --' },
  { value: '250_photos_30_pages', label: '250 photos 30 page' },
  { value: '300_photos_35_pages', label: '300 photos 35 page' },
  { value: '350_photos_40_pages', label: '350 photos 40 page' },
  { value: '400_photos_45_pages', label: '400 photos 45 page' },
  { value: '500_photos_50_pages', label: '500 photos 50 page' },
]

const shootingDurationOptions = [
  { value: '', label: '-- शूटिंग कालावधी निवडा --' },
  { value: '२ तास', label: '२ तास' },
  { value: '२.५ तास', label: '२.५ तास' },
  { value: '३ तास', label: '३ तास' },
  { value: '४ तास', label: '४ तास' },
  { value: 'शूटिंग नाही', label: 'शूटिंग नाही' },
]

const albumPreviewMap: Record<string, { title: string; subtitle: string; image: string }> = {
  photobook: {
    title: 'Photobook Sample',
    subtitle: 'Classic layout with clean full-bleed pages.',
    image: '/assets/aaditi-logo.png',
  },
  karishma: {
    title: 'Karishma Sample',
    subtitle: 'Premium theme with rich matte presentation.',
    image: '/assets/aaditi-logo.png',
  },
  thinkbook: {
    title: 'Thinkbook Sample',
    subtitle: 'Modern storytelling style with cinematic spreads.',
    image: '/assets/aaditi-logo.png',
  },
}

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone_primary: '',
    phone_alternate: '',
    full_address: '',
    program: '',
    other_program: '',
    event_place: '',
    album_type: '',
    album_size: '',
    shooting_duration: '',
    booking_dates: [],
  })

  // Sub-event selection and dates for लग्न समारंभ
  const [selectedSubEvents, setSelectedSubEvents] = useState<Record<SubEventKey, boolean>>({
    mehandi: false,
    mandav: false,
    halad: false,
    lagn: false,
  })
  const [subEventDates, setSubEventDates] = useState<Record<SubEventKey, string>>({
    mehandi: '',
    mandav: '',
    halad: '',
    lagn: '',
  })
  const [subEventPlaces, setSubEventPlaces] = useState<Record<SubEventKey, string>>({
    mehandi: '',
    mandav: '',
    halad: '',
    lagn: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [showAlbumPreview, setShowAlbumPreview] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Reset sub-events when program changes away from लग्न समारंभ
    if (name === 'program' && value !== 'लग्न समारंभ') {
      setSelectedSubEvents({ mehandi: false, mandav: false, halad: false, lagn: false })
      setSubEventDates({ mehandi: '', mandav: '', halad: '', lagn: '' })
      setSubEventPlaces({ mehandi: '', mandav: '', halad: '', lagn: '' })
    }

    // Reset other_program when program changes away from इतर
    if (name === 'program' && value !== 'इतर') {
      setFormData(prev => ({ ...prev, other_program: '', [name]: value }))
    }

    // Reset event_place when switching to लग्न समारंभ
    if (name === 'program' && value === 'लग्न समारंभ') {
      setFormData(prev => ({ ...prev, event_place: '', [name]: value }))
    }

    if (name === 'album_type') {
      setShowAlbumPreview(!!value)
    }
  }

  const handleSubEventToggle = (key: SubEventKey) => {
    setSelectedSubEvents(prev => {
      const newState = { ...prev, [key]: !prev[key] }
      // Clear date if unchecked
      if (!newState[key]) {
        setSubEventDates(prevDates => ({ ...prevDates, [key]: '' }))
        setSubEventPlaces(prevPlaces => ({ ...prevPlaces, [key]: '' }))
      }
      return newState
    })
  }

  const handleSubEventDateChange = (key: SubEventKey, value: string) => {
    setSubEventDates(prev => ({ ...prev, [key]: value }))
  }

  const handleSubEventPlaceChange = (key: SubEventKey, value: string) => {
    setSubEventPlaces(prev => ({ ...prev, [key]: value }))
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
    if (formData.program === 'इतर' && !formData.other_program.trim()) {
      setErrorMessage('कृपया कार्यक्रमाचे नाव लिहा')
      setIsSubmitting(false)
      return
    }
    if (formData.program === 'लग्न समारंभ') {
      const anySelected = Object.values(selectedSubEvents).some(v => v)
      if (!anySelected) {
        setErrorMessage('कृपया किमान एक उपकार्यक्रम निवडा (मेहंदी / मंडव / हळद / लग्न)')
        setIsSubmitting(false)
        return
      }
      // Validate dates for selected sub-events
      for (const evt of lagnSubEvents) {
        if (selectedSubEvents[evt.key] && !subEventDates[evt.key]) {
          setErrorMessage(`कृपया ${evt.label} ची तारीख भरा`)
          setIsSubmitting(false)
          return
        }
        if (selectedSubEvents[evt.key] && !subEventPlaces[evt.key].trim()) {
          setErrorMessage(`कृपया ${evt.label} चे ठिकाण भरा`)
          setIsSubmitting(false)
          return
        }
      }
    }
    if (formData.program && formData.program !== 'लग्न समारंभ' && !formData.event_place.trim()) {
      setErrorMessage('कृपया कार्यक्रमाचे ठिकाण भरा')
      setIsSubmitting(false)
      return
    }
    if (!formData.album_type) {
      setErrorMessage('कृपया अल्बम प्रकार निवडा')
      setIsSubmitting(false)
      return
    }
    if (!formData.album_size) {
      setErrorMessage('कृपया अल्बम साईज निवडा')
      setIsSubmitting(false)
      return
    }
    if (!formData.shooting_duration) {
      setErrorMessage('कृपया शूटिंग कालावधी निवडा')
      setIsSubmitting(false)
      return
    }
    if (!acceptedTerms) {
      setErrorMessage('कृपया अटी व शर्ती मान्य करा')
      setIsSubmitting(false)
      return
    }

    try {
      const submissionData: BookingFormData = {
        name: formData.name.trim(),
        phone_primary: formData.phone_primary.trim(),
        phone_alternate: formData.phone_alternate.trim() || undefined,
        full_address: formData.full_address.trim(),
        program: formData.program === 'इतर' ? `इतर: ${formData.other_program.trim()}` : formData.program,
        other_program: formData.program === 'इतर' ? formData.other_program.trim() : undefined,
        event_place: formData.program !== 'लग्न समारंभ' ? formData.event_place.trim() : undefined,
        album_type: formData.album_type,
        album_size: formData.album_size,
        shooting_duration: formData.shooting_duration,
        booking_dates: [],
        // Sub-event fields (only when लग्न समारंभ)
        mehandi_date: selectedSubEvents.mehandi ? subEventDates.mehandi : undefined,
        mandav_date: selectedSubEvents.mandav ? subEventDates.mandav : undefined,
        halad_date: selectedSubEvents.halad ? subEventDates.halad : undefined,
        lagn_date: selectedSubEvents.lagn ? subEventDates.lagn : undefined,
        mehandi_place: selectedSubEvents.mehandi ? subEventPlaces.mehandi.trim() : undefined,
        mandav_place: selectedSubEvents.mandav ? subEventPlaces.mandav.trim() : undefined,
        halad_place: selectedSubEvents.halad ? subEventPlaces.halad.trim() : undefined,
        lagn_place: selectedSubEvents.lagn ? subEventPlaces.lagn.trim() : undefined,
      }

      await submitBooking(submissionData)
      setSubmitStatus('success')
      toast.success('बुकिंग यशस्वीरित्या पाठवले!')
      // Reset form
      setFormData({
        name: '',
        phone_primary: '',
        phone_alternate: '',
        full_address: '',
        program: '',
        other_program: '',
        event_place: '',
        album_type: '',
        album_size: '',
        shooting_duration: '',
        booking_dates: [],
      })
      setAcceptedTerms(false)
      setSelectedSubEvents({ mehandi: false, mandav: false, halad: false, lagn: false })
      setSubEventDates({ mehandi: '', mandav: '', halad: '', lagn: '' })
      setSubEventPlaces({ mehandi: '', mandav: '', halad: '', lagn: '' })
    } catch (error: any) {
      setSubmitStatus('error')
      setErrorMessage(error.message || 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLagnSamarambh = formData.program === 'लग्न समारंभ'
  const isOther = formData.program === 'इतर'
  const isNonLagnProgramSelected = !!formData.program && formData.program !== 'लग्न समारंभ'
  const selectedAlbumPreview = formData.album_type ? albumPreviewMap[formData.album_type] : undefined

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

          {isNonLagnProgramSelected && (
            <div className={`${styles.formGroup} ${styles.subSection}`}>
              <label htmlFor="event_place" className={styles.label}>
                ठिकाण <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="event_place"
                name="event_place"
                value={formData.event_place}
                onChange={handleChange}
                placeholder="कार्यक्रमाचे ठिकाण लिहा"
                className={styles.input}
                required
              />
            </div>
          )}

          {/* "इतर" (Other) — Custom Program Name */}
          {isOther && (
            <div className={`${styles.formGroup} ${styles.subSection}`}>
              <label htmlFor="other_program" className={styles.label}>
                कार्यक्रमाचे नाव लिहा <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="other_program"
                name="other_program"
                value={formData.other_program}
                onChange={handleChange}
                placeholder="कार्यक्रमाचे नाव येथे लिहा"
                className={styles.input}
                required
              />
            </div>
          )}

          {/* लग्न समारंभ — Sub-events with date pickers */}
          {isLagnSamarambh && (
            <div className={styles.subEventsSection}>
              <label className={styles.label}>
                उपकार्यक्रम निवडा <span className={styles.required}>*</span>
                <span className={styles.dateHint}>(तारखांसह)</span>
              </label>
              <div className={styles.subEventsGrid}>
                {lagnSubEvents.map((evt) => (
                  <div
                    key={evt.key}
                    className={`${styles.subEventCard} ${selectedSubEvents[evt.key] ? styles.subEventActive : ''}`}
                  >
                    <label className={styles.subEventCheckbox}>
                      <input
                        type="checkbox"
                        checked={selectedSubEvents[evt.key]}
                        onChange={() => handleSubEventToggle(evt.key)}
                        className={styles.checkboxInput}
                      />
                      <span className={styles.checkboxCustom}>
                        {selectedSubEvents[evt.key] && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </span>
                      <span className={styles.subEventLabel}>{evt.label}</span>
                    </label>
                    {selectedSubEvents[evt.key] && (
                      <div className={styles.subEventDateWrap}>
                        <input
                          type="date"
                          value={subEventDates[evt.key]}
                          onChange={(e) => handleSubEventDateChange(evt.key, e.target.value)}
                          className={styles.subEventDate}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                        <input
                          type="text"
                          value={subEventPlaces[evt.key]}
                          onChange={(e) => handleSubEventPlaceChange(evt.key, e.target.value)}
                          className={styles.subEventDate}
                          placeholder={`${evt.label} चे ठिकाण`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="album_type" className={`${styles.label} ${styles.albumLabel}`}>
                <span>
                  अल्बम प्रकार <span className={styles.required}>*</span>
                </span>
                <button
                  type="button"
                  className={styles.previewToggle}
                  onClick={() => setShowAlbumPreview(prev => !prev)}
                >
                  <span aria-hidden="true">👁️</span>
                  <span>See Albums</span>
                </button>
              </label>
              <select
                id="album_type"
                name="album_type"
                value={formData.album_type}
                onChange={handleChange}
                className={`${styles.select} ${styles.albumSelect}`}
                required
              >
                {albumTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value ? `👁 ${option.label}` : option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="album_size" className={styles.label}>
                अल्बम साईज <span className={styles.required}>*</span>
              </label>
              <select
                id="album_size"
                name="album_size"
                value={formData.album_size}
                onChange={handleChange}
                className={`${styles.select} ${styles.albumSelect}`}
                required
              >
                {albumSizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="shooting_duration" className={styles.label}>
              शूटिंग कालावधी <span className={styles.required}>*</span>
            </label>
            <select
              id="shooting_duration"
              name="shooting_duration"
              value={formData.shooting_duration}
              onChange={handleChange}
              className={`${styles.select} ${styles.albumSelect}`}
              required
            >
              {shootingDurationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {showAlbumPreview && (
            <div className={`${styles.albumPreviewSection} ${styles.subSection}`}>
              <div className={styles.albumPreviewHeader}>
                <h4>Album Look Preview</h4>
                <p>हे सॅम्पल फोटो आहेत. तुम्ही नंतर तुमचे फोटो बदलू शकता.</p>
              </div>
              {selectedAlbumPreview ? (
                <div className={styles.albumPreviewCard}>
                  <div className={styles.albumPreviewImageWrap}>
                    <Image
                      src={selectedAlbumPreview.image}
                      alt={selectedAlbumPreview.title}
                      width={220}
                      height={150}
                      className={styles.albumPreviewImage}
                    />
                  </div>
                  <div className={styles.albumPreviewContent}>
                    <h5>{selectedAlbumPreview.title}</h5>
                    <p>{selectedAlbumPreview.subtitle}</p>
                  </div>
                </div>
              ) : (
                <p className={styles.previewHint}>Preview पाहण्यासाठी अल्बम प्रकार निवडा.</p>
              )}
            </div>
          )}

          <div className={styles.noticeSection}>
            <h3 className={styles.noticeTitle}>सूचना</h3>
            <ol className={styles.noticeList}>
              <li>ऑर्डर बुक करण्याच्यावेळी कमीत कमी ५०% रक्कम जमा करावी.</li>
              <li>कार्यक्रमाच्या दिवशी शिल्लक रक्कम जमा करावी.</li>
              <li>ऑर्डर झाल्यानंतर १ महिन्याच्या आत आपले फोटो, व्हिडीओ शुटींग चा डाटा घेऊन जाणे नाहीतर डिलीट केले जातील.</li>
              <li>ऐनवेळी ऑर्डर मध्ये वाढ झाल्यास त्याचे शुल्क वेगळे आकारले जाईल.</li>
              <li>मेहंदी व हळदी च्या दिवशी रात्री जास्तीत जास्त ११ वा. पर्यंत फोटोग्राफर थांबेल.</li>
              <li>कार्यक्रम ठरलेल्या वेळेतच चालु करावा. नंतर फोटोग्राफर ला दोष देऊ नये.</li>
              <li>अल्बमचे पेज वाढल्यास त्याचे एक्स्ट्रा चार्जेस द्यावे लागतील.</li>
            </ol>
          </div>

          <div className={styles.termsWrap}>
            <label htmlFor="accept_terms" className={styles.termsLabel}>
              <input
                id="accept_terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className={styles.termsCheckbox}
              />
              <span>मी अटी व शर्ती मान्य करतो/करते.</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || !acceptedTerms}
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
