import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { FormField } from '@/components/ui/label'
import { getErrorMessage } from '@/api/client'
import { studentApi } from '@/api/student'
import { BRAND } from '@/constants'
import type { DocumentType, StudentDocument } from '@/types/student'

const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'passport', label: 'Passport' },
  { value: 'transcript', label: 'Transcript' },
  { value: 'degree', label: 'Degree / Certificate' },
  { value: 'cv', label: 'CV / Resume' },
  { value: 'sop', label: 'Statement of Purpose' },
  { value: 'recommendation', label: 'Recommendation Letter' },
  { value: 'english_test', label: 'English Test Result' },
  { value: 'moi', label: 'MOI Letter' },
  { value: 'experience_letter', label: 'Experience Letter' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'other', label: 'Other' },
]

const schema = z.object({
  documentType: z.string().min(1),
  title: z.string().min(2, 'Title is required'),
})

type FormValues = z.infer<typeof schema>

function statusTone(status: StudentDocument['status']) {
  if (status === 'approved') return 'success'
  if (status === 'rejected') return 'danger'
  if (status === 'under_review') return 'info'
  if (status === 'pending') return 'warning'
  return 'neutral'
}

export default function StudentDocumentsPage() {
  const [documents, setDocuments] = useState<StudentDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { documentType: 'passport', title: '' },
  })

  const load = async () => {
    setError(null)
    try {
      setDocuments(await studentApi.listDocuments())
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const onSubmit = async (values: FormValues) => {
    setError(null)
    if (!selectedFile) {
      setError('Please choose a file to upload (PDF, JPG, PNG, or WEBP).')
      return
    }
    try {
      await studentApi.uploadDocument({
        documentType: values.documentType as DocumentType,
        title: values.title,
        file: selectedFile,
      })
      reset({ documentType: 'passport', title: '' })
      setSelectedFile(null)
      setShowForm(false)
      setLoading(true)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const onDelete = async (id: string) => {
    setError(null)
    try {
      await studentApi.deleteDocument(id)
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  if (loading) return <PageLoader label="Loading documents..." />

  return (
    <>
      <Helmet>
        <title>Documents | {BRAND.name}</title>
      </Helmet>

      <PageIntro
        title="Documents"
        description="Upload PDF or image documents required for admissions and visa processing."
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close form' : 'Upload Document'}
          </Button>
        }
      />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {showForm && (
        <PortalCard title="Upload document" className="mb-6">
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField label="Document Type" required>
              <Select {...register('documentType')}>
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Title" required error={errors.title?.message}>
              <Input placeholder="e.g. Passport Scan" {...register('title')} />
            </FormField>
            <FormField label="File" required className="sm:col-span-2">
              <Input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Max 8 MB. Allowed: PDF, JPG, PNG, WEBP.
              </p>
            </FormField>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>
          </form>
        </PortalCard>
      )}

      <PortalCard title="Your documents">
        {documents.length === 0 ? (
          <EmptyState
            title="No documents uploaded"
            description="Add your passport, transcripts, and other required files to get started."
          />
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <article
                key={doc.id}
                className="flex flex-col gap-3 rounded-xl border border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-primary">{doc.title}</h3>
                  <p className="mt-1 text-sm capitalize text-muted-foreground">
                    {doc.documentType.replaceAll('_', ' ')}
                  </p>
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm text-secondary hover:underline"
                    >
                      Open file
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge label={doc.status} tone={statusTone(doc.status)} />
                  <Button variant="outline" size="sm" onClick={() => void onDelete(doc.id)}>
                    Remove
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </PortalCard>
    </>
  )
}
