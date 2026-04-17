"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";
import styles from "./css/Navbar.module.scss";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: "मुख्यपृष्ठ", href: "/" },
    { label: "सेवा", href: "/services" },
    { label: "माय वर्क", href: "/mywork" },
    { label: "गॅलरी", href: "/portfolio" },
    { label: "आमच्याबद्दल", href: "/aboutUs" },
  ];

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navbarContainer}>
        <Link href="/" className={styles.logoContainer}>
          <Image
            src="/assets/aaditi-logo.png"
            alt="आदिती फोटोग्राफी"
            width={50}
            height={50}
            className={styles.logoImage}
            priority
          />
          <span className={styles.brandName}>आदिती</span>
        </Link>

        {/* Desktop Menu */}
        <div className={styles.menuDesktop}>
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.menuItem} ${
                isActive(item.href) ? styles.active : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/form" className={styles.ctaButton}>
            बुक करा
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.menuButton}
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "मेनू बंद करा" : "मेनू उघडा"}
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu — Full Screen Overlay */}
      {isOpen && (
        <div className={styles.menuMobile}>
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.menuItem} ${
                isActive(item.href) ? styles.active : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/form"
            className={styles.ctaMobile}
            onClick={() => setIsOpen(false)}
          >
            आत्ताच बुक करा
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;