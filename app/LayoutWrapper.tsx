'use client'

import { useEffect } from 'react'
import Navbar from "@/component/Navbar/Navbar";
import Footer from "@/component/footer/page";
import { Toaster } from 'react-hot-toast'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth'
    
    // Initialize scroll-based animations
    const handleScroll = () => {
      const scrolled = window.scrollY
      const parallaxElements = document.querySelectorAll('.parallax')
      
      parallaxElements.forEach((element) => {
        const speed = element.getAttribute('data-speed') || '0.5'
        const yPos = -(scrolled * parseFloat(speed))
        ;(element as HTMLElement).style.transform = `translateY(${yPos}px)`
      })
    }

    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#111111',
            color: '#f2f0eb',
            border: '1px solid rgba(201,169,110,0.22)',
          },
        }}
      />
      <Navbar />  
      <main style={{ flex: 1, marginTop: '80px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}