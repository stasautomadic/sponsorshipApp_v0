"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, MoreHorizontal, Pencil, Trash, LayoutGrid, List, Search } from 'lucide-react'
import { SponsorshipOffering } from '../types/sponsorship'
import { NewOfferDialog } from './NewOfferDialog'
import { EditOfferDialog } from './EditOfferDialog'
import { toast } from "sonner"

interface PortfolioTabProps {
  offerings: SponsorshipOffering[]
  onAddOffer: (offer: SponsorshipOffering) => void
  onDeleteOffer: (offerId: string) => void
  onEditOffer: (offer: SponsorshipOffering) => void
  view: 'card' | 'row'
}

type OfferingType = 'all' | 'physical' | 'digital' | 'event'

export function PortfolioTab({ 
  offerings, 
  onAddOffer, 
  onDeleteOffer,
  onEditOffer,
  view
}: PortfolioTabProps) {
  const [isNewOfferDialogOpen, setIsNewOfferDialogOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<SponsorshipOffering | null>(null)
  const [viewMode, setViewMode] = useState<'card' | 'row'>('card')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<OfferingType>('all')

  const filteredOfferings = useMemo(() => {
    return offerings.filter(offering => {
      const matchesSearch = 
        offering.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offering.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = typeFilter === 'all' || offering.type === typeFilter

      return matchesSearch && matchesType
    })
  }, [offerings, searchQuery, typeFilter])

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'digital':
        return 'Digital'
      case 'physical':
        return 'Physisch'
      case 'event':
        return 'Event'
      default:
        return type
    }
  }

  const handleDelete = (offerId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Angebot löschen möchten?')) {
      onDeleteOffer(offerId)
      toast.success('Angebot erfolgreich gelöscht')
    }
  }

  const handleEdit = (offering: SponsorshipOffering) => {
    setEditingOffer(offering)
  }

  const renderCardView = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredOfferings.map((offering) => (
        <Card key={offering.id} className="bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <h3 className="font-semibold text-lg">{offering.name}</h3>
                <p className="text-sm text-muted-foreground">{offering.description}</p>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary">
                  {getTypeLabel(offering.type)}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEdit(offering)}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Bearbeiten
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(offering.id)}
                      className="cursor-pointer text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Löschen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderRowView = () => (
    <div className="space-y-4">
      {filteredOfferings.map((offering) => (
        <div
          key={offering.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg border"
        >
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{offering.name}</h3>
              <Badge variant="secondary">
                {getTypeLabel(offering.type)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{offering.description}</p>
          </div>
          <div className="ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => handleEdit(offering)}
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Bearbeiten
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDelete(offering.id)}
                  className="cursor-pointer text-red-600"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Löschen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Bestehende Sponsoring-Leistungen</h2>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsNewOfferDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Neues Angebot
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'card' ? 'row' : 'card')}
            className="h-10 w-10"
          >
            {viewMode === 'card' ? (
              <List className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9 max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={(value: OfferingType) => setTypeFilter(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="physical">Physical</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
            <SelectItem value="event">Event</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {viewMode === 'card' ? renderCardView() : renderRowView()}

      {filteredOfferings.length === 0 && (
        <Card className="bg-white">
          <CardContent className="py-6 text-center text-muted-foreground">
            {searchQuery || typeFilter !== 'all' 
              ? 'No matching offerings found. Try adjusting your search or filters.'
              : 'Noch keine Sponsoring-Leistungen vorhanden. Fügen Sie Ihre erste Leistung über den "Neues Angebot" Button hinzu.'}
          </CardContent>
        </Card>
      )}

      <NewOfferDialog 
        isOpen={isNewOfferDialogOpen}
        onClose={() => setIsNewOfferDialogOpen(false)}
        onAddOffer={onAddOffer}
      />

      <EditOfferDialog
        isOpen={!!editingOffer}
        onClose={() => setEditingOffer(null)}
        onEditOffer={onEditOffer}
        offering={editingOffer}
      />
    </div>
  )
}

