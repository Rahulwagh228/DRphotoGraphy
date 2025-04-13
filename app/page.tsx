import React from 'react'
import Navbar from '@/component/Navbar/Navbar'
import HeroSection from '@/component/hero-section/HeroSection'
import HeroSection2 from '@/component/hero-section2/heroSection2'

const page = () => {
  return (
    <>
      <main>
        <HeroSection />
        <HeroSection2 />
        {/* Content will go here */}
        {/* <Footer /> */}
      </main>
    </>
  )
}

export default page
