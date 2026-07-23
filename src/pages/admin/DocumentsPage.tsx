import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { EmptyState, PageIntro, PortalCard, StatusBadge } from '@/components/student/PortalUI'
import { PageLoader } from '@/components/common/PageElements'
import { Select } from '@/components/ui/select'
import { getErrorMessage } from '@/api/client'
import { adminApi } from '@/api/admin'
import { BRAND } from '@/constants'
import type { AdminDocument } from '@/types/admin'
import type { DocumentStatus } from '@/types/student'

const STATUSES: DocumentStatus[] = ['pending', 'uploaded', 'under_review', 'approved', 'rejected']

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<AdminDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setDocuments(await adminApi.listDocuments())
      } catch (err) {
        setError(getErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const updateStatus = async (id: string, status: DocumentStatus) => {
    try {
      await adminApi.updateDocumentStatus(id, status)
      setDocuments((prev) => prev.map((doc) => (doc.id === id ? { ...doc, status } : doc)))
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
      <PageIntro title="Documents" description="Review student document submissions." />
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      <PortalCard title={`Documents (${documents.length})`}>
        {documents.length === 0 ? (
          <EmptyState title="No documents" description="Uploaded student documents will appear here." />
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <article
                key={doc.id}
                className="flex flex-col gap-3 rounded-xl border border-border p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-primary">{doc.title}</h3>
                  <p className="text-sm capitalize text-muted-foreground">
                    {doc.documentType.replaceAll('_', ' ')}
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {doc.studentName} · {doc.studentEmail}
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
                  <StatusBadge label={doc.status} tone="info" />
                  <Select
                    value={doc.status}
                    onChange={(e) => void updateStatus(doc.id, e.target.value as DocumentStatus)}
                    className="w-40"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.replaceAll('_', ' ')}
                      </option>
                    ))}
                  </Select>
                </div>
              </article>
            ))}
          </div>
        )}
      </PortalCard>
    </>
  )
}
