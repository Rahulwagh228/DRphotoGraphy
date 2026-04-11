import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from './HeroSection.module.scss'

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className={styles.heroSection}>
      <div 
        className={styles.backgroundContainer}
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <Image
          src="/assets/hero-section-image.png"
          alt="व्यावसायिक छायाचित्रण"
          fill
          style={{ objectFit: 'cover' }}
          priority
          quality={95}
        />
      </div>

      <div className={styles.content}>
        <h1 className={styles.heading}>
          आयुष्यातील सुंदर{' '}
          <span className={styles.highlight}>क्षण टिपूया</span>
        </h1>
        <p className={styles.subtitle}>
          तुमच्या अनमोल क्षणांना कलात्मकता आणि व्यावसायिकतेने जपणारी छायाचित्रण सेवा
        </p>
        <div className={styles.heroButtons}>
          <Link href="/form">
            <button className={styles.contactButton}>
              आत्ताच बुकिंग करा
            </button>
          </Link>
          <Link href="tel:+918766590188" className={styles.callButton}>
            <Image
              src="/assets/icons/Callicon.svg"
              alt="कॉल करा"
              width={20}
              height={20}
              className={styles.callIcon}
            />
            <span>आम्हाला कॉल करा</span>
          </Link>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.scrollArrow}></div>
        <div className={styles.scrollText}>खाली स्क्रोल करा</div>
      </div>
    </section>
  )
}

export default HeroSection