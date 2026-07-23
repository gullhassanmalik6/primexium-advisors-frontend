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
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { BRAND } from '@/constants'
import type { AdminMessage, AdminStudent } from '@/types/admin'

const schema = z.object({
  studentId: z.string().min(1, 'Select a student'),
  subject: z.string().min(2, 'Subject is required'),
  body: z.string().min(2, 'Message is required'),
})

type FormValues = z.infer<typeof schema>

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [students, setStudents] = useState<AdminStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { studentId: '', subject: '', body: '' },
  })

  const load = async () => {
    setError(null)
    try {
      const [messageItems, studentItems] = await Promise.all([
        adminApi.listMessages(),
        adminApi.listStudents(),
      ])
      setMessages(messageItems)
      setStudents(studentItems)
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
    try {
      await adminApi.sendMessage(values.studentId, values.subject, values.body)
      reset()
      setShowForm(false)
      setLoading(true)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const onOpen = async (message: AdminMessage) => {
    if (message.isFromStudent && message.status === 'unread') {
      try {
        await adminApi.markMessageRead(message.id)
        setMessages((prev) =>
          prev.map((item) => (item.id === message.id ? { ...item, status: 'read' } : item)),
        )
      } catch {
        // ignore
      }
    }
  }

  if (loading) return <PageLoader label="Loading messages..." />

  return (
    <>
      <Helmet>
        <title>Messages | {BRAND.name}</title>
      </Helmet>
      <PageIntro
        title="Messages"
        description="Reply to students and manage counselling conversations."
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close form' : 'Message Student'}
          </Button>
        }
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {showForm && (
        <PortalCard title="Send message" className="mb-6">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField label="Student" required error={errors.studentId?.message}>
              <Select {...register('studentId')} defaultValue="">
                <option value="" disabled>
                  Select student
                </option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ({student.email})
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Subject" required error={errors.subject?.message}>
              <Input {...register('subject')} />
            </FormField>
            <FormField label="Message" required error={errors.body?.message}>
              <Textarea {...register('body')} />
            </FormField>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send'}
            </Button>
          </form>
        </PortalCard>
      )}
      <PortalCard title={`Inbox (${messages.length})`}>
        {messages.length === 0 ? (
          <EmptyState title="No messages" description="Student messages and staff replies appear here." />
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <article
                key={message.id}
                className="cursor-pointer rounded-xl border border-border p-4"
                onClick={() => void onOpen(message)}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-primary">{message.subject}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{message.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {message.studentName} · {message.isFromStudent ? 'Student' : 'Staff'} ·{' '}
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {message.isFromStudent && (
                    <StatusBadge
                      label={message.status}
                      tone={message.status === 'unread' ? 'warning' : 'success'}
                    />
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </PortalCard>
    </>
  )
}
