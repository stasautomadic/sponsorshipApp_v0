"use client"

import { useState, useEffect, useId } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SponsorshipBooking, SponsorshipOffering, Sponsor } from '../types/sponsorship'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { toast } from "sonner"
import { useSponsorship } from '@/contexts/SponsorshipContext'
import { v4 as uuidv4 } from 'uuid'
import { Input } from "@/components/ui/input"

interface BookSponsorshipDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (booking: SponsorshipBooking) => void
  editingBooking?: SponsorshipBooking | null
}

type BookingMode = 'range' | 'specific'

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export function BookSponsorshipDialog({ 
  isOpen, 
  onClose, 
  onSubmit,
  editingBooking 
}: BookSponsorshipDialogProps) {
  const { sponsors, offerings, addSponsor, addOffering } = useSponsorship()
  const [bookingMode, setBookingMode] = useState<BookingMode>('range')
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  
  const [formData, setFormData] = useState({
    sponsorId: '',
    offeringId: '',
  })

  const [isAddingSponsor, setIsAddingSponsor] = useState(false)
  const [newSponsorName, setNewSponsorName] = useState('')

  const [isAddingOffering, setIsAddingOffering] = useState(false)
  const [newOffering, setNewOffering] = useState({
    name: '',
    description: '',
    type: ''
  })

  // Generate unique IDs for select components
  const sponsorSelectId = useId()
  const offeringSelectId = useId()

  useEffect(() => {
    if (editingBooking) {
      setFormData({
        sponsorId: editingBooking.sponsorId,
        offeringId: editingBooking.offeringId,
      })
      setDateRange({
        from: new Date(editingBooking.startDate),
        to: new Date(editingBooking.endDate)
      })
      setSelectedDates([])
    } else {
      resetForm()
    }
  }, [editingBooking, isOpen])

  const resetForm = () => {
    setFormData({
      sponsorId: '',
      offeringId: '',
    })
    setDateRange({ from: undefined, to: undefined })
    setSelectedDates([])
    setBookingMode('range')
  }

  const handleAddSponsor = () => {
    if (!newSponsorName.trim()) {
      toast.error("Bitte geben Sie einen Sponsornamen ein")
      return
    }

    const newSponsor: Sponsor = {
      id: uuidv4(),
      name: newSponsorName.trim(),
      logo: '/placeholder.svg',
      category: 'Uncategorized',
      accountManager: '',
      contact: {
        name: '',
        role: '',
        email: ''
      }
    }

    addSponsor(newSponsor)
    setFormData(prev => ({ ...prev, sponsorId: newSponsor.id }))
    setNewSponsorName('')
    setIsAddingSponsor(false)
    toast.success("Sponsor erfolgreich hinzugefügt")
  }

  const handleAddOffering = () => {
    if (!newOffering.name.trim() || !newOffering.type) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus")
      return
    }

    const offering: SponsorshipOffering = {
      id: uuidv4(),
      name: newOffering.name.trim(),
      description: newOffering.description.trim(),
      type: newOffering.type as 'digital' | 'physical' | 'event'
    }

    addOffering(offering)
    setFormData(prev => ({ ...prev, offeringId: offering.id }))
    setNewOffering({ name: '', description: '', type: '' })
    setIsAddingOffering(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.sponsorId || !formData.offeringId) {
      toast.error("Bitte wählen Sie einen Sponsor und ein Angebot aus")
      return
    }

    const sponsor = sponsors.find(s => s.id === formData.sponsorId)
    const offering = offerings.find(o => o.id === formData.offeringId)

    if (!sponsor || !offering) {
      toast.error("Sponsor oder Angebot nicht gefunden")
      return
    }

    if (bookingMode === 'range') {
      if (!dateRange.from || !dateRange.to) {
        toast.error("Bitte wählen Sie einen Zeitraum aus")
        return
      }

      const booking: SponsorshipBooking = {
        id: editingBooking?.id || uuidv4(),
        sponsorId: formData.sponsorId,
        offeringId: formData.offeringId,
        sponsorName: sponsor.name,
        offeringName: offering.name,
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd'),
        isActive: new Date(dateRange.from) <= new Date() && new Date(dateRange.to) >= new Date()
      }

      onSubmit(booking)
    } else {
      if (selectedDates.length === 0) {
        toast.error("Bitte wählen Sie mindestens ein Datum aus")
        return
      }

      // Sort dates chronologically
      const sortedDates = [...selectedDates].sort((a, b) => a.getTime() - b.getTime())
      
      // Create a booking for each selected date
      sortedDates.forEach((date) => {
        const formattedDate = format(date, 'yyyy-MM-dd')
        const booking: SponsorshipBooking = {
          id: uuidv4(),
          sponsorId: formData.sponsorId,
          offeringId: formData.offeringId,
          sponsorName: sponsor.name,
          offeringName: offering.name,
          startDate: formattedDate,
          endDate: formattedDate,
          isActive: date >= new Date()
        }
        onSubmit(booking)
      })
    }

    onClose()
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Sponsoring buchen</DialogTitle>
          <DialogDescription>
            Fügen Sie eine neue Sponsoring-Buchung hinzu oder bearbeiten Sie eine bestehende.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={sponsorSelectId}>Sponsor</Label>
            {isAddingSponsor ? (
              <div className="flex gap-2">
                <Input
                  value={newSponsorName}
                  onChange={(e) => setNewSponsorName(e.target.value)}
                  placeholder="Neuer Sponsorname"
                />
                <Button 
                  type="button"
                  onClick={handleAddSponsor}
                >
                  Hinzufügen
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Select value={formData.sponsorId} onValueChange={(value) => setFormData(prev => ({ ...prev, sponsorId: value }))}>
                  <SelectTrigger id={sponsorSelectId}>
                    <SelectValue placeholder="Sponsor auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {sponsors.map((sponsor, index) => (
                      <SelectItem key={`${sponsorSelectId}-${sponsor.id}-${index}`} value={sponsor.id}>
                        {sponsor.name}
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-start h-8 px-2"
                      onClick={() => setIsAddingSponsor(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Neuen Sponsor hinzufügen
                    </Button>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={offeringSelectId}>Angebot</Label>
            {isAddingOffering ? (
              <div className="space-y-2">
                <Input
                  value={newOffering.name}
                  onChange={(e) => setNewOffering(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Name"
                />
                <Input
                  value={newOffering.description}
                  onChange={(e) => setNewOffering(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Beschreibung"
                />
                <Select
                  value={newOffering.type}
                  onValueChange={(value) => setNewOffering(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Typ auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {['physical', 'digital', 'event'].map((type, index) => (
                      <SelectItem key={`offering-type-${type}-${index}`} value={type}>
                        {type === 'physical' ? 'Physisch' : type === 'digital' ? 'Digital' : 'Event'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button"
                  onClick={handleAddOffering}
                  className="w-full"
                >
                  Angebot hinzufügen
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Select value={formData.offeringId} onValueChange={(value) => setFormData(prev => ({ ...prev, offeringId: value }))}>
                  <SelectTrigger id={offeringSelectId}>
                    <SelectValue placeholder="Angebot auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {offerings.map((offering, index) => (
                      <SelectItem key={`${offeringSelectId}-${offering.id}-${index}`} value={offering.id}>
                        {offering.name}
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-start h-8 px-2"
                      onClick={() => setIsAddingOffering(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Neues Angebot hinzufügen
                    </Button>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Tabs value={bookingMode} onValueChange={(value) => setBookingMode(value as BookingMode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="range">Zeitraum</TabsTrigger>
              <TabsTrigger value="specific">Spezifische Tage</TabsTrigger>
            </TabsList>
            <TabsContent value="range" className="space-y-4">
              <div className="border rounded-md p-4">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange as any}
                  numberOfMonths={1}
                  locale={de}
                />
              </div>
            </TabsContent>
            <TabsContent value="specific" className="space-y-4">
              <div className="border rounded-md p-4">
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={setSelectedDates}
                  numberOfMonths={1}
                  locale={de}
                />
                <div className="mt-2 text-sm text-muted-foreground">
                  {selectedDates.length} Tage ausgewählt
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" className="w-full">
            Sponsoring buchen
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

