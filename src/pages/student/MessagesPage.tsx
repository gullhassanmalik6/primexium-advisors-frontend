import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/label'
import { getErrorMessage } from '@/api/client'
import { studentApi } from '@/api/student'
import { BRAND } from '@/constants'
import type { StudentMessage } from '@/types/student'

const schema = z.object({
  subject: z.string().min(2, 'Subject is required'),
  body: z.string().min(2, 'Message is required'),
})

type FormValues = z.infer<typeof schema>

export default function StudentMessagesPage() {
  const [messages, setMessages] = useState<StudentMessage[]>([])
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
    defaultValues: { subject: '', body: '' },
  })

  const load = async () => {
    setError(null)
    try {
      setMessages(await studentApi.listMessages())
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
    try {
      await studentApi.createMessage(values)
      reset()
      setShowForm(false)
      setLoading(true)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const onOpen = async (message: StudentMessage) => {
    if (!message.isFromStudent && message.status === 'unread') {
      try {
        const updated = await studentApi.markMessageRead(message.id)
        setMessages((prev) => prev.map((item) => (item.id === message.id ? updated : item)))
      } catch {
        // ignore read failures
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
        description="Communicate with your counsellor about applications and documents."
        action={
          <Button onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close form' : 'New Message'}
          </Button>
        }
      />

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {showForm && (
        <PortalCard title="Send a message" className="mb-6">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField label="Subject" required error={errors.subject?.message}>
              <Input placeholder="Message subject" {...register('subject')} />
            </FormField>
            <FormField label="Message" required error={errors.body?.message}>
              <Textarea placeholder="Write your message..." {...register('body')} />
            </FormField>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </PortalCard>
      )}

      <PortalCard title="Inbox">
        {messages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            description="Send a message to your counsellor to start a conversation."
          />
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <article
                key={message.id}
                className="cursor-pointer rounded-xl border border-border px-4 py-4"
                onClick={() => void onOpen(message)}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-primary">{message.subject}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{message.body}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {message.isFromStudent ? 'You' : 'Counsellor'} ·{' '}
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!message.isFromStudent && (
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
