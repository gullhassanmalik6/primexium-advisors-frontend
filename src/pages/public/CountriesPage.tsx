import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHero } from '@/components/common/PageHero'
import { Button } from '@/components/ui/button'
import { STUDY_COUNTRIES } from '@/constants/content'
import { BRAND, ROUTES } from '@/constants'

export default function CountriesPage() {
  return (
    <>
      <Helmet>
        <title>Study Destinations | {BRAND.name}</title>
        <meta
          name="description"
          content="Explore study destinations including France, Italy, Germany, Finland, UK, and Canada with Primexium Advisors."
        />
      </Helmet>

      <PageHero
        eyebrow="Destinations"
        title="Study in Top Countries Worldwide"
        description="Compare destinations, university options, and pathways that match your academic profile and budget."
      />

      <section className="container-wide section-padding">
        <div className="grid gap-6 lg:grid-cols-2">
          {STUDY_COUNTRIES.map((country, index) => (
            <motion.article
              key={country.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl" aria-hidden>
                  {country.flag}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-primary">{country.name}</h2>
                  <p className="mt-1 text-sm text-secondary">{country.universities} Universities</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {country.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {country.highlights.map((item) => (
                      <li key={item} className="text-sm text-foreground">
                        <span className="mr-2 text-secondary">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to={ROUTES.eligibilityChecker}>
            <Button size="lg">Find Your Best Match</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
