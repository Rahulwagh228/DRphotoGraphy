'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX } from 'react-icons/fi'
import Logo from '@/public/assets/Logo-updated.png'
import Image from 'next/image'
import styles from './css/Navbar.module.scss'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Testimonials', href: '/' },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link href="/" className={styles.logoContainer}>
          <Image src={Logo} alt="Logo" width={80} height={80} className={styles.logoImage} />
        </Link>

        {/* Desktop Menu */}
        <div className={styles.menuDesktop}>
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.menuItem} ${isActive(item.href) ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.menuButton}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={32} /> : <FiMenu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className={styles.menuMobile}>
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.menuItem} ${isActive(item.href) ? styles.active : ''}`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar
