import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectSeparator
} from "@/components/ui/select"
import { Sponsor, SponsorshipOffering, SponsorshipAssignment } from './SponsorshipDashboard'
import { Badge } from "@/components/ui/badge"
import { Plus } from 'lucide-react'

interface SponsorAssignmentProps {
  sponsors: Sponsor[]
  offerings: SponsorshipOffering[]
  assignments: SponsorshipAssignment[]
  addSponsor: (sponsor: Sponsor) => void
  addOffering: (offering: SponsorshipOffering) => void
  addAssignment: (assignment: SponsorshipAssignment) => void
}

export function SponsorAssignment({ 
  sponsors, 
  offerings, 
  assignments, 
  addSponsor, 
  addOffering,
  addAssignment 
}: SponsorAssignmentProps) {
  const [selectedSponsor, setSelectedSponsor] = useState('')
  const [selectedOffering, setSelectedOffering] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  const [newSponsorName, setNewSponsorName] = useState('')
  const [isAddingSponsor, setIsAddingSponsor] = useState(false)
  
  const [isAddingOffering, setIsAddingOffering] = useState(false)
  const [newOffering, setNewOffering] = useState({
    name: '',
    description: '',
    type: ''
  })

  const handleAddSponsor = () => {
    if (newSponsorName) {
      const newSponsor = {
        id: Date.now().toString(),
        name: newSponsorName
      }
      addSponsor(newSponsor)
      setSelectedSponsor(newSponsor.id)
      setNewSponsorName('')
      setIsAddingSponsor(false)
    }
  }

  const handleAddOffering = () => {
    if (newOffering.name && newOffering.description && newOffering.type) {
      const offering = {
        id: Date.now().toString(),
        ...newOffering
      }
      addOffering(offering)
      setSelectedOffering(offering.id)
      setNewOffering({ name: '', description: '', type: '' })
      setIsAddingOffering(false)
    }
  }

  const handleAssignSponsorship = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedSponsor && selectedOffering && startDate && endDate) {
      addAssignment({
        id: Date.now().toString(),
        sponsorId: selectedSponsor,
        offeringId: selectedOffering,
        startDate,
        endDate,
        isActive: new Date(startDate) <= new Date() && new Date(endDate) >= new Date()
      })
      setSelectedSponsor('')
      setSelectedOffering('')
      setStartDate('')
      setEndDate('')
    }
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Sponsoring buchen</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssignSponsorship} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sponsor">Sponsor</Label>
                <Select value={selectedSponsor} onValueChange={setSelectedSponsor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sponsor auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {sponsors.map((sponsor) => (
                      <SelectItem key={sponsor.id} value={sponsor.id}>
                        {sponsor.name}
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    {isAddingSponsor ? (
                      <div className="flex items-center gap-2 p-2">
                        <Input
                          value={newSponsorName}
                          onChange={(e) => setNewSponsorName(e.target.value)}
                          placeholder="Neuer Sponsorname"
                          className="h-8"
                        />
                        <Button 
                          type="button" 
                          size="sm"
                          onClick={handleAddSponsor}
                        >
                          Hinzufügen
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start h-8 px-2"
                        onClick={() => setIsAddingSponsor(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Neuen Sponsor hinzufügen
                      </Button>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="offering">Angebot</Label>
                <Select value={selectedOffering} onValueChange={setSelectedOffering}>
                  <SelectTrigger>
                    <SelectValue placeholder="Angebot auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {offerings.map((offering) => (
                      <SelectItem key={offering.id} value={offering.id}>
                        {offering.name}
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    {isAddingOffering ? (
                      <div className="p-2 space-y-2">
                        <Input
                          value={newOffering.name}
                          onChange={(e) => setNewOffering({ ...newOffering, name: e.target.value })}
                          placeholder="Name"
                          className="h-8"
                        />
                        <Input
                          value={newOffering.description}
                          onChange={(e) => setNewOffering({ ...newOffering, description: e.target.value })}
                          placeholder="Beschreibung"
                          className="h-8"
                        />
                        <Select
                          value={newOffering.type}
                          onValueChange={(value) => setNewOffering({ ...newOffering, type: value })}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Typ auswählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="physical">Physisch</SelectItem>
                            <SelectItem value="digital">Digital</SelectItem>
                            <SelectItem value="event">Event</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          size="sm"
                          className="w-full"
                          onClick={handleAddOffering}
                        >
                          Angebot hinzufügen
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start h-8 px-2"
                        onClick={() => setIsAddingOffering(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Neues Angebot hinzufügen
                      </Button>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Startdatum</Label>
                <Input 
                  type="date" 
                  id="startDate" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Enddatum</Label>
                <Input 
                  type="date" 
                  id="endDate" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Sponsoring buchen</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Aktuelle Sponsoring Buchungen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {assignments.map((assignment) => {
                const sponsor = sponsors.find(s => s.id === assignment.sponsorId)
                const offering = offerings.find(o => o.id === assignment.offeringId)
                return (
                  <div 
                    key={assignment.id} 
                    className="flex items-start justify-between p-4 border rounded hover:bg-accent/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <h3 className="font-semibold">{sponsor?.name} - {offering?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(assignment.startDate).toLocaleDateString()} - 
                        {new Date(assignment.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={assignment.isActive ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {assignment.isActive ? "Aktiv" : "Inaktiv"}
                    </Badge>
                  </div>
                )
              })}
              {assignments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Noch keine Sponsoring Buchungen vorhanden. Erstellen Sie Ihre erste Buchung mit dem Formular.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

