import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select"
import { Sponsor } from '../types/sponsorship'
import { Plus } from 'lucide-react'
import { toast } from "sonner"

interface EditSponsorDialogProps {
  isOpen: boolean
  onClose: () => void
  onEditSponsor: (sponsor: Sponsor) => void
  onAddCategory: (category: string) => void
  sponsor: Sponsor | null
  categories: string[]
}

export function EditSponsorDialog({ 
  isOpen, 
  onClose, 
  onEditSponsor,
  onAddCategory, 
  sponsor,
  categories 
}: EditSponsorDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    industry: '',
    accountManager: '',
    contactName: '',
    contactRole: '',
    contactEmail: '',
    category: ''
  })

  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  useEffect(() => {
    if (sponsor) {
      setFormData({
        name: sponsor.name || '',
        logo: sponsor.logo || '',  // Make sure we're setting the logo URL
        industry: sponsor.industry || '',
        accountManager: sponsor.accountManager || '',
        contactName: sponsor.contact?.name || '',
        contactRole: sponsor.contact?.role || '',
        contactEmail: sponsor.contact?.email || '',
        category: sponsor.category || ''
      })
    }
  }, [sponsor])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!sponsor) return

    // Validate form data
    if (!formData.name.trim()) {
      toast.error("Please enter a company name")
      return
    }

    if (!formData.category) {
      toast.error("Please select a category")
      return
    }

    try {
      // Submit the edited sponsor
      await onEditSponsor({
        ...sponsor,
        name: formData.name,
        logo: formData.logo,  // Make sure we're including the logo URL
        industry: formData.industry,
        accountManager: formData.accountManager,
        contact: {
          name: formData.contactName,
          role: formData.contactRole,
          email: formData.contactEmail
        },
        category: formData.category
      })
      
      onClose()
    } catch (error) {
      // Error handling is done in the context
      console.error('Error submitting form:', error)
    }
  }

  if (!sponsor) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Sponsor bearbeiten</DialogTitle>
          <DialogDescription>
            Ändern Sie die Details des ausgewählten Sponsors.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Firmenname</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="z.B. Acme Corp"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              value={formData.logo}
              onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry">Branche</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              placeholder="z.B. Retail, IT, Transport"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountManager">Account Manager</Label>
            <Input
              id="accountManager"
              value={formData.accountManager}
              onChange={(e) => setFormData(prev => ({ ...prev, accountManager: e.target.value }))}
              placeholder="Name des Account Managers"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactName">Kontaktperson Name</Label>
            <Input
              id="contactName"
              value={formData.contactName}
              onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
              placeholder="Name der Kontaktperson"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactRole">Kontaktperson Rolle</Label>
            <Input
              id="contactRole"
              value={formData.contactRole}
              onChange={(e) => setFormData(prev => ({ ...prev, contactRole: e.target.value }))}
              placeholder="z.B. Marketing Manager"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail">Kontaktperson E-Mail</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              placeholder="kontakt@example.com"
            />
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

          <Button type="submit" className="w-full">
            Speichern
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

