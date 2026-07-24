import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHero } from '@/components/common/PageHero'
import { Button } from '@/components/ui/button'
import { BLOG_POSTS } from '@/constants/blog'
import { BRAND, ROUTES } from '@/constants'

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title>Study Abroad Blog | Tips on Visas, Universities & Scholarships | {BRAND.name}</title>
        <meta
          name="description"
          content="Expert study abroad blog for Pakistani students: universities in France, Germany student visa, SOP writing, scholarships in Italy, IELTS vs MOI, and intake planning from Primexium Advisors."
        />
        <meta
          name="keywords"
          content="study abroad blog, study in France from Pakistan, Germany student visa, SOP writing, scholarships Italy, IELTS vs MOI, study abroad consultants Karachi"
        />
      </Helmet>

      <PageHero
        eyebrow="Insights"
        title="Study Abroad Blog"
        description="SEO-friendly guides on study destinations, student visas, scholarships, SOP writing, and application strategy for Pakistani and international students."
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
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-secondary">
                {post.category}
              </p>
              <h2 className="mt-3 text-lg font-semibold text-primary">
                <Link
                  to={`${ROUTES.blog}/${post.slug}`}
                  className="transition-colors hover:text-secondary"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <div>
                  <time className="text-xs text-muted-foreground">{post.date}</time>
                  <p className="mt-1 text-xs text-muted-foreground">{post.readTime}</p>
                </div>
                <Link
                  to={`${ROUTES.blog}/${post.slug}`}
                  className="text-sm font-medium text-secondary transition-colors hover:text-primary"
                >
                  Read article →
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-primary px-6 py-10 text-center text-white">
          <h3 className="text-xl font-semibold">Want personalised study abroad advice?</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-white/70">
            Book a free consultation with Primexium Advisors in Karachi or Paris and get a plan
            tailored to your profile.
          </p>
          <Link to={ROUTES.bookConsultation} className="mt-6 inline-block">
            <Button variant="secondary">Book Free Consultation</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
