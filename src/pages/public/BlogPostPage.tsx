import { Helmet } from 'react-helmet-async'
import { Link, Navigate, useParams } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { BLOG_POSTS, getBlogPostBySlug } from '@/constants/blog'
import { BRAND, ROUTES } from '@/constants'

export default function BlogPostPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return <Navigate to={ROUTES.blog} replace />
  }

  const related = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3)

  return (
    <>
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.keywords.join(', ')} />
        <meta property="og:title" content={post.metaTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://primexiumadvisors.com${ROUTES.blog}/${post.slug}`} />
      </Helmet>

      <article>
        <header className="border-b border-border bg-muted/60">
          <div className="container-wide section-padding !pb-12 !pt-8">
            <Link
              to={ROUTES.blog}
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-secondary"
            >
              <FaArrowLeft size={12} />
              Back to blog
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              {post.category}
            </p>
            <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {post.excerpt}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <time dateTime={post.date}>{post.date}</time>
              <span aria-hidden>•</span>
              <span>{post.readTime}</span>
              <span aria-hidden>•</span>
              <span>{BRAND.name}</span>
            </div>
          </div>
        </header>

        <div className="container-wide section-padding">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="space-y-10">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-semibold text-primary">{section.heading}</h2>
                  <div className="mt-4 space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 48)}
                        className="text-base leading-relaxed text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}

              <div className="rounded-2xl border border-secondary/30 bg-secondary/10 p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-primary">
                  Need help with admissions or student visas?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Primexium Advisors supports Pakistani and international students from our Head
                  Office in Karachi and Regional Office in Paris — university shortlisting, SOP
                  writing, scholarships, and visa guidance.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to={ROUTES.bookConsultation}>
                    <Button>Book Free Consultation</Button>
                  </Link>
                  <Link to={ROUTES.eligibilityChecker}>
                    <Button variant="outline">Check Eligibility</Button>
                  </Link>
                </div>
              </div>
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary">
                  Key topics
                </h2>
                <ul className="mt-3 space-y-2">
                  {post.keywords.slice(0, 5).map((keyword) => (
                    <li key={keyword} className="text-sm text-muted-foreground">
                      {keyword}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary">
                  Related guides
                </h2>
                <ul className="mt-3 space-y-4">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        to={`${ROUTES.blog}/${item.slug}`}
                        className="text-sm font-medium text-primary transition-colors hover:text-secondary"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  )
}
