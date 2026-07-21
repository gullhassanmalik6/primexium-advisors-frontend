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
import { SectionHeading } from '@/components/common/PageElements'
import { SERVICES, ROUTES } from '@/constants'

const ICON_MAP = {
  FaGraduationCap,
  FaPassport,
  FaPlane,
  FaUniversity,
  FaAward,
  FaPenFancy,
} as const

export function ServicesSection() {
  return (
    <section className="section-padding bg-muted">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Our Services"
          title="Comprehensive Support for Your Journey"
          description="Everything you need to study abroad — from application to arrival."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, index) => {
            const Icon = ICON_MAP[service.icon as keyof typeof ICON_MAP]
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  to={ROUTES.services}
                  className="group flex h-full flex-col rounded-2xl bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{service.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                  <span className="mt-4 text-sm font-medium text-secondary group-hover:underline">
                    Learn more →
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
