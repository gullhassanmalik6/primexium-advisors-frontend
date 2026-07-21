import { Helmet } from 'react-helmet-async'
import { BRAND } from '@/constants'
import { ContactSection } from '@/components/home/ContactSection'
import { CountriesSection } from '@/components/home/CountriesSection'
import { HeroSection } from '@/components/home/HeroSection'
import { BlogSection, TestimonialsSection } from '@/components/home/TestimonialsSection'
import { PackagesSection, WhyChooseUsSection } from '@/components/home/PackagesSection'
import { ServicesSection } from '@/components/home/ServicesSection'

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>{BRAND.name} | Study Abroad & Visa Experts</title>
        <meta
          name="description"
          content="Primexium Consultants offers premium study abroad, student visa, university admission, and scholarship guidance services."
        />
      </Helmet>

      <HeroSection />
      <ServicesSection />
      <CountriesSection />
      <PackagesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <BlogSection />
      <ContactSection />
    </>
  )
}
