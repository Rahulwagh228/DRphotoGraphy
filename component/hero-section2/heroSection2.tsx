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
        <h2>आमची छायाचित्रण सेवा का निवडावी?</h2>
        <p>आम्ही कलात्मक दृष्टी आणि तांत्रिक कौशल्याचा संगम करून चिरंतन आठवणी निर्माण करतो</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.section}>
          <div className={styles.icon}>
            <PortfolioIcon />
          </div>
          <h3 className={styles.heading}>आकर्षक गॅलरी</h3>
          <p className={styles.description}>
            आमच्या कलात्मक दृष्टी आणि तांत्रिक प्रभुत्वाचे प्रदर्शन करणाऱ्या सुंदर छायाचित्रांचा संग्रह पहा. विविध शैलींमधील अप्रतिम फोटोग्राफी अनुभवा.
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
            आयुष्यातील अनमोल क्षण सर्जनशीलता आणि व्यावसायिकतेने टिपण्यात अनुभवी असलेल्या आमच्या उत्साही छायाचित्रकारांना भेटा.
          </p>
          <Link href="/aboutUs">
            <button className={styles.cta}>आमची टीम भेटा</button>
          </Link>
        </div>

        <div className={styles.section}>
          <div className={styles.icon}>
            <ServicesIcon />
          </div>
          <h3 className={styles.heading}>उत्कृष्ट सेवा</h3>
          <p className={styles.description}>
            लग्नसोहळ्यापासून कॉर्पोरेट कार्यक्रमांपर्यंत, आम्ही तुमच्या विशेष गरजा आणि दृष्टीनुसार सर्वसमावेशक छायाचित्रण पॅकेजेस देतो.
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
            <span className={styles.statLabel}>पुरस्कार मिळवले</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection2