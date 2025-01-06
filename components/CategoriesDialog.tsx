import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Pencil, Check } from 'lucide-react'
import { toast } from "sonner"

interface CategoriesDialogProps {
  isOpen: boolean
  onClose: () => void
  categories: string[]
  onAddCategory: (category: string) => void
  onUpdateCategory: (oldCategory: string, newCategory: string) => void
  onDeleteCategory: (category: string) => void
}

export function CategoriesDialog({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}: CategoriesDialogProps) {
  const [newCategory, setNewCategory] = useState('')
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editedCategoryName, setEditedCategoryName] = useState('')

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim())
      setNewCategory('')
      toast.success('Kategorie erfolgreich hinzugefügt')
    }
  }

  const handleEditCategory = (category: string) => {
    setEditingCategory(category)
    setEditedCategoryName(category)
  }

  const handleUpdateCategory = () => {
    if (editingCategory && editedCategoryName.trim() && editedCategoryName !== editingCategory) {
      onUpdateCategory(editingCategory, editedCategoryName.trim())
      setEditingCategory(null)
      toast.success('Kategorie erfolgreich aktualisiert')
    } else {
      setEditingCategory(null)
    }
  }

  const handleDeleteCategory = (category: string) => {
    if (window.confirm(`Sind Sie sicher, dass Sie die Kategorie "${category}" löschen möchten?`)) {
      onDeleteCategory(category)
      toast.success('Kategorie erfolgreich gelöscht')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Kategorien verwalten</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Neue Kategorie</h3>
            <div className="flex space-x-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Kategoriename eingeben"
                className="flex-1"
              />
              <Button onClick={handleAddCategory} className="bg-black text-white hover:bg-gray-800">
                Hinzufügen
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Bestehende Kategorien</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {editingCategory === category ? (
                    <Input
                      value={editedCategoryName}
                      onChange={(e) => setEditedCategoryName(e.target.value)}
                      className="flex-1 mr-2"
                    />
                  ) : (
                    <span className="font-medium">{category}</span>
                  )}
                  <div className="flex space-x-2">
                    {editingCategory === category ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleUpdateCategory}
                        className="h-8 w-8 hover:bg-gray-200"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditCategory(category)}
                        className="h-8 w-8 hover:bg-gray-200"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCategory(category)}
                      className="h-8 w-8 hover:bg-gray-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

