'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CallIcon from '@/public/assets/icons/Callicon.svg'
import InstagramIcon from '@/public/assets/icons/instagram.svg'
import WhatsAppIcon from '@/public/assets/icons/whatsapp.svg'
import styles from './Footer.module.scss'

// Facebook SVG icon component
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const Footer = () => {
  const menuItems = [
    { label: 'मुख्यपृष्ठ', href: '/' },
    { label: 'सेवा', href: '/services' },
    { label: 'गॅलरी', href: '/portfolio' },
    { label: 'आमच्याबद्दल', href: '/aboutUs' },
    { label: 'बुकिंग फॉर्म', href: '/form' },
  ]

  const address = {
    street: "आघार खुर्द, तालुका राहुरी",
    city: "अहमदनगर",
    state: "महाराष्ट्र",
    zipCode: "४१३७०५",
    phone: "+91 8766590188",
    email: "drphotography2612@gmail.com",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29894.505306435185!2d74.39981533724554!3d20.51388402913902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bde853df445c507%3A0xdd2e7d9b47477772!2sD%20R%20PHOTOGRAPHY%20Aghar%20khurd!5e0!3m2!1sen!2sin!4v1744552014200!5m2!1sen!2sin"
  }

  const socialLinks = {
    phone: '+918766590188',
    whatsapp: '+918766590188',
    instagram: 'https://www.instagram.com/d_r_photography_2612?igsh=ZjZyaHdhbGs0cmxu',
    facebook: 'https://www.facebook.com/profile.php?id=100064281498498'
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo & Brand Section */}
        <div className={styles.footerLogo}>
          <Image src="/assets/aaditi-logo.png" alt="आदिती फोटोग्राफी" width={100} height={100} />
          <div className={styles.brandText}>
            <h3>आदिती फोटोग्राफी</h3>
            <p>आयुष्यातील सुंदर क्षण कलात्मक दृष्टी आणि व्यावसायिक उत्कृष्टतेने टिपण्यासाठी.</p>
          </div>
          <div className={styles.socialIcons}>
            <a href={`tel:${socialLinks.phone}`} aria-label="आम्हाला कॉल करा">
              <Image src={CallIcon} alt="कॉल करा" width={20} height={20} />
            </a>
            <a href={`https://wa.me/${socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="व्हॉट्सॲपवर चॅट करा">
              <Image src={WhatsAppIcon} alt="व्हॉट्सॲप" width={20} height={20} />
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="इन्स्टाग्रामवर फॉलो करा">
              <Image src={InstagramIcon} alt="इन्स्टाग्राम" width={20} height={20} />
            </a>
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="फेसबुकवर फॉलो करा" className={styles.fbIcon}>
              <FacebookIcon />
            </a>
          </div>
        </div>

        {/* Navigation Links */}
        <div className={styles.footerLinks}>
          <h3>जलद लिंक्स</h3>
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
          <h3>संपर्क करा</h3>
          <address>
            <p>{address.street}</p>
            <p>{address.city}, {address.state}</p>
            <p>{address.zipCode}</p>
            <p>फोन: <a href={`tel:${address.phone}`}>{address.phone}</a></p>
            <p>ईमेल: <a href={`mailto:${address.email}`}>{address.email}</a></p>
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
            title="आदिती फोटोग्राफी स्थान"
          />
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.copyright}>
          <p>&copy; {new Date().getFullYear()} आदिती फोटोग्राफी. सर्व हक्क राखीव.</p>
        </div>
        <div className={styles.credits}>
          <p>सुंदर क्षण टिपण्यासाठी ❤️ ने तयार केलेले</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer;