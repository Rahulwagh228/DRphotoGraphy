import React from 'react'
import Navbar from '@/component/Navbar/Navbar'
import HeroSection from '@/component/hero-section/HeroSection'
import Footer from '@/component/footer/page'

const page = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        {/* Content will go here */}
        {/* <Footer /> */}
      </main>
    </>
  )
}

export default page
