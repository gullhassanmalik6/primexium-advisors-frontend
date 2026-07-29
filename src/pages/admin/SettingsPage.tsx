import { Helmet } from 'react-helmet-async'
import { PageIntro, PortalCard } from '@/components/student/PortalUI'
import { BRAND, OFFICES } from '@/constants'

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
              <dt className="text-muted-foreground">Primary phone</dt>
              <dd className="font-medium text-primary">{BRAND.phone}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Presence</dt>
              <dd className="font-medium text-primary">{BRAND.address}</dd>
            </div>
          </dl>
        </PortalCard>
        <PortalCard title="Offices">
          <ul className="space-y-4 text-sm">
            {OFFICES.map((office) => (
              <li key={office.id} className="rounded-xl border border-border p-4">
                <p className="font-semibold text-primary">
                  {office.flag} {office.label}
                </p>
                <p className="mt-1 text-muted-foreground">{office.address}</p>
                <p className="mt-2 text-foreground">{office.phone}</p>
                <p className="text-foreground">{office.email}</p>
              </li>
            ))}
          </ul>
        </PortalCard>
      </div>
    </>
  )
}
