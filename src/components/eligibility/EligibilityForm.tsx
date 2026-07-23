import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaPaperPlane } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import {
  BooleanRadio,
  CheckboxGroup,
  FormSection,
  RadioGroup,
} from '@/components/eligibility/FormSection'
import {
  BUDGET_OPTIONS,
  COUNTRY_OPTIONS,
  DEFAULT_ELIGIBILITY_FORM,
  DEGREE_OPTIONS,
  DOCUMENT_OPTIONS,
  ENGLISH_TEST_OPTIONS,
  GENDER_OPTIONS,
  GRADUATION_YEARS,
  INTAKE_OPTIONS,
  QUALIFICATION_OPTIONS,
  SERVICE_OPTIONS,
} from '@/constants/eligibility'
import { eligibilityFormSchema, type EligibilityFormValues } from '@/schemas/eligibility'
import type { EligibilityFormData } from '@/types/eligibility'

interface EligibilityFormProps {
  onSubmit: (data: EligibilityFormData) => void | Promise<void>
}

export function EligibilityForm({ onSubmit }: EligibilityFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EligibilityFormValues>({
    resolver: zodResolver(eligibilityFormSchema),
    defaultValues: DEFAULT_ELIGIBILITY_FORM,
  })

  const hasWorkExperience = watch('hasWorkExperience')
  const englishTest = watch('englishTest')
  const showEnglishScore = englishTest !== 'moi' && englishTest !== 'not_available'

  const submit = async (values: EligibilityFormValues) => {
    await onSubmit(values as EligibilityFormData)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-8" noValidate>
      <FormSection icon="👤" title="Personal Information">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="Full Name" required error={errors.fullName?.message}>
            <Input placeholder="John Doe" {...register('fullName')} />
          </FormField>
          <FormField label="Email Address" required error={errors.email?.message}>
            <Input type="email" placeholder="john@example.com" {...register('email')} />
          </FormField>
          <FormField label="Phone Number (WhatsApp)" required error={errors.phone?.message}>
            <Input type="tel" placeholder="+92 300 0000000" {...register('phone')} />
          </FormField>
          <FormField label="Nationality" required error={errors.nationality?.message}>
            <Input placeholder="Pakistani" {...register('nationality')} />
          </FormField>
          <FormField label="Country of Residence" required error={errors.countryOfResidence?.message}>
            <Input placeholder="Pakistan" {...register('countryOfResidence')} />
          </FormField>
          <FormField label="Date of Birth" required error={errors.dateOfBirth?.message}>
            <Input type="date" {...register('dateOfBirth')} />
          </FormField>
        </div>
        <FormField label="Gender">
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="gender"
                options={GENDER_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                inline
              />
            )}
          />
        </FormField>
      </FormSection>

      <FormSection icon="🎓" title="Academic Information">
        <FormField label="Highest Qualification" required error={errors.highestQualification?.message}>
          <Controller
            name="highestQualification"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="highestQualification"
                options={QUALIFICATION_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField label="Field of Study" required error={errors.fieldOfStudy?.message}>
            <Input placeholder="Computer Science" {...register('fieldOfStudy')} />
          </FormField>
          <FormField label="University / College" required error={errors.universityCollege?.message}>
            <Input placeholder="University name" {...register('universityCollege')} />
          </FormField>
          <FormField label="Graduation Year" required error={errors.graduationYear?.message}>
            <Select {...register('graduationYear')} defaultValue="">
              <option value="" disabled>
                Select year
              </option>
              {GRADUATION_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="CGPA / Percentage" required error={errors.cgpaOrPercentage?.message}>
            <Input placeholder="e.g. 3.5, 3.5/4, or 85%" {...register('cgpaOrPercentage')} />
          </FormField>
        </div>
      </FormSection>

      <FormSection icon="🌍" title="Study Preferences">
        <FormField
          label="Preferred Country"
          required
          error={errors.preferredCountries?.message}
        >
          <Controller
            name="preferredCountries"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                options={COUNTRY_OPTIONS.map((c) => ({ value: c.value, label: `${c.flag} ${c.label}` }))}
                values={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
        <FormField label="Preferred Degree" required>
          <Controller
            name="preferredDegree"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="preferredDegree"
                options={DEGREE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                inline
              />
            )}
          />
        </FormField>
        <FormField label="Preferred Intake" required>
          <Controller
            name="preferredIntake"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="preferredIntake"
                options={INTAKE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                inline
              />
            )}
          />
        </FormField>
      </FormSection>

      <FormSection icon="📚" title="Language Proficiency">
        <FormField label="English Test">
          <Controller
            name="englishTest"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="englishTest"
                options={ENGLISH_TEST_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
        {showEnglishScore && (
          <FormField label="Overall Score" required error={errors.englishScore?.message}>
            <Input
              placeholder={
                englishTest === 'ielts'
                  ? 'e.g. 6.5'
                  : englishTest === 'pte'
                    ? 'e.g. 65'
                    : englishTest === 'toefl'
                      ? 'e.g. 90'
                      : 'e.g. 115'
              }
              {...register('englishScore')}
            />
          </FormField>
        )}
      </FormSection>

      <FormSection icon="💰" title="Financial Information">
        <FormField label="Estimated Budget">
          <Controller
            name="budget"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="budget"
                options={BUDGET_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
        <FormField label="Bank Statement Available?">
          <Controller
            name="bankStatementAvailable"
            control={control}
            render={({ field }) => (
              <BooleanRadio name="bankStatement" value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>
      </FormSection>

      <FormSection icon="💼" title="Work Experience">
        <FormField label="Do you have any work experience?">
          <Controller
            name="hasWorkExperience"
            control={control}
            render={({ field }) => (
              <BooleanRadio
                name="hasWorkExperience"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
        {hasWorkExperience && (
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Company Name" required error={errors.companyName?.message}>
              <Input placeholder="Company name" {...register('companyName')} />
            </FormField>
            <FormField label="Position" required error={errors.position?.message}>
              <Input placeholder="Job title" {...register('position')} />
            </FormField>
            <FormField
              label="Total Experience"
              required
              error={errors.totalExperience?.message}
              className="sm:col-span-2"
            >
              <Input placeholder="e.g. 2 years" {...register('totalExperience')} />
            </FormField>
          </div>
        )}
      </FormSection>

      <FormSection icon="📄" title="Documents Available">
        <Controller
          name="documentsAvailable"
          control={control}
          render={({ field }) => (
            <CheckboxGroup
              options={DOCUMENT_OPTIONS}
              values={field.value}
              onChange={field.onChange}
              columns={2}
            />
          )}
        />
      </FormSection>

      <FormSection icon="✈️" title="Services Required">
        <FormField label="Select the services you need" required error={errors.servicesRequired?.message}>
          <Controller
            name="servicesRequired"
            control={control}
            render={({ field }) => (
              <CheckboxGroup
                options={SERVICE_OPTIONS}
                values={field.value}
                onChange={field.onChange}
                columns={2}
              />
            )}
          />
        </FormField>
      </FormSection>

      <FormSection icon="📝" title="Additional Information">
        <FormField label="Tell us anything that can help us assess your profile.">
          <Textarea
            placeholder="Share any additional details about your goals, achievements, or concerns..."
            {...register('additionalInfo')}
          />
        </FormField>
      </FormSection>

      <div className="flex justify-center pb-8">
        <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-[240px]">
          <FaPaperPlane />
          Get My Assessment
        </Button>
      </div>
    </form>
  )
}
