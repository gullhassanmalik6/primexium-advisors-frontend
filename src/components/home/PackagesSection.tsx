import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCheck, FaStar } from 'react-icons/fa'
import { SectionHeading } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'

const PACKAGES = [
  {
    name: 'Basic',
    price: '49,999',
    currency: 'PKR',
    features: ['University Shortlisting', 'Application Guidance', 'Document Checklist', 'Email Support'],
    popular: false,
  },
  {
    name: 'Premium',
    price: '99,999',
    currency: 'PKR',
    features: [
      'Everything in Basic',
      'SOP Review',
      'Visa Application Support',
      'Interview Preparation',
      'Priority Support',
    ],
    popular: true,
  },
  {
    name: 'Elite',
    price: '149,999',
    currency: 'PKR',
    features: [
      'Everything in Premium',
      'Dedicated Counsellor',
      'Scholarship Applications',
      'Accommodation Guidance',
      'Airport Pickup Coordination',
    ],
    popular: false,
  },
]

const WHY_CHOOSE_US = [
  '15+ Years of Experience',
  '98% Visa Success Rate',
  'Dedicated Student Counsellors',
  'Transparent Pricing',
  'End-to-End Support',
  'Post-Arrival Assistance',
]

export function PackagesSection() {
  return (
    <section className="section-padding bg-muted">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Packages"
          title="Choose the Right Plan for You"
          description="Flexible packages designed to meet every student's needs and budget."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative flex flex-col rounded-2xl bg-card p-8 shadow-sm ${
                pkg.popular ? 'ring-2 ring-secondary shadow-xl' : ''
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary px-4 py-1 text-xs font-semibold text-primary">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-semibold text-primary">{pkg.name}</h3>
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
              <Link to={ROUTES.packages} className="mt-8">
                <Button
                  variant={pkg.popular ? 'default' : 'outline'}
                  className="w-full"
                >
                  Get Started
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function WhyChooseUsSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Why Choose Us"
              title="Trusted by Thousands of Students"
              description="We combine expertise, transparency, and personalized care to make your study abroad dream a reality."
              align="left"
            />
            <ul className="grid gap-4 sm:grid-cols-2">
              {WHY_CHOOSE_US.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/20 text-secondary">
                    <FaCheck size={14} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-3xl p-8">
            <div className="mb-6 flex items-center gap-1 text-secondary">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} size={18} />
              ))}
            </div>
            <blockquote className="text-lg leading-relaxed text-foreground">
              &ldquo;Primexium Advisors made my dream of studying in the UK come true. Their team
              guided me through every step — from university selection to visa approval.&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                AK
              </div>
              <div>
                <p className="font-semibold text-primary">Ahmed Khan</p>
                <p className="text-sm text-muted-foreground">University of Manchester, UK</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
