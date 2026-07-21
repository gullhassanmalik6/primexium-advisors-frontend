import type {
  BudgetRange,
  EnglishTest,
  Gender,
  PreferredCountry,
  PreferredDegree,
  PreferredIntake,
  Qualification,
} from '@/types/eligibility'

export const QUALIFICATION_OPTIONS: { value: Qualification; label: string }[] = [
  { value: 'matric', label: 'Matric / SSC' },
  { value: 'intermediate', label: 'Intermediate / HSSC' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'bachelors', label: "Bachelor's Degree" },
  { value: 'masters', label: "Master's Degree" },
  { value: 'mphil', label: 'MPhil' },
  { value: 'phd', label: 'PhD' },
]

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

export const COUNTRY_OPTIONS: { value: PreferredCountry; label: string; flag: string }[] = [
  { value: 'france', label: 'France', flag: '🇫🇷' },
  { value: 'italy', label: 'Italy', flag: '🇮🇹' },
  { value: 'germany', label: 'Germany', flag: '🇩🇪' },
  { value: 'finland', label: 'Finland', flag: '🇫🇮' },
  { value: 'united_kingdom', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'any', label: 'Any Suitable Country', flag: '🌍' },
]

export const DEGREE_OPTIONS: { value: PreferredDegree; label: string }[] = [
  { value: 'bachelors', label: "Bachelor's" },
  { value: 'masters', label: "Master's" },
  { value: 'phd', label: 'PhD' },
]

export const INTAKE_OPTIONS: { value: PreferredIntake; label: string }[] = [
  { value: 'september', label: 'September' },
  { value: 'january', label: 'January' },
  { value: 'may', label: 'May' },
  { value: 'flexible', label: 'Flexible' },
]

export const ENGLISH_TEST_OPTIONS: { value: EnglishTest; label: string }[] = [
  { value: 'ielts', label: 'IELTS' },
  { value: 'pte', label: 'PTE' },
  { value: 'toefl', label: 'TOEFL' },
  { value: 'duolingo', label: 'Duolingo' },
  { value: 'moi', label: 'Medium of Instruction (MOI)' },
  { value: 'not_available', label: 'Not Available' },
]

export const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: 'under_5k', label: 'Under €5,000' },
  { value: '5k_10k', label: '€5,000 – €10,000' },
  { value: '10k_20k', label: '€10,000 – €20,000' },
  { value: 'above_20k', label: 'Above €20,000' },
]

export const DOCUMENT_OPTIONS = [
  { value: 'passport' as const, label: 'Passport' },
  { value: 'educational_documents' as const, label: 'Educational Documents' },
  { value: 'cv_resume' as const, label: 'CV / Resume' },
  { value: 'recommendation_letters' as const, label: 'Recommendation Letter(s)' },
  { value: 'moi' as const, label: 'Medium of Instruction (MOI)' },
  { value: 'english_test_result' as const, label: 'English Test Result' },
  { value: 'experience_letter' as const, label: 'Experience Letter' },
]

export const SERVICE_OPTIONS = [
  { value: 'study_abroad_admission' as const, label: 'Study Abroad Admission' },
  { value: 'student_visa' as const, label: 'Student Visa' },
  { value: 'visitor_visa' as const, label: 'Visitor Visa' },
  { value: 'scholarship_guidance' as const, label: 'Scholarship Guidance' },
  { value: 'university_selection' as const, label: 'University Selection' },
  { value: 'complete_admission_package' as const, label: 'Complete Admission Package' },
]

export const GRADUATION_YEARS = Array.from(
  { length: new Date().getFullYear() - 1989 },
  (_, i) => String(new Date().getFullYear() - i),
)

export const DEFAULT_ELIGIBILITY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  nationality: '',
  countryOfResidence: '',
  dateOfBirth: '',
  gender: 'prefer_not_to_say' as Gender,
  highestQualification: 'bachelors' as Qualification,
  fieldOfStudy: '',
  universityCollege: '',
  graduationYear: '',
  cgpaOrPercentage: '',
  preferredCountries: [] as PreferredCountry[],
  preferredDegree: 'masters' as PreferredDegree,
  preferredIntake: 'flexible' as PreferredIntake,
  englishTest: 'not_available' as EnglishTest,
  englishScore: '',
  budget: '10k_20k' as BudgetRange,
  bankStatementAvailable: false,
  hasWorkExperience: false,
  companyName: '',
  position: '',
  totalExperience: '',
  documentsAvailable: [],
  servicesRequired: [],
  additionalInfo: '',
}
