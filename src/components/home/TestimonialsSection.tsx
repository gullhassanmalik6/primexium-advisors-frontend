import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'
import { SectionHeading } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants'

const TESTIMONIALS = [
  {
    name: 'Sara Ahmed',
    university: 'University of Toronto',
    country: 'Canada',
    content: 'Outstanding service! They helped me secure a scholarship and guided me through the entire visa process seamlessly.',
    rating: 5,
  },
  {
    name: 'Hassan Ali',
    university: 'Monash University',
    country: 'Australia',
    content: 'Professional, knowledgeable, and always available. I highly recommend Primexium for anyone planning to study abroad.',
    rating: 5,
  },
  {
    name: 'Fatima Noor',
    university: 'TU Munich',
    country: 'Germany',
    content: 'Their SOP writing service was exceptional. I received my admission letter within weeks of applying.',
    rating: 5,
  },
]

const BLOG_POSTS = [
  {
    title: 'Top 10 Universities in UK for 2026',
    excerpt: 'Discover the best universities in the United Kingdom for international students.',
    date: 'Mar 15, 2026',
    slug: 'top-universities-uk-2026',
  },
  {
    title: 'Complete Guide to Student Visa for Canada',
    excerpt: 'Everything you need to know about applying for a Canadian student visa.',
    date: 'Mar 10, 2026',
    slug: 'canada-student-visa-guide',
  },
  {
    title: 'How to Write a Winning Statement of Purpose',
    excerpt: 'Expert tips to craft an SOP that gets you admitted to your dream university.',
    date: 'Mar 5, 2026',
    slug: 'winning-sop-guide',
  },
]

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-muted">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Success Stories"
          title="What Our Students Say"
          description="Real stories from students who achieved their study abroad dreams with us."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-2xl bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex gap-1 text-secondary">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <FaStar key={i} size={14} />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{item.content}&rdquo;</p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-semibold text-primary">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.university}, {item.country}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BlogSection() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <SectionHeading
          eyebrow="Blog"
          title="Latest Insights & Guides"
          description="Stay informed with expert advice on studying abroad, visas, and scholarships."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {BLOG_POSTS.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                to={`${ROUTES.blog}/${post.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-lg"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/20" />
                <div className="p-6">
                  <time className="text-xs text-muted-foreground">{post.date}</time>
                  <h3 className="mt-2 font-semibold text-primary group-hover:text-secondary">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to={ROUTES.blog}>
            <Button variant="outline">View All Articles</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
