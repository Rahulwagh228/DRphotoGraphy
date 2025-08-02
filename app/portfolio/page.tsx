"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Portfolio.module.scss";

// Import all images
import birthday1 from "../../public/assets/portfolio-images/birthday-1.jpg";
import birthday2 from "../../public/assets/portfolio-images/birthday-2.jpg";
import birthday3 from "../../public/assets/portfolio-images/birthday-3.jpg";
import image1 from "../../public/assets/portfolio-images/image-1.jpeg";
import image2 from "../../public/assets/portfolio-images/image-2.jpeg";
import other1 from "../../public/assets/portfolio-images/other-1.jpg";
import other2 from "../../public/assets/portfolio-images/other-2.jpg";
import other3 from "../../public/assets/portfolio-images/other-3.jpg";
import other4 from "../../public/assets/portfolio-images/other-4.jpg";
import other5 from "../../public/assets/portfolio-images/other-5.jpg";

type Category = "wedding" | "birthday" | "other";

interface ImageData {
  src: any;
  title: string;
  description: string;
}

const images: Record<Category, ImageData[]> = {
  wedding: [
    { src: image1, title: "Romantic Ceremony", description: "Beautiful wedding moments captured" },
    { src: image2, title: "Wedding Portraits", description: "Elegant couple photography" },
    { src: image1, title: "Reception Joy", description: "Celebration and happiness" },
    { src: image2, title: "Bridal Beauty", description: "Stunning bridal portraits" },
    { src: image1, title: "Sacred Vows", description: "Intimate ceremony moments" },
    { src: image2, title: "Wedding Party", description: "Friends and family together" },
  ],
  birthday: [
    { src: birthday1, title: "Birthday Celebration", description: "Joyful birthday moments" },
    { src: birthday2, title: "Party Fun", description: "Capturing the excitement" },
    { src: birthday3, title: "Special Moments", description: "Memorable birthday shots" },
    { src: birthday1, title: "Cake Cutting", description: "Sweet celebration moments" },
    { src: birthday2, title: "Happy Faces", description: "Pure joy and laughter" },
    { src: birthday3, title: "Birthday Magic", description: "Creating lasting memories" },
  ],
  other: [
    { src: other1, title: "Portrait Session", description: "Professional headshots" },
    { src: other2, title: "Event Photography", description: "Corporate and social events" },
    { src: other3, title: "Lifestyle Shots", description: "Natural and candid moments" },
    { src: other4, title: "Creative Portraits", description: "Artistic photography" },
    { src: other5, title: "Family Photos", description: "Cherished family moments" },
    { src: other1, title: "Professional Work", description: "High-quality photography" },
  ],
};

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<Category>("wedding");
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (newTab: Category) => {
    if (newTab === activeTab) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(newTab);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className={styles.portfolioContainer}>
      <section className={styles.headerSection}>
        <h1 className={styles.portfolioHeading}>Our Portfolio</h1>
        <p className={styles.subtitle}>
          Discover our collection of stunning photographs that capture life's most precious moments
        </p>
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${
              activeTab === "wedding" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("wedding")}
          >
            Weddings
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "birthday" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("birthday")}
          >
            Birthdays
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "other" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("other")}
          >
            Events & Portraits
          </button>
        </div>
      </section>

      <section className={styles.photosSection}>
        {isLoading ? (
          <div className={styles.loadingState}>
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={styles.loadingSkeleton} />
            ))}
          </div>
        ) : (
          <div className={styles.imageGrid}>
            {images[activeTab].map((imageData, index) => (
              <div key={`${activeTab}-${index}`} className={styles.imageWrapper}>
                <Image
                  src={imageData.src}
                  alt={imageData.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 4}
                />
                <div className={styles.imageOverlay}>
                  <div className={styles.overlayTitle}>{imageData.title}</div>
                  <div className={styles.overlayDescription}>{imageData.description}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}