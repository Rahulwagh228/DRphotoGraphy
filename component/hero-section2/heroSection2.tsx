import Link from 'next/link'
import { useEffect, useRef } from 'react'
import styles from './HeroSection2.module.scss'

// Simple icons as SVG components
const PortfolioIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21,15 16,10 5,21"/>
  </svg>
)

const AboutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const ServicesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <h2>Why Choose Our Photography</h2>
        <p>We combine artistic vision with technical expertise to create timeless memories</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <div className={styles.icon}>
            <PortfolioIcon />
          </div>
          <h3 className={styles.heading}>Stunning Portfolio</h3>
          <p className={styles.description}>
            Explore our curated collection of breathtaking photographs that showcase our artistic vision and technical mastery across various photography styles.
          </p>
          <Link href="/portfolio">
            <button className={styles.cta}>View Gallery</button>
          </Link>
        </div>

        <div className={styles.section}>
          <div className={styles.icon}>
            <AboutIcon />
          </div>
          <h3 className={styles.heading}>Expert Team</h3>
          <p className={styles.description}>
            Meet our passionate photographers with years of experience in capturing life's most precious moments with creativity and professionalism.
          </p>
          <Link href="/aboutUs">
            <button className={styles.cta}>Meet Our Team</button>
          </Link>
        </div>

        <div className={styles.section}>
          <div className={styles.icon}>
            <ServicesIcon />
          </div>
          <h3 className={styles.heading}>Premium Services</h3>
          <p className={styles.description}>
            From intimate weddings to corporate events, we offer comprehensive photography packages tailored to your unique needs and vision.
          </p>
          <Link href="/services">
            <button className={styles.cta}>Our Services</button>
          </Link>
        </div>
      </div>

      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>500+</span>
            <span className={styles.statLabel}>Happy Clients</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>1000+</span>
            <span className={styles.statLabel}>Events Captured</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>5+</span>
            <span className={styles.statLabel}>Years Experience</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>Awards Won</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection2