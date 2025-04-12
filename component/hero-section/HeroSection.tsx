import Image from 'next/image'
import Link from 'next/link'
import styles from './HeroSection.module.scss'

const HeroSection = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.backgroundContainer}>
        <Image
          src="/assets/hero-section-image.png"
          alt="Hero Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.content}>
        <h1 className={styles.heading}>
          Book your fairytale shoot
        </h1>
        
        <Link href="/contact">
          <button className={styles.contactButton}>
            Contact Now
          </button>
        </Link>
      </div>
    </section>
  )
}

export default HeroSection
