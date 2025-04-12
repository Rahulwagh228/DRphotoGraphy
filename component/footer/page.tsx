'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/public/assets/Logo-updated.png'
import styles from './Footer.module.scss'

const Footer = () => {
  const menuItems = [
    { label: 'Services', href: '/' },
    { label: 'Portfolio', href: '/' },
    { label: 'Testimonials', href: '/' },
  ]

  const address = {
    street: "123 Photography Street",
    city: "City Name",
    state: "State",
    zipCode: "12345",
    phone: "+1 (234) 567-8900",
    email: "contact@drphotography.com",
    mapUrl: "https://www.google.com/maps/embed?pb=..." // You'll need to replace this with your actual Google Maps embed URL
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo Section */}
        <div className={styles.footerLogo}>
          <Image src={Logo} alt="Dr Photography Logo" width={120} height={120} />
        </div>

        {/* Navigation Links */}
        <div className={styles.footerLinks}>
          <h3>Quick Links</h3>
          <nav>
            {menuItems.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact Information */}
        <div className={styles.footerContact}>
          <h3>Contact Us</h3>
          <address>
            <p>{address.street}</p>
            <p>{address.city}, {address.state} {address.zipCode}</p>
            <p>Phone: <a href={`tel:${address.phone}`}>{address.phone}</a></p>
            <p>Email: <a href={`mailto:${address.email}`}>{address.email}</a></p>
          </address>
        </div>

        {/* Map Section */}
        <div className={styles.footerMap}>
          <iframe
            src={address.mapUrl}
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} Dr Photography. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer