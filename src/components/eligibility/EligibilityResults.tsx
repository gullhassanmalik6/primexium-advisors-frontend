import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRedo,
  FaWhatsapp,
} from 'react-icons/fa'
import { HiMail } from 'react-icons/hi'
import { Button } from '@/components/ui/button'
import { BRAND, ROUTES } from '@/constants'
import type { EligibilityAssessment, EligibilityFormData } from '@/types/eligibility'
import { renderStars } from '@/utils/eligibilityAssessment'

interface EligibilityResultsProps {
  formData: EligibilityFormData
  assessment: EligibilityAssessment
  onStartOver: () => void
}

function DocumentStatusIcon({ status }: { status: 'available' | 'required' | 'warning' }) {
  if (status === 'available') return <FaCheckCircle className="text-emerald-500" />
  if (status === 'warning') return <FaExclamationTriangle className="text-amber-500" />
  return <FaExclamationTriangle className="text-destructive" />
}

export function EligibilityResults({ formData, assessment, onStartOver }: EligibilityResultsProps) {
  const tierColors = {
    excellent: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
    good: 'from-amber-400/20 to-amber-400/5 border-amber-400/30',
    needs_improvement: 'from-orange-400/20 to-orange-400/5 border-orange-400/30',
    limited: 'from-red-400/20 to-red-400/5 border-red-400/30',
  }

  const whatsappMessage = encodeURIComponent(
    `Hi Primexium Advisors, I completed the eligibility assessment. My name is ${formData.fullName}. I'd like to discuss my study abroad options.`,
  )
  const whatsappUrl = `https://wa.me/${BRAND.whatsapp.replace(/\D/g, '')}?text=${whatsappMessage}`
  const mailSubject = encodeURIComponent('Eligibility Assessment Follow-up')
  const mailBody = encodeURIComponent(
    `Hello,\n\nI completed the eligibility assessment on your website.\n\nName: ${formData.fullName}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nPlease contact me to discuss next steps.\n\nThank you.`,
  )
  const mailUrl = `mailto:${BRAND.email}?subject=${mailSubject}&body=${mailBody}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div
        className={`rounded-2xl border bg-gradient-to-br p-8 text-center ${tierColors[assessment.tier]}`}
      >
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Eligibility Assessment
        </p>
        <h2 className="mt-3 text-3xl font-bold text-primary">Overall Eligibility</h2>
        <div className="mt-6 flex flex-col items-center gap-2">
          <span className="text-4xl" aria-hidden>
            {assessment.tierEmoji}
          </span>
          <p className="text-2xl font-semibold text-primary">
            {assessment.tierLabel} ({assessment.displayPercent}%)
          </p>
          <p className="text-sm text-muted-foreground">
            Assessment score: {assessment.score}/100
          </p>
        </div>
        {assessment.strengths.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {assessment.strengths.map((strength) => (
              <span
                key={strength}
                className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-primary"
              >
                {strength}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-primary">Recommended Countries</h3>
          <ul className="mt-4 space-y-3">
            {assessment.recommendedCountries.map((country) => (
              <li
                key={country.id}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3"
              >
                <span className="font-medium text-foreground">
                  {country.flag} {country.name}
                </span>
                <span className="text-sm tracking-wider text-secondary" aria-label={`${country.stars} out of 5 stars`}>
                  {renderStars(country.stars)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary">Recommended Degree</h3>
            <p className="mt-3 text-base text-foreground">{assessment.recommendedDegree}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Suggested intake: {assessment.suggestedIntake}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary">Estimated Scholarship Chance</h3>
            <p className="mt-3 text-2xl tracking-wider text-secondary">
              {renderStars(assessment.scholarshipStars)}
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-primary">Required Documents</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {assessment.requiredDocuments.map((doc) => (
            <li
              key={doc.label}
              className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm"
            >
              <DocumentStatusIcon status={doc.status} />
              <span
                className={
                  doc.status === 'available'
                    ? 'text-foreground'
                    : doc.status === 'warning'
                      ? 'text-amber-700'
                      : 'text-destructive'
                }
              >
                {doc.status === 'available' ? '✅' : doc.status === 'warning' ? '⚠' : '❌'}{' '}
                {doc.label}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {assessment.missingRequirements.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-lg font-semibold text-amber-900">Areas to Improve</h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-amber-800">
            {assessment.missingRequirements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <h3 className="text-2xl font-bold text-primary">Congratulations!</h3>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Based on your profile, you are eligible to apply. Our advisors can help you with
          university selection, documentation, and visa processing.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to={ROUTES.bookConsultation}>
            <Button size="lg">
              <FaCalendarAlt />
              Book a Free Consultation
            </Button>
          </Link>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg">
              <FaWhatsapp />
              WhatsApp Advisor
            </Button>
          </a>
          <a href={mailUrl}>
            <Button variant="outline" size="lg">
              <HiMail />
              Email Us
            </Button>
          </a>
        </div>
        <Button variant="ghost" onClick={onStartOver} className="mt-6">
          <FaRedo />
          Start New Assessment
        </Button>
      </section>
    </motion.div>
  )
}
