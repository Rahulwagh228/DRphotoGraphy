'use client'
import React, { useEffect } from 'react'
import HeroSection from '@/component/hero-section/HeroSection'
import HeroSection2 from '@/component/hero-section2/heroSection2'

const page = () => {
  useEffect(() => {
    // Initialize AOS or any other animation libraries here if needed
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in')
    animatedElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <main>
      <HeroSection />
      <HeroSection2 />
    </main>
  )
}

export default page