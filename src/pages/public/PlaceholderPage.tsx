import { Helmet } from 'react-helmet-async'
import { PageHeader } from '@/components/common/PageElements'
import { BRAND } from '@/constants'

interface PlaceholderPageProps {
  title: string
  description?: string
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <>
      <Helmet>
        <title>
          {title} | {BRAND.name}
        </title>
      </Helmet>
      <div className="container-wide section-padding">
        <PageHeader
          title={title}
          description={description ?? `This page is under development. Content for ${title} will be available soon.`}
        />
        <div className="rounded-2xl border border-dashed border-border bg-muted p-12 text-center">
          <p className="text-muted-foreground">Coming soon</p>
        </div>
      </div>
    </>
  )
}
