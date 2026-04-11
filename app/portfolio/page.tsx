"use client";
import { useState } from "react";
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
    { src: image1, title: "रोमँटिक सोहळा", description: "सुंदर लग्नाचे क्षण टिपलेले" },
    { src: image2, title: "लग्न पोर्ट्रेट", description: "आकर्षक जोडप्यांचे छायाचित्रण" },
    { src: image1, title: "रिसेप्शनचा आनंद", description: "उत्सव आणि आनंद" },
    { src: image2, title: "वधूचे सौंदर्य", description: "आकर्षक वधु पोर्ट्रेट" },
    { src: image1, title: "पवित्र विधी", description: "जवळचे सोहळ्याचे क्षण" },
    { src: image2, title: "लग्नाचा समारंभ", description: "कुटुंब आणि मित्र एकत्र" },
  ],
  birthday: [
    { src: birthday1, title: "वाढदिवस उत्सव", description: "आनंदी वाढदिवसाचे क्षण" },
    { src: birthday2, title: "पार्टीचा आनंद", description: "उत्साह टिपताना" },
    { src: birthday3, title: "विशेष क्षण", description: "संस्मरणीय वाढदिवसाचे शॉट्स" },
    { src: birthday1, title: "केक कटिंग", description: "गोड उत्सवाचे क्षण" },
    { src: birthday2, title: "आनंदी चेहरे", description: "शुद्ध आनंद आणि हास्य" },
    { src: birthday3, title: "वाढदिवसाची जादू", description: "चिरंतन आठवणी निर्माण करणे" },
  ],
  other: [
    { src: other1, title: "पोर्ट्रेट सत्र", description: "व्यावसायिक हेडशॉट्स" },
    { src: other2, title: "कार्यक्रम छायाचित्रण", description: "कॉर्पोरेट आणि सामाजिक कार्यक्रम" },
    { src: other3, title: "लाइफस्टाइल शॉट्स", description: "नैसर्गिक आणि कॅन्डिड क्षण" },
    { src: other4, title: "सर्जनशील पोर्ट्रेट", description: "कलात्मक छायाचित्रण" },
    { src: other5, title: "कुटुंबाचे फोटो", description: "जपलेले कौटुंबिक क्षण" },
    { src: other1, title: "व्यावसायिक काम", description: "उच्च दर्जाचे छायाचित्रण" },
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
        <h1 className={styles.portfolioHeading}>आमची गॅलरी</h1>
        <p className={styles.subtitle}>
          आयुष्यातील अनमोल क्षण टिपणारी आमची आकर्षक छायाचित्र संग्रह पहा
        </p>
        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${
              activeTab === "wedding" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("wedding")}
          >
            लग्नसोहळे
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "birthday" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("birthday")}
          >
            वाढदिवस
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "other" ? styles.active : ""
            }`}
            onClick={() => handleTabChange("other")}
          >
            कार्यक्रम आणि पोर्ट्रेट
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