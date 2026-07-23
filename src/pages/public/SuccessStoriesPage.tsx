import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'
import { PageHero } from '@/components/common/PageHero'
import { Button } from '@/components/ui/button'
import { TESTIMONIALS } from '@/constants/content'
import { BRAND, ROUTES } from '@/constants'

export default function SuccessStoriesPage() {
  return (
    <>
      <Helmet>
        <title>Success Stories | {BRAND.name}</title>
        <meta
          name="description"
          content="Read success stories from students who achieved their study abroad dreams with Primexium Advisors."
        />
      </Helmet>

      <PageHero
        eyebrow="Success Stories"
        title="What Our Students Say"
        description="Real outcomes from students who trusted us with their international education journey."
      />

      <section className="container-wide section-padding">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <motion.blockquote
              key={item.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-1 text-secondary">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <FaStar key={i} size={14} />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                &ldquo;{item.content}&rdquo;
              </p>
              <footer className="mt-6 border-t border-border pt-4">
                <p className="font-semibold text-primary">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {item.university} · {item.country}
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to={ROUTES.eligibilityChecker}>
            <Button size="lg">Start Your Success Story</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
