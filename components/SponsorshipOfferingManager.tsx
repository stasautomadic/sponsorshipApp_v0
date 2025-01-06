import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SponsorshipOffering } from './SponsorshipDashboard'
import { Badge } from "@/components/ui/badge"

interface SponsorshipOfferingManagerProps {
  offerings: SponsorshipOffering[]
  addOffering: (offering: SponsorshipOffering) => void
}

export function SponsorshipOfferingManager({ offerings, addOffering }: SponsorshipOfferingManagerProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && description && type) {
      addOffering({
        id: Date.now().toString(),
        name,
        description,
        type
      })
      setName('')
      setDescription('')
      setType('')
    }
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Neue Sponsoring-Leistung hinzufügen</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="z.B. LED-Banner, Trikot-Vorderseite"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Input 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Kurze Beschreibung des Angebots"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Typ</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Angebotstyp auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physisch</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Leistung hinzufügen</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Bestehende Sponsoring-Leistungen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {offerings.map((offering) => (
                <div 
                  key={offering.id} 
                  className="flex items-start justify-between p-4 border rounded hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold">{offering.name}</h3>
                    <p className="text-sm text-muted-foreground">{offering.description}</p>
                  </div>
                  <Badge variant="secondary" className="mt-1">
                    {offering.type === 'physical' ? 'Physisch' : 
                     offering.type === 'digital' ? 'Digital' : 'Event'}
                  </Badge>
                </div>
              ))}
              {offerings.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Noch keine Sponsoring-Leistungen vorhanden. Fügen Sie Ihre erste Leistung über das Formular hinzu.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

