import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { FaChevronDown } from 'react-icons/fa'
import { PageHero } from '@/components/common/PageHero'
import { Button } from '@/components/ui/button'
import { FAQS } from '@/constants/content'
import { BRAND, ROUTES } from '@/constants'
import { cn } from '@/utils/cn'

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      <Helmet>
        <title>FAQs | {BRAND.name}</title>
        <meta
          name="description"
          content="Frequently asked questions about studying abroad, visas, documents, and Primexium services."
        />
      </Helmet>

      <PageHero
        eyebrow="FAQs"
        title="Frequently Asked Questions"
        description="Quick answers to the questions students ask us most often."
      />

      <section className="container-wide section-padding">
        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-primary">{faq.question}</span>
                  <FaChevronDown
                    className={cn(
                      'shrink-0 text-secondary transition-transform',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">Still have questions?</p>
          <Link to={ROUTES.contact} className="mt-4 inline-block">
            <Button>Contact Us</Button>
          </Link>
        </div>
      </section>
    </>
  )
}
