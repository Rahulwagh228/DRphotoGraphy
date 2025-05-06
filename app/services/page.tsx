"use client";
import Image from "next/image";
import styles from "./Services.module.scss";

const services = [
  {
    title: "Wedding Shoot",
    description:
      "Capture your special day with our professional wedding photography services.",
    image: "/assets/portfolio-images/image-1.jpeg",
  },
  {
    title: "Birthday Shoot",
    description:
      "Make your birthday memories last forever with our creative photography.",
    image: "/assets/portfolio-images/image-1.jpeg",
  },
  {
    title: "Engagement Shoot",
    description: "Beautiful pre-wedding shots to celebrate your engagement.",
    image: "/assets/portfolio-images/image-1.jpeg",
  },
  {
    title: "Party Shoot",
    description:
      "Professional event photography to capture all the fun moments.",
    image: "/assets/portfolio-images/image-1.jpeg",
  },
  {
    title: "Pre Wedding Shoot",
    description: "Romantic and creative pre-wedding photography sessions.",
    image: "/assets/portfolio-images/image-1.jpeg",
  },
  {
    title: "Drone Shoot",
    description:
      "Stunning aerial photography to add a unique perspective to your memories.",
    image: "/assets/portfolio-images/image-1.jpeg",
  },
];

export default function Services() {
  return (
    <div className={styles.servicesContainer}>
      <div className={styles.heading}>
        <h1>Services we Offer</h1>
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
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
