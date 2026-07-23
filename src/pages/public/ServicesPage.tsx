import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaAward,
  FaGraduationCap,
  FaPassport,
  FaPenFancy,
  FaPlane,
  FaUniversity,
} from 'react-icons/fa'
import { PageHero } from '@/components/common/PageHero'
import { Button } from '@/components/ui/button'
import { BRAND, ROUTES, SERVICES } from '@/constants'

const ICON_MAP = {
  FaGraduationCap,
  FaPassport,
  FaPlane,
  FaUniversity,
  FaAward,
  FaPenFancy,
} as const

export default function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>Our Services | {BRAND.name}</title>
        <meta
          name="description"
          content="Study abroad, student visa, admissions, scholarships, and SOP writing — complete support from Primexium Consultants."
        />
      </Helmet>

      <PageHero
        eyebrow="Services"
        title="Comprehensive Support for Your Journey"
        description="Everything you need to study abroad — from university selection and applications to visas and scholarships."
      >
        <Link to={ROUTES.bookConsultation}>
          <Button size="lg">Talk to a Counsellor</Button>
        </Link>
      </PageHero>

      <section className="container-wide section-padding">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = ICON_MAP[service.icon as keyof typeof ICON_MAP]
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={22} />
                </div>
                <h2 className="text-lg font-semibold text-primary">{service.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>
    </>
  )
}
