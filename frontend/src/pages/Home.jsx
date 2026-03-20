import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"
import Hero from "../components/sections/Hero"
import Features from "../components/sections/Features"
import HowItWorks from "../components/sections/HowItWorks"
import Testimonials from "../components/sections/Testimonials"
import Pricing from "../components/sections/Pricing"
import CTA from "../components/sections/CTA"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-24">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
