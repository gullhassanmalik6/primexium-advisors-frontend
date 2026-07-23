import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { SectionHeading } from '@/components/common/PageElements'
import { EligibilityForm } from '@/components/eligibility/EligibilityForm'
import { EligibilityResults } from '@/components/eligibility/EligibilityResults'
import { leadsApi } from '@/api/leads'
import { BRAND } from '@/constants'
import type { EligibilityAssessment, EligibilityFormData } from '@/types/eligibility'
import { assessEligibility } from '@/utils/eligibilityAssessment'

function preferredCountryLabel(countries: EligibilityFormData['preferredCountries']): string {
  if (!countries.length) return 'Any Suitable Country'
  return countries
    .map((c) =>
      c
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' '),
    )
    .join(', ')
}

export default function EligibilityCheckerPage() {
  const [formData, setFormData] = useState<EligibilityFormData | null>(null)
  const [assessment, setAssessment] = useState<EligibilityAssessment | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (data: EligibilityFormData) => {
    const result = assessEligibility(data)
    setFormData(data)
    setAssessment(result)
    setIsSaving(true)
    try {
      await leadsApi.submitEligibility({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        preferred_country: preferredCountryLabel(data.preferredCountries),
        preferred_degree: data.preferredDegree,
        preferred_intake: data.preferredIntake,
        eligibility_score: result.score,
        eligibility_tier: result.tierLabel,
        payload: {
          form: data,
          assessment: {
            score: result.score,
            tier: result.tier,
            tierLabel: result.tierLabel,
            recommendedDegree: result.recommendedDegree,
            recommendedCountries: result.recommendedCountries,
            scholarshipStars: result.scholarshipStars,
            missingRequirements: result.missingRequirements,
          },
        },
      })
    } catch {
      // Results still show even if lead persistence fails (e.g. backend offline).
    } finally {
      setIsSaving(false)
    }
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
            {isSaving && (
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Saving your assessment for our advisors...
              </p>
            )}
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
