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
          alt="Professional Photography"
          fill
          style={{ objectFit: 'cover' }}
          priority
          quality={95}
        />
      </div>

      <div className={styles.content}>
        <h1 className={styles.heading}>
          Capturing Life's Most{' '}
          <span className={styles.highlight}>Beautiful Moments</span>
        </h1>
        <p className={styles.subtitle}>
          Professional photography that tells your unique story with elegance and artistry
        </p>
        <div className={styles.heroButtons}>
          <Link href="/portfolio">
            <button className={styles.contactButton}>
              View Our Work
            </button>
          </Link>
          <Link href="tel:+918766590188" className={styles.callButton}>
            <Image
              src="/assets/icons/Callicon.svg"
              alt="Call Icon"
              width={20}
              height={20}
              className={styles.callIcon}
            />
            <span>Call Us Now</span>
          </Link>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <div className={styles.scrollArrow}></div>
        <div className={styles.scrollText}>Scroll</div>
      </div>
    </section>
  )
}

export default HeroSection