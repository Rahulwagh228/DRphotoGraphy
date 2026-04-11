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
    title: "वेडिंग शूट — सिनेमॅटिक",
    description:
      "तुमच्या लग्नाची एक सिनेमॅटिक कलाकृती. हॉलिवूड दर्जाच्या तंत्रज्ञानासह, तुमच्या प्रेमकथेला मोठ्या पडद्यावरील अनुभव द्या.",
    image: "/assets/portfolio-images/image-2.jpeg",
    price: "₹३५,०००+",
    features: [
      "सिनेमॅटिक फिल्म-लुक एडिटिंग",
      "स्लो मोशन आणि टाइमलॅप्स शॉट्स",
      "हायलाइट रील (३-५ मिनिटे)",
      "मल्टी-कॅमेरा सेटअप",
      "व्यावसायिक साउंड डिझाइन",
      "4K अल्ट्रा HD आउटपुट",
    ],
  },
  {
    title: "ड्रोन शूट — एरियल",
    description:
      "आकाशातून तुमच्या कार्यक्रमाचे चित्तथरारक एरियल दृश्य. अत्याधुनिक ड्रोन तंत्रज्ञानासह विहंगम छायाचित्रण.",
    image: "/assets/portfolio-images/other-2.jpg",
    price: "₹१५,०००+",
    features: [
      "4K UHD ड्रोन व्हिडिओग्राफी",
      "एरियल पॅनोरमिक फोटोग्राफी",
      "टॉप-डाउन बर्ड्स आय व्ह्यू शॉट्स",
      "व्हेन्यू आणि लोकेशन सर्वेक्षण",
      "लाइव्ह ड्रोन स्ट्रीमिंग सुविधा",
      "FAA मानकांनुसार सुरक्षित उड्डाणे",
    ],
  },
  {
    title: "वाढदिवस उत्सव",
    description:
      "तुमच्या वाढदिवसाच्या आठवणी कायमस्वरूपी जपा. शुद्ध आनंद आणि उत्सव टिपणाऱ्या आमच्या व्यावसायिक छायाचित्रण सेवेसह.",
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
    image: "/assets/portfolio-images/other-3.jpg",
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
        <h1>आमच्या छायाचित्रण सेवा</h1>
        <p className={styles.subtitle}>
          प्रत्येक क्षण टिपण्यासाठी — कॅमेऱ्यापासून ड्रोनपर्यंत, 
          तुमच्या विशेष प्रसंगांना कलात्मक स्पर्श देण्यासाठी
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
        <p>तुमच्या छायाचित्रण गरजांबद्दल बोलूया — मोफत सल्ला घ्या</p>
        <Link href="/form">
          <button className={styles.ctaButton}>मोफत सल्ला घ्या</button>
        </Link>
      </div>
    </section>
  );
};

export default ServicesSection;