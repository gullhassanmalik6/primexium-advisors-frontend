import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCheck } from 'react-icons/fa'
import { PageHero } from '@/components/common/PageHero'
import { Button } from '@/components/ui/button'
import { PACKAGES } from '@/constants/content'
import { BRAND, ROUTES } from '@/constants'

export default function PackagesPage() {
  return (
    <>
      <Helmet>
        <title>Packages & Pricing | {BRAND.name}</title>
        <meta
          name="description"
          content="Flexible study abroad packages from Primexium Consultants — Basic, Premium, and Elite plans."
        />
      </Helmet>

      <PageHero
        eyebrow="Packages"
        title="Choose the Right Plan for You"
        description="Transparent pricing with flexible packages designed for every student's needs and budget."
      />

      <section className="container-wide section-padding">
        <div className="grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`relative flex flex-col rounded-2xl bg-card p-8 shadow-sm ${
                pkg.popular ? 'ring-2 ring-secondary shadow-xl' : 'border border-border'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-4 py-1 text-xs font-semibold text-primary">
                  Most Popular
                </span>
              )}
              <h2 className="text-xl font-semibold text-primary">{pkg.name}</h2>
              <div className="mt-4">
                <span className="text-3xl font-bold text-primary">{pkg.price}</span>
                <span className="ml-1 text-sm text-muted-foreground">{pkg.currency}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <FaCheck className="mt-0.5 shrink-0 text-secondary" size={14} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to={ROUTES.bookConsultation} className="mt-8">
                <Button variant={pkg.popular ? 'default' : 'outline'} className="w-full">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
