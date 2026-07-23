import { useEffect, useMemo, useState } from 'react'
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
import { contentApi, type ContentItem, type ContentType } from '@/api/content'
import { BRAND } from '@/constants'

const META: Record<
  ContentType,
  { title: string; description: string; routeKind: ContentType }
> = {
  country: {
    title: 'Countries CMS',
    description: 'Create and publish study destinations shown on the website.',
    routeKind: 'country',
  },
  university: {
    title: 'Universities CMS',
    description: 'Manage partner universities listed publicly.',
    routeKind: 'university',
  },
  package: {
    title: 'Packages CMS',
    description: 'Edit pricing packages students see on the site.',
    routeKind: 'package',
  },
  blog: {
    title: 'Blog CMS',
    description: 'Publish and update blog posts.',
    routeKind: 'blog',
  },
  testimonial: {
    title: 'Testimonials CMS',
    description: 'Manage student success stories.',
    routeKind: 'testimonial',
  },
}

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  summary: z.string().optional(),
  body: z.string().optional(),
  dataJson: z.string().optional(),
  sortOrder: z.string().optional(),
  isPublished: z.boolean(),
})

type FormValues = z.infer<typeof schema>

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function AdminContentPage({ kind }: { kind: ContentType }) {
  const meta = META[kind]
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      slug: '',
      summary: '',
      body: '',
      dataJson: '{}',
      sortOrder: '0',
      isPublished: true,
    },
  })

  const titleValue = watch('title')

  useEffect(() => {
    if (!editingId && titleValue && !watch('slug')) {
      setValue('slug', slugify(titleValue))
    }
  }, [editingId, setValue, titleValue, watch])

  const load = async () => {
    setError(null)
    try {
      setItems(await contentApi.adminList(kind))
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    void load()
  }, [kind])

  const openCreate = () => {
    setEditingId(null)
    reset({
      title: '',
      slug: '',
      summary: '',
      body: '',
      dataJson: '{}',
      sortOrder: String(items.length + 1),
      isPublished: true,
    })
    setShowForm(true)
  }

  const openEdit = (item: ContentItem) => {
    setEditingId(item.id)
    reset({
      title: item.title,
      slug: item.slug,
      summary: item.summary ?? '',
      body: item.body ?? '',
      dataJson: JSON.stringify(item.data ?? {}, null, 2),
      sortOrder: String(item.sortOrder),
      isPublished: item.isPublished,
    })
    setShowForm(true)
  }

  const onSubmit = async (values: FormValues) => {
    setError(null)
    let parsedData: Record<string, unknown> = {}
    try {
      parsedData = values.dataJson ? (JSON.parse(values.dataJson) as Record<string, unknown>) : {}
    } catch {
      setError('Extra data must be valid JSON')
      return
    }

    try {
      if (editingId) {
        await contentApi.update(editingId, {
          title: values.title,
          slug: values.slug,
          summary: values.summary,
          body: values.body,
          data: parsedData,
          sortOrder: Number(values.sortOrder || 0),
          isPublished: values.isPublished,
        })
      } else {
        await contentApi.create({
          contentType: kind,
          title: values.title,
          slug: values.slug,
          summary: values.summary,
          body: values.body,
          data: parsedData,
          sortOrder: Number(values.sortOrder || 0),
          isPublished: values.isPublished,
        })
      }
      setShowForm(false)
      setEditingId(null)
      setLoading(true)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const onDelete = async (id: string) => {
    setError(null)
    try {
      await contentApi.remove(id)
      setItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const helper = useMemo(() => {
    if (kind === 'country') return '{"flag":"🇫🇷","universities":"60+","highlights":["Point 1"]}'
    if (kind === 'university') return '{"country":"Germany","ranking":37,"focus":"STEM"}'
    if (kind === 'package') return '{"price":"99,999","currency":"PKR","popular":true,"features":["Feature"]}'
    if (kind === 'blog') return '{"category":"Applications","date":"May 10, 2026"}'
    return '{"university":"TU Munich","country":"Germany","rating":5}'
  }, [kind])

  if (loading) return <PageLoader label="Loading CMS content..." />

  return (
    <>
      <Helmet>
        <title>
          {meta.title} | {BRAND.name}
        </title>
      </Helmet>
      <PageIntro
        title={meta.title}
        description={meta.description}
        action={<Button onClick={openCreate}>{showForm && !editingId ? 'Close form' : 'Add item'}</Button>}
      />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {showForm && (
        <PortalCard title={editingId ? 'Edit content' : 'New content'} className="mb-6">
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
            <FormField label="Title" required error={errors.title?.message}>
              <Input {...register('title')} />
            </FormField>
            <FormField label="Slug" required error={errors.slug?.message}>
              <Input {...register('slug')} />
            </FormField>
            <FormField label="Summary" className="sm:col-span-2" error={errors.summary?.message}>
              <Textarea {...register('summary')} />
            </FormField>
            <FormField label="Body" className="sm:col-span-2" error={errors.body?.message}>
              <Textarea {...register('body')} />
            </FormField>
            <FormField
              label="Extra data (JSON)"
              className="sm:col-span-2"
              error={errors.dataJson?.message}
            >
              <Textarea className="font-mono text-xs" {...register('dataJson')} />
              <p className="mt-1 text-xs text-muted-foreground">Example: {helper}</p>
            </FormField>
            <FormField label="Sort order">
              <Input type="number" {...register('sortOrder')} />
            </FormField>
            <FormField label="Published">
              <label className="flex h-11 items-center gap-2 text-sm">
                <input type="checkbox" className="h-4 w-4" {...register('isPublished')} />
                Visible on website
              </label>
            </FormField>
            <div className="flex gap-3 sm:col-span-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </PortalCard>
      )}

      <PortalCard title={`Items (${items.length})`}>
        {items.length === 0 ? (
          <EmptyState
            title="No CMS content yet"
            description="Add items here, or run: python -m app.scripts.seed_content"
          />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-border p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-primary">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    /{item.slug}
                    {item.summary ? ` · ${item.summary}` : ''}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label={item.isPublished ? 'published' : 'draft'}
                    tone={item.isPublished ? 'success' : 'warning'}
                  />
                  <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => void onDelete(item.id)}>
                    Delete
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
