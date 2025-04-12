import Link from 'next/link'
import styles from './heroSection2.module.scss'

const HeroSection2 = () => {
  return (
    <section className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.heading}>Our Portfolio</h2>
        <p className={styles.description}>
          Discover our stunning collection of memorable moments captured through our lens.
        </p>
        <Link href="/portfolio">
          <button className={styles.cta}>View Gallery</button>
        </Link>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>About Us</h2>
        <p className={styles.description}>
          Professional photography services with years of experience in capturing life's precious moments.
        </p>
        <Link href="/about">
          <button className={styles.cta}>Learn More</button>
        </Link>
      </div>

      <div className={styles.section}>
        <h2 className={styles.heading}>Services Offered</h2>
        <p className={styles.description}>
          From weddings to corporate events, we offer a wide range of professional photography services.
        </p>
        <Link href="/services">
          <button className={styles.cta}>Explore Services</button>
        </Link>
      </div>
    </section>
  )
}

export default HeroSection2
