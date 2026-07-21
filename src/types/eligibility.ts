export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say'

export type Qualification =
  | 'matric'
  | 'intermediate'
  | 'diploma'
  | 'bachelors'
  | 'masters'
  | 'mphil'
  | 'phd'

export type PreferredCountry =
  | 'france'
  | 'italy'
  | 'germany'
  | 'finland'
  | 'united_kingdom'
  | 'any'

export type PreferredDegree = 'bachelors' | 'masters' | 'phd'

export type PreferredIntake = 'september' | 'january' | 'may' | 'flexible'

export type EnglishTest = 'ielts' | 'pte' | 'toefl' | 'duolingo' | 'moi' | 'not_available'

export type BudgetRange = 'under_5k' | '5k_10k' | '10k_20k' | 'above_20k'

export type DocumentType =
  | 'passport'
  | 'educational_documents'
  | 'cv_resume'
  | 'recommendation_letters'
  | 'moi'
  | 'english_test_result'
  | 'experience_letter'

export type ServiceType =
  | 'study_abroad_admission'
  | 'student_visa'
  | 'visitor_visa'
  | 'scholarship_guidance'
  | 'university_selection'
  | 'complete_admission_package'

export interface EligibilityFormData {
  fullName: string
  email: string
  phone: string
  nationality: string
  countryOfResidence: string
  dateOfBirth: string
  gender: Gender

  highestQualification: Qualification
  fieldOfStudy: string
  universityCollege: string
  graduationYear: string
  cgpaOrPercentage: string

  preferredCountries: PreferredCountry[]
  preferredDegree: PreferredDegree
  preferredIntake: PreferredIntake

  englishTest: EnglishTest
  englishScore: string

  budget: BudgetRange
  bankStatementAvailable: boolean

  hasWorkExperience: boolean
  companyName: string
  position: string
  totalExperience: string

  documentsAvailable: DocumentType[]
  servicesRequired: ServiceType[]

  additionalInfo: string
}

export type EligibilityTier = 'excellent' | 'good' | 'needs_improvement' | 'limited'

export interface CountryRecommendation {
  id: PreferredCountry
  name: string
  flag: string
  stars: number
  score: number
}

export interface RequiredDocument {
  label: string
  status: 'available' | 'required' | 'warning'
}

export interface EligibilityAssessment {
  score: number
  tier: EligibilityTier
  tierLabel: string
  tierEmoji: string
  displayPercent: number
  recommendedCountries: CountryRecommendation[]
  recommendedDegree: string
  scholarshipStars: number
  requiredDocuments: RequiredDocument[]
  suggestedIntake: string
  missingRequirements: string[]
  strengths: string[]
}
