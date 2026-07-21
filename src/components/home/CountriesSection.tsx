import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SectionHeading } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'

const COUNTRIES = [
  { name: 'United Kingdom', flag: '🇬🇧', universities: '120+' },
  { name: 'Canada', flag: '🇨🇦', universities: '90+' },
  { name: 'Australia', flag: '🇦🇺', universities: '80+' },
  { name: 'Germany', flag: '🇩🇪', universities: '70+' },
  { name: 'United States', flag: '🇺🇸', universities: '200+' },
  { name: 'Ireland', flag: '🇮🇪', universities: '40+' },
]

export function CountriesSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Destinations"
          title="Study in Top Countries Worldwide"
          description="Explore world-class education opportunities across the globe."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTRIES.map((country, index) => (
            <motion.div
              key={country.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={ROUTES.countries}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-secondary/50 hover:shadow-lg"
              >
                <span className="text-4xl">{country.flag}</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary">{country.name}</h3>
                  <p className="text-sm text-muted-foreground">{country.universities} Universities</p>
                </div>
                <span className="text-secondary opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to={ROUTES.countries}>
            <Button variant="outline">View All Countries</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
