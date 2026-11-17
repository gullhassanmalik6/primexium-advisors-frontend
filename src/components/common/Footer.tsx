import { Link } from 'react-router-dom'
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaTiktok,
  FaWhatsapp,
  FaYoutube,
} from 'react-icons/fa'
import { Logo } from '@/components/common/Logo'
import { BRAND, NAV_LINKS, OFFICE_HOURS, OFFICES, ROUTES, SOCIAL_LINKS } from '@/constants'

const FOOTER_LINKS = {
  services: [
    { label: 'Study Abroad', href: ROUTES.services },
    { label: 'Student Visa', href: ROUTES.services },
    { label: 'SOP Writing', href: ROUTES.services },
    { label: 'Scholarships', href: ROUTES.services },
  ],
  company: [
    { label: 'About Us', href: ROUTES.about },
    { label: 'Success Stories', href: ROUTES.successStories },
    { label: 'Blog', href: ROUTES.blog },
    { label: 'FAQs', href: ROUTES.faqs },
  ],
  resources: [
    { label: 'Countries', href: ROUTES.countries },
    { label: 'Universities', href: ROUTES.universities },
    { label: 'Packages', href: ROUTES.packages },
    { label: 'Eligibility Checker', href: ROUTES.eligibilityChecker },
  ],
}

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container-wide section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="inline-block rounded-2xl bg-white px-4 py-3">
              <Logo variant="footer" linkToHome />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              {BRAND.legalName}. {BRAND.tagline}.
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">{BRAND.address}</p>
            <p className="mt-2 text-xs text-white/55">
              {OFFICE_HOURS.label} · {OFFICE_HOURS.timezone}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {(
                [
                  { Icon: FaFacebookF, href: SOCIAL_LINKS.facebook, label: 'Facebook' },
                  { Icon: FaInstagram, href: SOCIAL_LINKS.instagram, label: 'Instagram' },
                  { Icon: FaLinkedinIn, href: SOCIAL_LINKS.linkedin, label: 'LinkedIn' },
                  { Icon: FaYoutube, href: SOCIAL_LINKS.youtube, label: 'YouTube' },
                  { Icon: FaTiktok, href: SOCIAL_LINKS.tiktok, label: 'TikTok' },
                  { Icon: FaWhatsapp, href: SOCIAL_LINKS.whatsapp, label: 'WhatsApp' },
                ] as const
              )
                .filter((item) => Boolean(item.href))
                .map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 transition-colors hover:bg-secondary hover:text-primary"
                    aria-label={label}
                  >
                    <Icon size={16} />
                  </a>
                ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary">
              Services
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary">
              Company
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-secondary">
              Our Offices
            </h3>
            <div className="space-y-5">
              {OFFICES.map((office) => (
                <div key={office.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">
                    <span className="mr-2" role="img" aria-label={office.city}>
                      {office.flag}
                    </span>
                    {office.label}
                  </p>
                  <p className="mt-1 text-sm text-white/70">{office.city}</p>
                  <a
                    href={`tel:${office.phone.replace(/\s/g, '')}`}
                    className="mt-2 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-secondary"
                  >
                    <FaPhone className="text-secondary" size={12} />
                    {office.phone}
                  </a>
                  <a
                    href={`mailto:${office.email}`}
                    className="mt-1 flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-secondary"
                  >
                    <FaEnvelope className="text-secondary" size={12} />
                    {office.email}
                  </a>
                </div>
              ))}
            </div>
            <Link
              to={ROUTES.contact}
              className="mt-4 inline-block text-sm font-medium text-secondary hover:underline"
            >
              View full contact details →
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
