import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'
import { SectionHeading } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { TESTIMONIALS } from '@/constants/content'
import { BLOG_POSTS } from '@/constants/blog'
import { ROUTES } from '@/constants'

const HOME_TESTIMONIALS = TESTIMONIALS.slice(0, 3)
const HOME_BLOG_POSTS = BLOG_POSTS.slice(0, 3)

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
          {HOME_TESTIMONIALS.map((item, index) => (
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
          {HOME_BLOG_POSTS.map((post, index) => (
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
                  <p className="text-xs font-medium uppercase tracking-widest text-secondary">
                    {post.category}
                  </p>
                  <time className="mt-2 block text-xs text-muted-foreground">{post.date}</time>
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
