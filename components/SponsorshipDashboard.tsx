"use client"

import { useState, useEffect } from 'react'
import { PlacementsTab } from './PlacementsTab'
import { ProductsTab } from './ProductsTab'
import { SponsorsTab } from './SponsorsTab'
import { CalendarTab } from './CalendarTab'
import { SponsorshipBooking, SponsorshipOffering, Sponsor } from '../types/sponsorship'
import { toast } from 'sonner'
import { useSponsorship } from '@/contexts/SponsorshipContext'

interface SponsorshipDashboardProps {
  initialTab: 'placements' | 'products' | 'sponsors' | 'calendar'
}

export function SponsorshipDashboard({ initialTab }: SponsorshipDashboardProps) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [view, setView] = useState<'card' | 'row'>('card')

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  const {
    offerings,
    sponsors,
    bookings,
    categories,
    addOffering,
    editOffering,
    deleteOffering,
    addSponsor,
    editSponsor,
    deleteSponsor,
    addBooking,
    editBooking,
    deleteBooking,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useSponsorship()


  const renderTabContent = () => {
    switch (activeTab) {
      case 'sponsors':
        return (
          <SponsorsTab 
            sponsors={sponsors}
            categories={categories}
            onAddSponsor={addSponsor}
            onEditSponsor={editSponsor}
            onDeleteSponsor={deleteSponsor}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
          />
        )
      case 'products':
        return (
          <ProductsTab 
            offerings={offerings}
            onAddOffer={addOffering}
            onDeleteOffer={deleteOffering}
            onEditOffer={editOffering}
            view={view}
          />
        )
      case 'placements':
        return (
          <PlacementsTab 
            bookings={bookings}
            offerings={offerings}
            sponsors={sponsors}
          />
        )
      case 'calendar':
        return (
          <CalendarTab 
            bookings={bookings}
            offerings={offerings}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="p-4">
      {renderTabContent()}
    </div>
  )
}

