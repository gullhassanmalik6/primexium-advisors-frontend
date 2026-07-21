import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SectionHeading } from '@/components/common/PageElements'
import { EligibilityForm } from '@/components/eligibility/EligibilityForm'
import { EligibilityResults } from '@/components/eligibility/EligibilityResults'
import { BRAND } from '@/constants'
import type { EligibilityAssessment, EligibilityFormData } from '@/types/eligibility'
import { assessEligibility } from '@/utils/eligibilityAssessment'

export default function EligibilityCheckerPage() {
  const [formData, setFormData] = useState<EligibilityFormData | null>(null)
  const [assessment, setAssessment] = useState<EligibilityAssessment | null>(null)

  const handleSubmit = (data: EligibilityFormData) => {
    setFormData(data)
    setAssessment(assessEligibility(data))
  }

  const handleStartOver = () => {
    setFormData(null)
    setAssessment(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showResults = formData && assessment

  return (
    <>
      <Helmet>
        <title>Check Your Eligibility | {BRAND.name}</title>
        <meta
          name="description"
          content="Complete our free eligibility assessment and discover the best study abroad options based on your academic profile."
        />
      </Helmet>

      <div className="container-wide section-padding">
        {!showResults ? (
          <>
            <SectionHeading
              eyebrow="Free Assessment"
              title="Check Your Eligibility"
              description="Start your study abroad journey in minutes. Complete the form below to receive a free preliminary eligibility assessment and discover the best study options based on your academic profile."
              align="center"
            />
            <div className="mx-auto max-w-4xl">
              <EligibilityForm onSubmit={handleSubmit} />
            </div>
          </>
        ) : (
          <>
            <SectionHeading
              eyebrow="Your Results"
              title="Eligibility Assessment"
              description={`Thank you, ${formData.fullName.split(' ')[0]}! Here is your personalized study abroad assessment.`}
              align="center"
            />
            <div className="mx-auto max-w-4xl">
              <EligibilityResults
                formData={formData}
                assessment={assessment}
                onStartOver={handleStartOver}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}
