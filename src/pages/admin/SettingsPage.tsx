import { Helmet } from 'react-helmet-async'
import { PageIntro, PortalCard } from '@/components/student/PortalUI'
import { BRAND } from '@/constants'

export default function AdminSettingsPage() {
  return (
    <>
      <Helmet>
        <title>Settings | {BRAND.name}</title>
      </Helmet>
      <PageIntro
        title="Settings"
        description="Organisation details currently used across the public website and portals."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <PortalCard title="Brand">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-medium text-primary">{BRAND.name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Tagline</dt>
              <dd className="font-medium text-primary">{BRAND.tagline}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-medium text-primary">{BRAND.email}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-medium text-primary">{BRAND.phone}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Address</dt>
              <dd className="font-medium text-primary">{BRAND.address}</dd>
            </div>
          </dl>
        </PortalCard>
        <PortalCard title="Notes">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Brand and marketing content are currently managed in frontend constants
            (<code className="mx-1 rounded bg-muted px-1">constants/index.ts</code>
            and
            <code className="mx-1 rounded bg-muted px-1">constants/content.ts</code>.
            A full CMS database layer can be added later for in-app editing.
          </p>
        </PortalCard>
      </div>
    </>
  )
}
