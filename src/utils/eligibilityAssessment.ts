import { COUNTRY_OPTIONS } from '@/constants/eligibility'
import type {
  DocumentType,
  EligibilityAssessment,
  EligibilityFormData,
  EligibilityTier,
  PreferredCountry,
  RequiredDocument,
} from '@/types/eligibility'

const COUNTRY_PROFILES: Record<
  Exclude<PreferredCountry, 'any'>,
  {
    minAcademic: number
    minIelts: number
    budgetFit: Record<string, number>
    baseStars: number
  }
> = {
  france: {
    minAcademic: 55,
    minIelts: 6,
    budgetFit: { under_5k: 2, '5k_10k': 4, '10k_20k': 5, above_20k: 4 },
    baseStars: 4,
  },
  italy: {
    minAcademic: 50,
    minIelts: 5.5,
    budgetFit: { under_5k: 3, '5k_10k': 5, '10k_20k': 4, above_20k: 3 },
    baseStars: 4,
  },
  germany: {
    minAcademic: 65,
    minIelts: 6,
    budgetFit: { under_5k: 4, '5k_10k': 5, '10k_20k': 4, above_20k: 3 },
    baseStars: 4,
  },
  finland: {
    minAcademic: 60,
    minIelts: 6.5,
    budgetFit: { under_5k: 1, '5k_10k': 3, '10k_20k': 5, above_20k: 4 },
    baseStars: 3,
  },
  united_kingdom: {
    minAcademic: 65,
    minIelts: 6.5,
    budgetFit: { under_5k: 1, '5k_10k': 2, '10k_20k': 4, above_20k: 5 },
    baseStars: 4,
  },
}

const QUALIFICATION_LABELS: Record<string, string> = {
  matric: 'Matric / SSC',
  intermediate: 'Intermediate / HSSC',
  diploma: 'Diploma',
  bachelors: "Bachelor's Degree",
  masters: "Master's Degree",
  mphil: 'MPhil',
  phd: 'PhD',
}

const DEGREE_LABELS: Record<string, string> = {
  bachelors: "Bachelor's",
  masters: "Master's",
  phd: 'PhD',
}

function parseAcademicScore(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const percentMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*%/)
  if (percentMatch) return Math.min(parseFloat(percentMatch[1]), 100)

  const fractionMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/)
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1])
    const den = parseFloat(fractionMatch[2])
    if (den > 0) return Math.min((num / den) * 100, 100)
  }

  const numeric = parseFloat(trimmed)
  if (Number.isNaN(numeric)) return null
  if (numeric <= 4) return (numeric / 4) * 100
  if (numeric <= 10) return (numeric / 10) * 100
  return Math.min(numeric, 100)
}

function parseEnglishScore(test: EligibilityFormData['englishTest'], score: string): number | null {
  if (test === 'moi' || test === 'not_available') return null
  const parsed = parseFloat(score.trim())
  return Number.isNaN(parsed) ? null : parsed
}

function getEnglishEquivalent(form: EligibilityFormData): number | null {
  const score = parseEnglishScore(form.englishTest, form.englishScore)
  if (score === null) return null

  switch (form.englishTest) {
    case 'ielts':
      return score
    case 'pte':
      return score >= 79 ? 7 : score >= 65 ? 6.5 : score >= 50 ? 6 : 5.5
    case 'toefl':
      return score >= 100 ? 7 : score >= 90 ? 6.5 : score >= 79 ? 6 : 5.5
    case 'duolingo':
      return score >= 125 ? 7 : score >= 115 ? 6.5 : score >= 105 ? 6 : 5.5
    default:
      return null
  }
}

function getAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) return null
  const dob = new Date(dateOfBirth)
  if (Number.isNaN(dob.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--
  return age
}

function scoreAcademic(academicPercent: number | null): number {
  if (academicPercent === null) return 5
  if (academicPercent >= 87.5) return 25 // CGPA ≥ 3.5
  if (academicPercent >= 75) return 20 // CGPA 3.0–3.49
  if (academicPercent >= 62.5) return 15 // CGPA 2.5–2.99
  if (academicPercent >= 50) return 10
  return 5
}

function scoreLanguage(form: EligibilityFormData): number {
  if (form.englishTest === 'moi') return 8
  const ielts = getEnglishEquivalent(form)
  if (ielts === null) return 0
  if (ielts >= 7) return 20
  if (ielts >= 6.5) return 15
  if (ielts >= 6) return 10
  if (ielts >= 5.5) return 5
  return 2
}

function scoreQualification(qualification: EligibilityFormData['highestQualification']): number {
  const map: Record<string, number> = {
    matric: 5,
    intermediate: 8,
    diploma: 10,
    bachelors: 12,
    masters: 15,
    mphil: 18,
    phd: 20,
  }
  return map[qualification] ?? 5
}

function scoreDocuments(documents: DocumentType[]): number {
  const essential: DocumentType[] = ['passport', 'educational_documents']
  const hasEssential = essential.every((doc) => documents.includes(doc))
  if (hasEssential && documents.length >= 5) return 7
  if (hasEssential && documents.length >= 3) return 5
  if (documents.length >= 2) return 3
  return 0
}

function getTier(score: number): {
  tier: EligibilityTier
  tierLabel: string
  tierEmoji: string
  displayPercent: number
} {
  if (score >= 85) {
    return { tier: 'excellent', tierLabel: 'Excellent Match', tierEmoji: '🟢', displayPercent: 90 }
  }
  if (score >= 70) {
    return { tier: 'good', tierLabel: 'Good Match', tierEmoji: '🟡', displayPercent: 75 }
  }
  if (score >= 55) {
    return {
      tier: 'needs_improvement',
      tierLabel: 'Needs Improvement',
      tierEmoji: '🟠',
      displayPercent: 55,
    }
  }
  return { tier: 'limited', tierLabel: 'Limited Match', tierEmoji: '🔴', displayPercent: 40 }
}

function scoreCountry(
  countryId: Exclude<PreferredCountry, 'any'>,
  form: EligibilityFormData,
  academicPercent: number | null,
  ieltsEquivalent: number | null,
): number {
  const profile = COUNTRY_PROFILES[countryId]
  let score = profile.baseStars * 15

  if (academicPercent !== null) {
    if (academicPercent >= profile.minAcademic + 15) score += 20
    else if (academicPercent >= profile.minAcademic) score += 12
    else score += 4
  }

  if (form.englishTest === 'moi') {
    score += countryId === 'germany' || countryId === 'italy' ? 10 : 6
  } else if (ieltsEquivalent !== null) {
    if (ieltsEquivalent >= profile.minIelts + 0.5) score += 18
    else if (ieltsEquivalent >= profile.minIelts) score += 12
    else score += 3
  } else {
    score -= 8
  }

  score += profile.budgetFit[form.budget] * 4

  if (form.preferredCountries.includes(countryId)) score += 15
  if (form.preferredCountries.includes('any')) score += 5

  return score
}

function starsFromScore(score: number): number {
  if (score >= 85) return 5
  if (score >= 70) return 4
  if (score >= 55) return 3
  if (score >= 40) return 2
  return 1
}

function buildRecommendedDegree(form: EligibilityFormData): string {
  const field = form.fieldOfStudy.trim() || 'your chosen field'
  const degree = DEGREE_LABELS[form.preferredDegree] ?? "Master's"
  return `${degree} in ${field}`
}

function buildScholarshipStars(form: EligibilityFormData, academicPercent: number | null): number {
  let stars = 2
  if (academicPercent !== null && academicPercent >= 80) stars += 1.5
  else if (academicPercent !== null && academicPercent >= 70) stars += 1
  if (form.hasWorkExperience) stars += 0.5
  if (form.budget === 'under_5k' || form.budget === '5k_10k') stars += 0.5
  if (form.documentsAvailable.includes('recommendation_letters')) stars += 0.5
  return Math.min(Math.round(stars), 5)
}

function buildRequiredDocuments(form: EligibilityFormData): RequiredDocument[] {
  const docs: RequiredDocument[] = [
    {
      label: 'Passport',
      status: form.documentsAvailable.includes('passport') ? 'available' : 'required',
    },
    {
      label: QUALIFICATION_LABELS[form.highestQualification] ?? 'Educational Documents',
      status: form.documentsAvailable.includes('educational_documents') ? 'available' : 'required',
    },
  ]

  if (form.englishTest === 'not_available') {
    docs.push({ label: 'IELTS / English Test Required', status: 'warning' })
  } else if (form.documentsAvailable.includes('english_test_result') || form.englishTest === 'moi') {
    docs.push({
      label: form.englishTest === 'moi' ? 'Medium of Instruction Letter' : 'English Test Result',
      status: 'available',
    })
  } else {
    docs.push({ label: 'English Test Result', status: 'warning' })
  }

  if (form.hasWorkExperience) {
    docs.push({
      label: 'Experience Letter',
      status: form.documentsAvailable.includes('experience_letter') ? 'available' : 'warning',
    })
  }

  if (form.preferredDegree !== 'bachelors') {
    docs.push({
      label: 'CV / Resume',
      status: form.documentsAvailable.includes('cv_resume') ? 'available' : 'warning',
    })
  }

  return docs
}

function buildMissingRequirements(form: EligibilityFormData): string[] {
  const missing: string[] = []

  if (!form.documentsAvailable.includes('passport')) missing.push('Valid passport required')
  if (!form.documentsAvailable.includes('educational_documents')) {
    missing.push('Educational documents (transcripts, degrees)')
  }
  if (form.englishTest === 'not_available') {
    missing.push('English proficiency test (IELTS 6.0+ recommended)')
  }
  if (!form.bankStatementAvailable) {
    missing.push('Bank statement for visa application')
  }
  if (form.preferredDegree !== 'bachelors' && !form.documentsAvailable.includes('cv_resume')) {
    missing.push('Updated CV / Resume')
  }

  return missing
}

function buildStrengths(form: EligibilityFormData, academicPercent: number | null): string[] {
  const strengths: string[] = []

  if (academicPercent !== null && academicPercent >= 75) {
    strengths.push('Strong academic profile')
  }
  if (form.englishTest === 'moi') {
    strengths.push('Medium of Instruction available')
  } else {
    const ielts = getEnglishEquivalent(form)
    if (ielts !== null && ielts >= 6.5) strengths.push('Good English proficiency')
  }
  if (form.hasWorkExperience) strengths.push('Relevant work experience')
  if (form.bankStatementAvailable) strengths.push('Financial documentation ready')
  if (form.documentsAvailable.length >= 4) strengths.push('Well-prepared documentation')

  return strengths
}

function getSuggestedIntake(form: EligibilityFormData): string {
  if (form.preferredIntake !== 'flexible') {
    const label = form.preferredIntake.charAt(0).toUpperCase() + form.preferredIntake.slice(1)
    return `${label} intake`
  }

  const month = new Date().getMonth()
  if (month <= 3) return 'September intake (recommended)'
  if (month <= 8) return 'January intake (recommended)'
  return 'September intake (next cycle)'
}

export function assessEligibility(form: EligibilityFormData): EligibilityAssessment {
  const academicPercent = parseAcademicScore(form.cgpaOrPercentage)
  const ieltsEquivalent = getEnglishEquivalent(form)
  const age = getAge(form.dateOfBirth)

  let score = 0
  score += scoreAcademic(academicPercent)
  score += scoreLanguage(form)
  score += scoreQualification(form.highestQualification)
  score += scoreDocuments(form.documentsAvailable)
  if (form.hasWorkExperience) score += 10
  if (form.bankStatementAvailable) score += 10
  if (age !== null && age >= 18 && age <= 35) score += 10
  else if (age !== null && age >= 17 && age <= 45) score += 5

  score = Math.min(Math.round(score), 100)

  const { tier, tierLabel, tierEmoji, displayPercent } = getTier(score)

  const countryIds = COUNTRY_OPTIONS.filter((c) => c.value !== 'any').map((c) => c.value) as Exclude<
    PreferredCountry,
    'any'
  >[]

  const recommendedCountries = countryIds
    .map((id) => {
      const meta = COUNTRY_OPTIONS.find((c) => c.value === id)!
      const countryScore = scoreCountry(id, form, academicPercent, ieltsEquivalent)
      return {
        id,
        name: meta.label,
        flag: meta.flag,
        stars: starsFromScore(countryScore),
        score: countryScore,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  return {
    score,
    tier,
    tierLabel,
    tierEmoji,
    displayPercent,
    recommendedCountries,
    recommendedDegree: buildRecommendedDegree(form),
    scholarshipStars: buildScholarshipStars(form, academicPercent),
    requiredDocuments: buildRequiredDocuments(form),
    suggestedIntake: getSuggestedIntake(form),
    missingRequirements: buildMissingRequirements(form),
    strengths: buildStrengths(form, academicPercent),
  }
}

export function renderStars(count: number): string {
  const full = Math.floor(count)
  const half = count % 1 >= 0.5
  return '⭐'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(Math.max(0, 5 - full - (half ? 1 : 0)))
}
