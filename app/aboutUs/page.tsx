'use client';
import Image from 'next/image';
import styles from './AboutUs.module.scss';
import other1 from '../../public/assets/portfolio-images/other-1.jpg';

export default function AboutUs() {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.heading}>
        <h1>Meet Our Photographers</h1>
      </div>
      
      <div className={styles.photographersGrid}>
        <div className={styles.photographerCard}>
          <div className={styles.photographerImage}>
            <Image
              src={other1}
              alt="Devendra Wagh"
              width={600}
              height={400}
              placeholder="blur"
            />
          </div>
          <div className={styles.photographerContent}>
            <h3>Devendra Wagh</h3>
            <p>
              With over 5 years of experience capturing life's most precious moments, 
              Devendra has developed a unique style that blends contemporary techniques 
              with timeless artistry. His passion for photography began during his 
              college years and has evolved into a masterful craft, specializing in 
              wedding photography and portrait sessions. Known for his ability to 
              capture raw emotions and create stunning compositions, Devendra's work 
              has been featured in various local exhibitions.
            </p>
          </div>
        </div>

        <div className={styles.photographerCard}>
          <div className={styles.photographerImage}>
            <Image
              src={other1}
              alt="Tushar Gangurde"
              width={600}
              height={400}
              placeholder="blur"
            />
          </div>
          <div className={styles.photographerContent}>
            <h3>Tushar Gangurde</h3>
            <p>
              Tushar brings a fresh and innovative perspective to photography, with a 
              keen eye for detail and natural light. His journey in photography started 
              with landscape photography, which evolved into capturing beautiful moments 
              at events and celebrations. Specializing in creative portraiture and event 
              photography, Tushar's work is characterized by its vibrant energy and 
              authentic storytelling approach. His modern techniques combined with 
              classical training create unforgettable visual narratives.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
