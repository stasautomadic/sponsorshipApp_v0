import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select"
import { SponsorshipOffering } from '../types/sponsorship'
import { toast } from "sonner"
import {SponsorshipProvider} from "@/components/providers/sponsorship-provider"
import { Plus } from 'lucide-react'

interface EditOfferDialogProps {
  isOpen: boolean
  onClose: () => void
  onEditOffer: (offer: SponsorshipOffering) => void
  offering: SponsorshipOffering | null
  categories: string[]
  onAddCategory: (category: string) => void
}

export function EditOfferDialog({ isOpen, onClose, onEditOffer, offering, categories, onAddCategory }: EditOfferDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    category: ''
  })

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    if (offering) {
      setFormData({
        name: offering.name,
        description: offering.description,
        type: offering.type,
        category: offering.category
      })
    }
  }, [offering])

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Bitte geben Sie einen Kategorienamen ein")
      return
    }
    onAddCategory(newCategory.trim())
    setFormData(prev => ({ ...prev, category: newCategory.trim() }))
    setNewCategory('')
    setIsAddingCategory(false)
    toast.success("Kategorie erfolgreich hinzugefügt")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!offering) return

    // Validate form data
    if (!formData.name.trim()) {
      toast.error("Bitte geben Sie einen Namen ein")
      return
    }

    if (!formData.description.trim()) {
      toast.error("Bitte geben Sie eine Beschreibung ein")
      return
    }

    if (!formData.type) {
      toast.error("Bitte wählen Sie einen Typ aus")
      return
    }

    if (!formData.category) {
      toast.error("Bitte wählen Sie eine Kategorie aus")
      return
    }

    // Submit the edited offer
    onEditOffer({
      ...offering,
      name: formData.name,
      description: formData.description,
      type: formData.type as 'digital' | 'physical' | 'event',
      category: formData.category
    })
    
    // Show success message
    toast.success("Angebot erfolgreich bearbeitet")
    
    // Close dialog
    onClose()
  }

  if (!offering) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sponsoring-Angebot bearbeiten</DialogTitle>
          <DialogDescription>
            Ändern Sie die Details des ausgewählten Sponsoring-Angebots.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="z.B. LED-Banner, Trikot-Vorderseite"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Beschreibung</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Kurze Beschreibung des Angebots"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Typ</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Typ auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physisch</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategorie</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectSeparator />
                  {isAddingCategory ? (
                    <div className="flex items-center gap-2 p-2">
                      <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Neue Kategorie"
                        className="h-8"
                      />
                      <Button 
                        type="button" 
                        size="sm"
                        onClick={handleAddCategory}
                      >
                        Hinzufügen
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-start h-8 px-2"
                      onClick={() => setIsAddingCategory(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Neue Kategorie
                    </Button>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Speichern
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

