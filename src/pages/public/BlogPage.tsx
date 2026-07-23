import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHero } from '@/components/common/PageHero'
import { Button } from '@/components/ui/button'
import { BLOG_POSTS } from '@/constants/content'
import { BRAND, ROUTES } from '@/constants'

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title>Blog | {BRAND.name}</title>
        <meta
          name="description"
          content="Study abroad tips, visa guides, scholarships, and destination insights from Primexium Advisors."
        />
      </Helmet>

      <PageHero
        eyebrow="Insights"
        title="Study Abroad Blog"
        description="Practical guides on destinations, visas, scholarships, and application strategy."
      />

      <section className="container-wide section-padding">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-secondary">
                {post.category}
              </p>
              <h2 className="mt-3 text-lg font-semibold text-primary">{post.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <time className="text-xs text-muted-foreground">{post.date}</time>
                <span className="text-sm font-medium text-secondary">Coming soon</span>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-primary px-6 py-10 text-center text-white">
          <h3 className="text-xl font-semibold">Want personalised advice instead?</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-white/70">
            Book a free consultation and get a plan tailored to your profile.
          </p>
          <Link to={ROUTES.bookConsultation} className="mt-6 inline-block">
            <Button variant="secondary">Book Consultation</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
