import Link from 'next/link'
import { useEffect, useRef } from 'react'
import styles from './HeroSection2.module.scss'

// Refined icons as SVG components
const PortfolioIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" ry="3"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21,15 16,10 5,21"/>
  </svg>
)

const AboutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const ServicesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const HeroSection2 = () => {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = sectionRef.current?.querySelectorAll('.fade-in')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={styles.container}>
      <div className={styles.sectionTitle}>
        <h2>आमची छायाचित्रण सेवा का निवडावी?</h2>
        <p>कॅमेरा, ड्रोन आणि सिनेमॅटिक तंत्रज्ञान — तुमच्या आठवणी अमर करण्यासाठी</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <div className={styles.icon}>
            <PortfolioIcon />
          </div>
          <h3 className={styles.heading}>अप्रतिम गॅलरी</h3>
          <p className={styles.description}>
            लग्नसोहळा, ड्रोन शूट, सिनेमॅटिक वेडिंग — 
            प्रत्येक शैलीतील अप्रतिम छायाचित्रांचा संग्रह अनुभवा.
          </p>
          <Link href="/portfolio">
            <button className={styles.cta}>गॅलरी पहा</button>
          </Link>
        </div>

        <div className={styles.section}>
          <div className={styles.icon}>
            <AboutIcon />
          </div>
          <h3 className={styles.heading}>अनुभवी टीम</h3>
          <p className={styles.description}>
            अत्याधुनिक ड्रोन तंत्रज्ञान आणि सिनेमॅटिक कौशल्य — 
            अनुभवी छायाचित्रकारांची कुशल टीम.
          </p>
          <Link href="/aboutUs">
            <button className={styles.cta}>आमची टीम भेटा</button>
          </Link>
        </div>

        <div className={styles.section}>
          <div className={styles.icon}>
            <ServicesIcon />
          </div>
          <h3 className={styles.heading}>विविध सेवा</h3>
          <p className={styles.description}>
            लग्न, वाढदिवस, साखरपुडा, ड्रोन एरियल शूट — 
            सर्वसमावेशक छायाचित्रण पॅकेजेस.
          </p>
          <Link href="/services">
            <button className={styles.cta}>आमच्या सेवा</button>
          </Link>
        </div>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>५००+</span>
            <span className={styles.statLabel}>समाधानी ग्राहक</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>१०००+</span>
            <span className={styles.statLabel}>कार्यक्रम टिपले</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>५+</span>
            <span className={styles.statLabel}>वर्षांचा अनुभव</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>५०+</span>
            <span className={styles.statLabel}>ड्रोन शूट्स</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection2