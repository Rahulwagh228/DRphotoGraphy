'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './Portfolio.module.scss';

// Import all images
import birthday1 from '../../public/assets/portfolio-images/birthday-1.jpg';
import birthday2 from '../../public/assets/portfolio-images/birthday-2.jpg';
import birthday3 from '../../public/assets/portfolio-images/birthday-3.jpg';
import image1 from '../../public/assets/portfolio-images/image-1.jpeg';
import image2 from '../../public/assets/portfolio-images/image-2.jpeg';
import other1 from '../../public/assets/portfolio-images/other-1.jpg';
import other2 from '../../public/assets/portfolio-images/other-2.jpg';
import other3 from '../../public/assets/portfolio-images/other-3.jpg';
import other4 from '../../public/assets/portfolio-images/other-4.jpg';
import other5 from '../../public/assets/portfolio-images/other-5.jpg';

type Category = 'wedding' | 'birthday' | 'other';

const images = {
  wedding: [image1, image2, image1, image2, image1, image2], // 6 wedding photos
  birthday: [birthday1, birthday2, birthday3, birthday1, birthday2, birthday3], // 6 birthday photos
  other: [other1, other2, other3, other4, other5, other1] // 6 other photos
};

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<Category>('wedding');

  return (
    <div className={styles.portfolioContainer}>
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tab} ${activeTab === 'wedding' ? styles.active : ''}`}
          onClick={() => setActiveTab('wedding')}
        >
          Wedding
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'birthday' ? styles.active : ''}`}
          onClick={() => setActiveTab('birthday')}
        >
          Birthday's
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'other' ? styles.active : ''}`}
          onClick={() => setActiveTab('other')}
        >
          Others
        </button>
      </div>

      <div className={styles.imageGrid}>
        {images[activeTab].map((image, index) => (
          <div key={index} className={styles.imageWrapper}>
            <Image
              src={image}
              alt={`${activeTab} photo ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={index < 4}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
