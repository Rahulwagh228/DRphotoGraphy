'use client'

import Navbar from "@/component/Navbar/Navbar";
import Footer from "@/component/footer/page";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />      <main style={{ flex: 1, marginTop: '4rem' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}