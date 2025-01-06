"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sponsor, SponsorshipBooking } from '../../types/sponsorship'
import { ArrowLeft } from 'lucide-react'
// import { useRouter } from 'next/navigation'
import { SponsorGeneralInfo } from './SponsorGeneralInfo'
import { SponsorDocuments } from './SponsorDocuments'
import { SponsorCommunication } from './SponsorCommunication'
import { SponsorPlacements } from './SponsorPlacements'
import { SponsorFiles } from './SponsorFiles'
import { useSponsorship } from '@/contexts/SponsorshipContext'

interface SponsorDetailProps {
  sponsor: Sponsor
  // bookings: SponsorshipBooking[]
  onBack: () => void
}

export function SponsorDetail({ sponsor, onBack }: SponsorDetailProps) {
  const [activeTab, setActiveTab] = useState('general')
  const { bookings } = useSponsorship()
  // const router = useRouter()

  const [sponsorFiles, setSponsorFiles] = useState<Array<{
    id: string
    name: string
    type: string
    size: number
    url: string
    uploadDate: Date
  }>>([
    {
      id: 'fb3230dd-4720-4452-b3cf-2cd0b22c7ab1',
      name: 'fb3230dd-4720-4452-b3cf-2cd0b22c7ab1.mp4',
      type: 'video/mp4',
      size: 1024 * 1024 * 5, // Assuming a 5MB file size
      url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fb3230dd-4720-4452-b3cf-2cd0b22c7ab1-4bHaJ6bVhnKIuVjE6Txir1lz5GRcI2.mp4',
      uploadDate: new Date('2025-01-05T12:00:00Z') // Using the current date from the context
    }
  ])

  const handleAddFile = (file: typeof sponsorFiles[0]) => {
    setSponsorFiles(prev => [...prev, file])
  }

  const handleDeleteFile = (fileId: string) => {
    setSponsorFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <SponsorGeneralInfo sponsor={sponsor} />
      case 'files':
        return <SponsorFiles 
          sponsor={sponsor} 
          files={sponsorFiles}
          onAddFile={handleAddFile}
          onDeleteFile={handleDeleteFile}
        />
      case 'communication':
        return <SponsorCommunication sponsor={sponsor} />
      case 'placements':
        return <SponsorPlacements sponsor={sponsor} bookings={bookings} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Sponsor Details</h1>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={sponsor.logo} alt={sponsor.name} className="object-contain" />
              <AvatarFallback>{sponsor.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{sponsor.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {sponsor.category} Sponsor
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border-b">
            <div className="flex">
              {['general', 'files', 'communication', 'placements'].map((tab) => (
                <Button
                  key={tab}
                  variant="ghost"
                  className={`flex-1 rounded-none ${
                    activeTab === tab 
                      ? 'border-b-2 border-primary' 
                      : ''
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <div className="p-6">
            {renderTabContent()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

