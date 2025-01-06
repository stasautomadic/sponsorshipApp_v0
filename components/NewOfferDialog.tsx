"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectSeparator } from "@/components/ui/select"
import { SponsorshipOffering, SponsorshipVariant } from '../types/sponsorship'
import { toast } from "sonner"
import { Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"

interface NewOfferDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddOffer: (offer: SponsorshipOffering) => void
  categories: string[]
  onAddCategory: (category: string) => void
}

export function NewOfferDialog({ 
  isOpen, 
  onClose, 
  onAddOffer, 
  categories = [], 
  onAddCategory 
}: NewOfferDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    category: '',
  })

  const [variants, setVariants] = useState<SponsorshipVariant[]>([])
  const [activeVariant, setActiveVariant] = useState(0)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [showVariants, setShowVariants] = useState(false)

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error("Please enter a category name")
      return
    }
    onAddCategory(newCategory.trim())
    setFormData(prev => ({ ...prev, category: newCategory.trim() }))
    setNewCategory('')
    setIsAddingCategory(false)
    toast.success("Category added successfully")
  }

  const updateVariant = (id: string, data: Partial<SponsorshipVariant>) => {
    setVariants(prev => prev.map(variant =>
      variant.id === id ? { ...variant, ...data } : variant
    ))
  }

  const addVariant = () => {
    if (!showVariants) {
      setShowVariants(true)
    }
    const newVariant = {
      id: (variants.length + 1).toString(),
      name: '',
      description: '',
      isAvailable: true
    }
    setVariants(prev => [...prev, newVariant])
    setActiveVariant(variants.length)
  }

  const deleteVariant = (id: string) => {
    setVariants(prev => {
      const newVariants = prev.filter(v => v.id !== id)
      if (newVariants.length === 0) {
        setShowVariants(false)
      } else if (activeVariant >= newVariants.length) {
        setActiveVariant(newVariants.length - 1)
      }
      return newVariants
    })
    toast.success("Variant deleted")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("Please enter a name")
      return
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a description")
      return
    }

    if (!formData.type) {
      toast.error("Please select a type")
      return
    }

    if (!formData.category) {
      toast.error("Please select a category")
      return
    }

    const newOffer: SponsorshipOffering = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      type: formData.type as 'digital' | 'physical' | 'event',
      category: formData.category,
      variants,
      totalQuantity: variants.length
    }

    onAddOffer(newOffer)
    toast.success("Offer added successfully")
    
    setFormData({ 
      name: '', 
      description: '', 
      type: '', 
      category: '',
    })
    setVariants([])
    setActiveVariant(0)
    setShowVariants(false)
    onClose()
  }

  const navigateVariant = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && activeVariant > 0) {
      setActiveVariant(prev => prev - 1)
    } else if (direction === 'next' && activeVariant < variants.length - 1) {
      setActiveVariant(prev => prev + 1)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Sponsorship Offer</DialogTitle>
          <DialogDescription>
            Create a new sponsorship offer with name, description, and type.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. LED Banner, Jersey Front"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the offer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="digital">Digital</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
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
                          placeholder="New category"
                          className="h-8"
                        />
                        <Button 
                          type="button" 
                          size="sm"
                          onClick={handleAddCategory}
                        >
                          Add
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
                        New Category
                      </Button>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Level 1: High-level variant decision */}
          <Card className="border-dashed">
            <CardContent className="p-6">
              {!showVariants ? (
                <div className="text-center space-y-4">
                  <h3 className="font-medium text-sm">Would you like to create different variants of this offer?</h3>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowVariants(true)
                      if (variants.length === 0) {
                        addVariant()
                      }
                    }}
                    className="w-full max-w-sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variants
                  </Button>
                </div>
              ) : (
                <>
                  {/* Level 2: Variant Management */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">Variants</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowVariants(false)
                            setVariants([])
                            setActiveVariant(0)
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                        >
                          Remove Variants
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addVariant}
                        className="h-8"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Variant
                      </Button>
                    </div>

                    <Card className="border-muted">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              Variant {activeVariant + 1} of {variants.length}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => navigateVariant('prev')}
                                disabled={activeVariant === 0}
                                className="h-7 w-7"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => navigateVariant('next')}
                                disabled={activeVariant === variants.length - 1}
                                className="h-7 w-7"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteVariant(variants[activeVariant].id)}
                              className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                              <Label>Name</Label>
                              <Input
                                value={variants[activeVariant]?.name || ''}
                                onChange={(e) => updateVariant(variants[activeVariant].id, { name: e.target.value })}
                                placeholder={`${formData.name || 'Variant'} ${activeVariant + 1}`}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={variants[activeVariant]?.description || ''}
                                onChange={(e) => updateVariant(variants[activeVariant].id, { description: e.target.value })}
                                placeholder="Additional details for this variant"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Add
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

