import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHero } from '@/components/common/PageHero'
import { Button } from '@/components/ui/button'
import { UNIVERSITIES } from '@/constants/content'
import { BRAND, ROUTES } from '@/constants'

export default function UniversitiesPage() {
  return (
    <>
      <Helmet>
        <title>Universities | {BRAND.name}</title>
        <meta
          name="description"
          content="Browse partner universities across Europe, the UK, and Canada with Primexium Advisors."
        />
      </Helmet>

      <PageHero
        eyebrow="Universities"
        title="Partner Universities Worldwide"
        description="A curated selection of institutions we actively support for admissions and scholarships."
      />

      <section className="container-wide section-padding">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="hidden grid-cols-12 gap-4 border-b border-border bg-muted px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid">
            <span className="col-span-5">University</span>
            <span className="col-span-3">Country</span>
            <span className="col-span-2">Focus</span>
            <span className="col-span-2 text-right">Rank</span>
          </div>
          <ul>
            {UNIVERSITIES.map((uni, index) => (
              <motion.li
                key={uni.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
                className="grid gap-2 border-b border-border px-6 py-4 last:border-b-0 sm:grid-cols-12 sm:items-center sm:gap-4"
              >
                <p className="font-medium text-primary sm:col-span-5">{uni.name}</p>
                <p className="text-sm text-muted-foreground sm:col-span-3">{uni.country}</p>
                <p className="text-sm text-muted-foreground sm:col-span-2">{uni.focus}</p>
                <p className="text-sm font-medium text-secondary sm:col-span-2 sm:text-right">
                  #{uni.ranking}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Need a shortlist tailored to your profile?
          </p>
          <Link to={ROUTES.bookConsultation} className="mt-4 inline-block">
            <Button>Book University Counselling</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
