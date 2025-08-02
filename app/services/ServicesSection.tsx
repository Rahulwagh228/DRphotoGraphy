import Image from "next/image";
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
    title: "Wedding Photography",
    description:
      "Capture every magical moment of your special day with our comprehensive wedding photography package that tells your unique love story.",
    image: "/assets/portfolio-images/image-1.jpeg",
    price: "₹25,000+",
    features: [
      "Full-day coverage (8-12 hours)",
      "500+ high-resolution edited images",
      "Online gallery with download access",
      "Drone shots and aerial photography",
      "Complimentary pre-wedding shoot",
      "Professional lighting equipment",
    ],
  },
  {
    title: "Birthday Celebrations",
    description:
      "Make your birthday memories last forever with our professional birthday photography services that capture pure joy and celebration.",
    image: "/assets/portfolio-images/birthday-1.jpg",
    price: "₹10,000+",
    features: [
      "4-hour event coverage",
      "200+ edited photos delivered",
      "Same-day preview gallery",
      "Fun props and backdrops included",
      "Candid and posed shots",
      "Digital delivery within 48 hours",
    ],
  },
  {
    title: "Engagement Sessions",
    description:
      "Beautiful and romantic engagement photo sessions to celebrate your love story with artistic flair and professional expertise.",
    image: "/assets/portfolio-images/other-1.jpg",
    price: "₹15,000+",
    features: [
      "2-hour romantic photo session",
      "Multiple scenic locations",
      "2-3 outfit changes allowed",
      "100+ edited images in gallery",
      "Complimentary print package",
      "Professional posing guidance",
    ],
  },
  {
    title: "Event Coverage",
    description:
      "Professional event photography for corporate functions, parties, and special occasions with comprehensive documentation.",
    image: "/assets/portfolio-images/other-2.jpg",
    price: "₹20,000+",
    features: [
      "Full event documentation",
      "Professional lighting setup",
      "Same-day preview highlights",
      "Secure online gallery access",
      "Event highlight video reel",
      "Corporate branding integration",
    ],
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section className={styles.servicesContainer}>
      <div className={styles.heading}>
        <h1>Our Premium Services</h1>
        <p className={styles.subtitle}>
          Professional photography services tailored to capture your most precious moments with artistic excellence
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
              <button className={styles.bookButton}>Book Now</button>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.ctaSection}>
        <h2>Ready to Capture Your Moments?</h2>
        <p>Let's discuss your photography needs and create something beautiful together</p>
        <button className={styles.ctaButton}>Get Free Consultation</button>
      </div>
    </section>
  );
};

export default ServicesSection;