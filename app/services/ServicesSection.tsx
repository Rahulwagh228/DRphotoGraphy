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
      "Capture every magical moment of your special day with our comprehensive wedding photography package.",
    image: "/assets/portfolio-images/image-1.jpeg",
    price: "Starting from ₹25,000",
    features: [
      "Full-day coverage",
      "High-resolution images",
      "Digital album",
      "Drone shots",
      "Pre-wedding shoot",
    ],
  },
  {
    title: "Birthday Celebrations",
    description:
      "Make your birthday memories last forever with our professional birthday photography services.",
    image: "/assets/portfolio-images/birthday-1.jpg",
    price: "Starting from ₹10,000",
    features: [
      "4-hour coverage",
      "Edited photos",
      "Digital delivery",
      "Props included",
      "Custom backdrops",
    ],
  },
  {
    title: "Engagement Sessions",
    description:
      "Beautiful and romantic engagement photo sessions to celebrate your love story.",
    image: "/assets/portfolio-images/other-1.jpg",
    price: "Starting from ₹15,000",
    features: [
      "2-hour session",
      "Multiple locations",
      "Outfit changes",
      "Digital gallery",
      "Print package",
    ],
  },
  {
    title: "Event Coverage",
    description:
      "Professional event photography for parties, corporate events, and special occasions.",
    image: "/assets/portfolio-images/other-2.jpg",
    price: "Starting from ₹20,000",
    features: [
      "Full event coverage",
      "Professional lighting",
      "Same-day previews",
      "Online gallery",
      "Event highlight reel",
    ],
  },
];

const ServicesSection: React.FC = () => {
  return (
    <section className={styles.servicesContainer}>
      <div className={styles.heading}>
        <h1>Our Premium Services</h1>
      </div>

      <div className={styles.servicesGrid}>
        {services.map((service, index) => (
          <div key={index} className={styles.serviceCard}>
            <div className={styles.serviceImage}>
              <Image
                src={service.image}
                alt={service.title}
                width={400}
                height={300}
                priority={index < 2}
              />
            </div>
            <div className={styles.serviceContent}>
              <h3>{service.title}</h3>
              <p className={styles.description}>{service.description}</p>
              <p className={styles.price}>{service.price}</p>
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
    </section>
  );
};

export default ServicesSection;
