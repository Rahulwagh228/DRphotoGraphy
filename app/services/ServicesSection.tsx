import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./Services.module.scss";

interface Service {
  title: string;
  description: string;
  image: string;
  price: string;
  features: string[];
}

const services: Service[] = [
  {
    title: "लग्न छायाचित्रण",
    description:
      "तुमच्या विशेष दिवसातील प्रत्येक जादूई क्षण टिपणारे सर्वसमावेशक लग्न छायाचित्रण पॅकेज जे तुमची अनोखी प्रेमकथा सांगते.",
    image: "/assets/portfolio-images/image-1.jpeg",
    price: "₹२५,०००+",
    features: [
      "पूर्ण दिवसभर कव्हरेज (८-१२ तास)",
      "५०० हून अधिक उच्च-रिझोल्यूशन एडिटेड प्रतिमा",
      "डाउनलोड ऍक्सेस सह ऑनलाइन गॅलरी",
      "ड्रोन शॉट्स आणि एरियल फोटोग्राफी",
      "मोफत प्री-वेडिंग शूट",
      "व्यावसायिक लाइटिंग उपकरणे",
    ],
  },
  {
    title: "वाढदिवस उत्सव",
    description:
      "तुमच्या वाढदिवसाच्या आठवणी कायमस्वरूपी जपा. शुद्ध आनंद आणि उत्सव टिपणाऱ्या आमच्या व्यावसायिक वाढदिवस छायाचित्रण सेवेसह.",
    image: "/assets/portfolio-images/birthday-1.jpg",
    price: "₹१०,०००+",
    features: [
      "४ तासांचे कार्यक्रम कव्हरेज",
      "२०० हून अधिक एडिटेड फोटो",
      "त्याच दिवशी प्रिव्ह्यू गॅलरी",
      "मजेदार प्रॉप्स आणि बॅकड्रॉप्स समाविष्ट",
      "कॅन्डिड आणि पोज्ड शॉट्स",
      "४८ तासांत डिजिटल डिलिव्हरी",
    ],
  },
  {
    title: "साखरपुडा / एंगेजमेंट",
    description:
      "तुमच्या प्रेमकथेचा कलात्मक आणि व्यावसायिक छायाचित्रणासह सुंदर साखरपुडा फोटो सत्रे.",
    image: "/assets/portfolio-images/other-1.jpg",
    price: "₹१५,०००+",
    features: [
      "२ तासांचे रोमँटिक फोटो सत्र",
      "अनेक निसर्गरम्य ठिकाणे",
      "२-३ पोशाख बदल",
      "१०० हून अधिक एडिटेड प्रतिमा",
      "मोफत प्रिंट पॅकेज",
      "व्यावसायिक पोझिंग मार्गदर्शन",
    ],
  },
  {
    title: "कार्यक्रम कव्हरेज",
    description:
      "कॉर्पोरेट फंक्शन्स, पार्ट्या आणि विशेष प्रसंगांसाठी सर्वसमावेशक दस्तऐवजीकरणासह व्यावसायिक कार्यक्रम छायाचित्रण.",
    image: "/assets/portfolio-images/other-2.jpg",
    price: "₹२०,०००+",
    features: [
      "संपूर्ण कार्यक्रम दस्तऐवजीकरण",
      "व्यावसायिक लाइटिंग सेटअप",
      "त्याच दिवशी प्रिव्ह्यू हायलाइट्स",
      "सुरक्षित ऑनलाइन गॅलरी ऍक्सेस",
      "कार्यक्रम हायलाइट व्हिडिओ रील",
      "कॉर्पोरेट ब्रँडिंग इंटिग्रेशन",
    ],
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section className={styles.servicesContainer}>
      <div className={styles.heading}>
        <h1>आमच्या उत्कृष्ट सेवा</h1>
        <p className={styles.subtitle}>
          तुमच्या अनमोल क्षणांना कलात्मक उत्कृष्टतेने टिपण्यासाठी तयार केलेल्या व्यावसायिक छायाचित्रण सेवा
        </p>
      </div>

      <div className={styles.servicesGrid}>
        {services.map((service, index) => (
          <div key={index} className={styles.serviceCard}>
            <div className={styles.serviceImage}>
              <Image
                src={service.image}
                alt={service.title}
                width={600}
                height={300}
                priority={index < 2}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className={styles.serviceContent}>
              <div className={styles.priceTag}>{service.price}</div>
              <h3>{service.title}</h3>
              <p className={styles.description}>{service.description}</p>
              <ul className={styles.featuresList}>
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex}>{feature}</li>
                ))}
              </ul>
              <Link href="/form">
                <button className={styles.bookButton}>आत्ताच बुक करा</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.ctaSection}>
        <h2>तुमचे क्षण टिपायला तयार आहात?</h2>
        <p>तुमच्या छायाचित्रण गरजांबद्दल बोलूया आणि एकत्र काहीतरी सुंदर निर्माण करूया</p>
        <Link href="/form">
          <button className={styles.ctaButton}>मोफत सल्ला घ्या</button>
        </Link>
      </div>
    </section>
  );
};

export default ServicesSection;