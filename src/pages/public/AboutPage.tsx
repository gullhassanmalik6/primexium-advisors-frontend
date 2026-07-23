import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHero } from '@/components/common/PageHero'
import { Button } from '@/components/ui/button'
import { ABOUT_STATS, ABOUT_VALUES } from '@/constants/content'
import { BRAND, ROUTES } from '@/constants'

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us | {BRAND.name}</title>
        <meta
          name="description"
          content="Learn about Primexium Consultants — our mission, values, and track record helping students study abroad."
        />
      </Helmet>

      <PageHero
        eyebrow="About Us"
        title={`Who We Are at ${BRAND.name}`}
        description="We connect ambitious students with the right universities, countries, and career pathways through honest counselling and end-to-end support."
      />

      <section className="container-wide section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold text-primary sm:text-3xl">Our Mission</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {BRAND.tagline}. We believe international education should feel clear, achievable, and
            personal — not overwhelming. From the first eligibility check to visa approval, our
            counsellors guide students with transparency and care.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT_STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-border bg-card p-6 text-center"
            >
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-muted section-padding">
        <div className="container-wide">
          <h2 className="text-center text-2xl font-semibold text-primary sm:text-3xl">Our Values</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {ABOUT_VALUES.map((value) => (
              <div key={value.title} className="rounded-2xl bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-primary">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to={ROUTES.bookConsultation}>
              <Button size="lg">Book Free Consultation</Button>
            </Link>
            <Link to={ROUTES.eligibilityChecker}>
              <Button variant="outline" size="lg">
                Check Eligibility
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
