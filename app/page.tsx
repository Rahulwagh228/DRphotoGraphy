import React from 'react'
import Navbar from '@/component/Navbar/Navbar'
import HeroSection from '@/component/hero-section/HeroSection'
import HeroSection2 from '@/component/hero-section2/heroSection2'
import Footer from '@/component/footer/page'

const page = () => {
  return (
    <>
      <Navbar />
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
