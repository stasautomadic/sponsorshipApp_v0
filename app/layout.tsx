import { Toaster } from 'sonner'
import { AppLayout } from '@/components/AppLayout'
import { SponsorshipProvider } from '@/contexts/SponsorshipContext'
import '@/app/globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>
        <SponsorshipProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </SponsorshipProvider>
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'