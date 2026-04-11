"use client";
import Image from "next/image";
import styles from "./AboutUs.module.scss";
import other1 from "../../public/assets/portfolio-images/other-1.jpg";

// Simple social media icons as SVG components
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
  </svg>
);

export default function AboutUs() {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.heading}>
        <h1>आमच्या सर्जनशील टीमला भेटा</h1>
        <p className={styles.subtitle}>
          कलात्मक दृष्टी आणि तांत्रिक उत्कृष्टतेने आयुष्यातील सर्वात सुंदर क्षण टिपण्यासाठी समर्पित उत्साही छायाचित्रकार
        </p>
      </div>

      <div className={styles.photographersGrid}>
        <div className={styles.photographerCard}>
          <div className={styles.photographerImage}>
            <Image
              src={other1}
              alt="देवेंद्र वाघ - मुख्य छायाचित्रकार"
              width={600}
              height={400}
              placeholder="blur"
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.socialLinks}>
              <a href="#" aria-label="इन्स्टाग्राम">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="लिंक्डइन">
                <LinkedInIcon />
              </a>
              <a href="#" aria-label="ट्विटर">
                <TwitterIcon />
              </a>
            </div>
          </div>
          <div className={styles.photographerContent}>
            <h3 className={styles.name}>देवेंद्र वाघ</h3>
            <div className={styles.role}>मुख्य छायाचित्रकार आणि संस्थापक</div>
            <p className={styles.bio}>
              आयुष्यातील अनमोल क्षण टिपण्यात ५ वर्षांहून अधिक अनुभव असलेले देवेंद्र यांनी
              समकालीन तंत्रज्ञान आणि कालातीत कलात्मकतेचा अनोखा मिलाफ साधलेली एक अद्वितीय
              शैली विकसित केली आहे. लग्न छायाचित्रण आणि पोर्ट्रेट सत्रांमध्ये विशेष प्रावीण्य.
            </p>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>३००+</span>
                <span className={styles.statLabel}>लग्नसोहळे</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>५+</span>
                <span className={styles.statLabel}>वर्षांचा अनुभव</span>
              </div>
            </div>
            <button className={styles.contactButton}>देवेंद्र यांना संपर्क करा</button>
          </div>
        </div>

        <div className={styles.photographerCard}>
          <div className={styles.photographerImage}>
            <Image
              src={other1}
              alt="तुषार गांगुर्डे - सर्जनशील छायाचित्रकार"
              width={600}
              height={400}
              placeholder="blur"
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.socialLinks}>
              <a href="#" aria-label="इन्स्टाग्राम">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="लिंक्डइन">
                <LinkedInIcon />
              </a>
              <a href="#" aria-label="ट्विटर">
                <TwitterIcon />
              </a>
            </div>
          </div>
          <div className={styles.photographerContent}>
            <h3 className={styles.name}>तुषार गांगुर्डे</h3>
            <div className={styles.role}>सर्जनशील छायाचित्रकार</div>
            <p className={styles.bio}>
              तुषार छायाचित्रणात एक ताजी आणि नाविन्यपूर्ण दृष्टी आणतात, तपशील
              आणि नैसर्गिक प्रकाश यांचे सूक्ष्म निरीक्षण करतात. सर्जनशील पोर्ट्रेचर
              आणि कार्यक्रम छायाचित्रणात त्यांचे विशेष प्रावीण्य आहे.
            </p>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>२००+</span>
                <span className={styles.statLabel}>कार्यक्रम</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>३+</span>
                <span className={styles.statLabel}>वर्षांचा अनुभव</span>
              </div>
            </div>
            <button className={styles.contactButton}>तुषार यांना संपर्क करा</button>
          </div>
        </div>
      </div>
      
      <div className={styles.storySection}>
        <div className={styles.container}>
          <h2>आमची कथा</h2>
          <p>
            प्रामाणिक क्षण टिपण्याच्या आवडीतून स्थापित, आदिती फोटोग्राफी एका छोट्या सर्जनशील उपक्रमातून व्यावसायिक छायाचित्रणातील एक विश्वासार्ह नाव बनली आहे. आम्ही विश्वास ठेवतो की प्रत्येक क्षण एक कथा सांगतो, आणि त्या कथा कलात्मक उत्कृष्टता आणि भावनिक खोलीने जपणे हे आमचे ध्येय आहे.
          </p>
          <p>
            आमची टीम अनेक वर्षांचा अनुभव, अत्याधुनिक उपकरणे आणि तंत्रज्ञान यांचा संगम करून असे छायाचित्र तयार करते जे तुमच्या विशेष प्रसंगांना केवळ दस्तऐवजीकृतच करत नाही तर त्यांना कालातीत कलाकृतींमध्ये रूपांतरित करतात.
          </p>
        </div>
      </div>
    </div>
  );
}