import { AppLayout } from '@/components/AppLayout'
import { SponsorshipProvider } from '@/contexts/SponsorshipContext'

export default function MediaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppLayout
      activeTab=""
      onTabChange={() => {}}
      view="card"
      onViewChange={() => {}}
      onAddOffer={() => {}}
      currentRoute="/media"
    >
      <SponsorshipProvider>
        {children}
      </SponsorshipProvider>
    </AppLayout>
  )
}

