"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface AddGameDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddGame: (game: {
    date: string
    time: string
    league: string
    homeTeam: string
    awayTeam: string
    venue: string
  }) => void
}

export function AddGameDialog({ isOpen, onClose, onAddGame }: AddGameDialogProps) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    league: 'QHL',
    homeTeam: '',
    awayTeam: '',
    venue: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    if (!formData.date || !formData.time || !formData.homeTeam || !formData.awayTeam || !formData.venue) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus")
      return
    }

    // Submit the game
    onAddGame(formData)
    
    // Reset form and close dialog
    setFormData({
      date: '',
      time: '',
      league: 'QHL',
      homeTeam: '',
      awayTeam: '',
      venue: ''
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neues Spiel hinzufügen</DialogTitle>
          <DialogDescription>
            Fügen Sie die Details des neuen Spiels hinzu.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Zeit</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="league">Liga</Label>
            <Select 
              value={formData.league} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, league: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Liga auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="QHL">QHL</SelectItem>
                <SelectItem value="NLB">NLB</SelectItem>
                <SelectItem value="Cup">Cup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="homeTeam">Heimteam</Label>
            <Input
              id="homeTeam"
              value={formData.homeTeam}
              onChange={(e) => setFormData(prev => ({ ...prev, homeTeam: e.target.value }))}
              placeholder="z.B. BSV Bern"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="awayTeam">Gastteam</Label>
            <Input
              id="awayTeam"
              value={formData.awayTeam}
              onChange={(e) => setFormData(prev => ({ ...prev, awayTeam: e.target.value }))}
              placeholder="z.B. Wacker Thun"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Spielort</Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
              placeholder="z.B. Gümligen Mobiliar Arena"
            />
          </div>

          <Button type="submit" className="w-full">
            Spiel hinzufügen
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

