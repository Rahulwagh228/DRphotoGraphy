'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@/public/assets/Logo-updated.png'
import CallIcon from '@/public/assets/icons/Callicon.svg'
import InstagramIcon from '@/public/assets/icons/instagram.svg'
import WhatsAppIcon from '@/public/assets/icons/whatsapp.svg'
import styles from './Footer.module.scss'

const Footer = () => {
  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Testimonials', href: '/testimonials' },
  ]

  const address = {
    street: "123 Photography Street",
    city: "City Name",
    state: "State",
    zipCode: "12345",
    phone: "+1 (234) 567-8900",
    email: "contact@drphotography.com",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29894.505306435185!2d74.39981533724554!3d20.51388402913902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bde853df445c507%3A0xdd2e7d9b47477772!2sD%20R%20PHOTOGRAPHY%20Aghar%20khurd!5e0!3m2!1sen!2sin!4v1744552014200!5m2!1sen!2sin" // You'll need to replace this with your actual Google Maps embed URL
  }

  const socialLinks = {
    phone: '+918766590188',
    whatsapp: '+918766590188',
    instagram: 'https://www.instagram.com/d_r_photography_2612?igsh=ZjZyaHdhbGs0cmxu'
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo Section */}
        <div className={styles.footerLogo}>
          <Image src={Logo} alt="Dr Photography Logo" width={120} height={120} />
          <div className={styles.socialIcons}>
            <a href={`tel:${socialLinks.phone}`} aria-label="Call us">
              <Image src={CallIcon} alt="Call" width={24} height={24} />
            </a>
            <a href={`https://wa.me/${socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
              <Image src={WhatsAppIcon} alt="WhatsApp" width={24} height={24} />
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
              <Image src={InstagramIcon} alt="Instagram" width={24} height={24} />
            </a>
          </div>
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

export default Footer;