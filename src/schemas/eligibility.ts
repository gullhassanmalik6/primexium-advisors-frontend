import { z } from 'zod'

export const eligibilityFormSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().min(7, 'Phone number is required'),
    nationality: z.string().min(2, 'Nationality is required'),
    countryOfResidence: z.string().min(2, 'Country of residence is required'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']),

    highestQualification: z.enum([
      'matric',
      'intermediate',
      'diploma',
      'bachelors',
      'masters',
      'mphil',
      'phd',
    ]),
    fieldOfStudy: z.string().min(2, 'Field of study is required'),
    universityCollege: z.string().min(2, 'University / college is required'),
    graduationYear: z.string().min(1, 'Graduation year is required'),
    cgpaOrPercentage: z.string().min(1, 'CGPA or percentage is required'),

    preferredCountries: z
      .array(
        z.enum(['france', 'italy', 'germany', 'finland', 'united_kingdom', 'any']),
      )
      .min(1, 'Select at least one preferred country'),
    preferredDegree: z.enum(['bachelors', 'masters', 'phd']),
    preferredIntake: z.enum(['september', 'january', 'may', 'flexible']),

    englishTest: z.enum(['ielts', 'pte', 'toefl', 'duolingo', 'moi', 'not_available']),
    englishScore: z.string(),

    budget: z.enum(['under_5k', '5k_10k', '10k_20k', 'above_20k']),
    bankStatementAvailable: z.boolean(),

    hasWorkExperience: z.boolean(),
    companyName: z.string(),
    position: z.string(),
    totalExperience: z.string(),

    documentsAvailable: z.array(
      z.enum([
        'passport',
        'educational_documents',
        'cv_resume',
        'recommendation_letters',
        'moi',
        'english_test_result',
        'experience_letter',
      ]),
    ),
    servicesRequired: z
      .array(
        z.enum([
          'study_abroad_admission',
          'student_visa',
          'visitor_visa',
          'scholarship_guidance',
          'university_selection',
          'complete_admission_package',
        ]),
      )
      .min(1, 'Select at least one service'),
    additionalInfo: z.string(),
  })
  .superRefine((data, ctx) => {
    if (
      data.englishTest !== 'moi' &&
      data.englishTest !== 'not_available' &&
      !data.englishScore.trim()
    ) {
      ctx.addIssue({
        code: 'custom',
        message: 'Overall score is required for the selected test',
        path: ['englishScore'],
      })
    }

    if (data.hasWorkExperience) {
      if (!data.companyName.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Company name is required',
          path: ['companyName'],
        })
      }
      if (!data.position.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Position is required',
          path: ['position'],
        })
      }
      if (!data.totalExperience.trim()) {
        ctx.addIssue({
          code: 'custom',
          message: 'Total experience is required',
          path: ['totalExperience'],
        })
      }
    }
  })

export type EligibilityFormValues = z.infer<typeof eligibilityFormSchema>
