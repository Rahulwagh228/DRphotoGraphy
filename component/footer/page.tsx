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
    { label: 'About Us', href: '/aboutUs' },
  ]

  const address = {
    street: "Aghar Khurd, Tal. Rahuri",
    city: "Ahmednagar",
    state: "Maharashtra",
    zipCode: "413705",
    phone: "+91 8766590188",
    email: "drphotography2612@gmail.com",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29894.505306435185!2d74.39981533724554!3d20.51388402913902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bde853df445c507%3A0xdd2e7d9b47477772!2sD%20R%20PHOTOGRAPHY%20Aghar%20khurd!5e0!3m2!1sen!2sin!4v1744552014200!5m2!1sen!2sin"
  }

  const socialLinks = {
    phone: '+918766590188',
    whatsapp: '+918766590188',
    instagram: 'https://www.instagram.com/d_r_photography_2612?igsh=ZjZyaHdhbGs0cmxu'
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo & Brand Section */}
        <div className={styles.footerLogo}>
          <Image src={Logo} alt="DR Photography Logo" width={100} height={100} />
          <div className={styles.brandText}>
            <h3>DR Photography</h3>
            <p>Capturing life's most beautiful moments with artistic vision and professional excellence.</p>
          </div>
          <div className={styles.socialIcons}>
            <a href={`tel:${socialLinks.phone}`} aria-label="Call us">
              <Image src={CallIcon} alt="Call" width={20} height={20} />
            </a>
            <a href={`https://wa.me/${socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
              <Image src={WhatsAppIcon} alt="WhatsApp" width={20} height={20} />
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
              <Image src={InstagramIcon} alt="Instagram" width={20} height={20} />
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
          <h3>Get In Touch</h3>
          <address>
            <p>{address.street}</p>
            <p>{address.city}, {address.state}</p>
            <p>{address.zipCode}</p>
            <p>Phone: <a href={`tel:${address.phone}`}>{address.phone}</a></p>
            <p>Email: <a href={`mailto:${address.email}`}>{address.email}</a></p>
          </address>
        </div>

        {/* Map Section */}
        <div className={styles.footerMap}>
          <iframe
            src={address.mapUrl}
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="DR Photography Location"
          />
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} DR Photography. All rights reserved.</p>
        </div>
        <div className={styles.credits}>
          <p>Crafted with ❤️ for capturing beautiful moments</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;