"use client"

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Trash, Search, Tags, ArrowUpDown } from 'lucide-react'
import { SponsorshipOffering } from '../types/sponsorship'
import { NewOfferDialog } from './NewOfferDialog'
import { EditOfferDialog } from './EditOfferDialog'
import { CategoriesDialog } from './CategoriesDialog'
import { toast } from "sonner"
import { useSponsorship } from '@/contexts/SponsorshipContext'

interface ProductsTabProps {
  offerings: SponsorshipOffering[]
  onAddOffer: (offer: SponsorshipOffering) => void
  onDeleteOffer: (offerId: string) => void
  onEditOffer: (offer: SponsorshipOffering) => void
}

type SortField = 'name' | 'type' | 'category'
type SortOrder = 'asc' | 'desc'

interface SortState {
  field: SortField
  order: SortOrder
}

export function ProductsTab({ 
  offerings, 
  onAddOffer, 
  onDeleteOffer,
  onEditOffer,
}: ProductsTabProps) {
  const [isNewOfferDialogOpen, setIsNewOfferDialogOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState<SponsorshipOffering | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCategoriesDialogOpen, setIsCategoriesDialogOpen] = useState(false)
  const [sortState, setSortState] = useState<SortState>({
    field: 'name',
    order: 'asc'
  })

  const { addCategory, categories, updateCategory, deleteCategory } = useSponsorship()

  const filteredOfferings = offerings.filter(offering => {
    const matchesSearch = 
      offering.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offering.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offering.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  const sortedOfferings = [...filteredOfferings].sort((a, b) => {
    const aValue = (a[sortState.field] || '').toLowerCase()
    const bValue = (b[sortState.field] || '').toLowerCase()
    
    if (sortState.order === 'asc') {
      return aValue.localeCompare(bValue)
    } else {
      return bValue.localeCompare(aValue)
    }
  })

  const handleSort = (field: SortField) => {
    setSortState(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleDelete = (offerId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Angebot löschen möchten?')) {
      onDeleteOffer(offerId)
      toast.success('Angebot erfolgreich gelöscht')
    }
  }

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => setIsCategoriesDialogOpen(true)}
            className="text-gray-600"
          >
            <Tags className="mr-2 h-4 w-4" />
            Categories
          </Button>
          <Button 
            onClick={() => setIsNewOfferDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Offer
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 max-w-md"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <Button
                variant="ghost"
                onClick={() => handleSort('name')}
                className="p-0 hover:bg-transparent"
              >
                <span>Product</span>
                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortState.field === 'name' ? 'opacity-100' : 'opacity-40'}`} />
              </Button>
            </TableHead>
            <TableHead className="w-[200px]">
              <Button
                variant="ghost"
                onClick={() => handleSort('type')}
                className="p-0 hover:bg-transparent"
              >
                <span>Type</span>
                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortState.field === 'type' ? 'opacity-100' : 'opacity-40'}`} />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('category')}
                className="p-0 hover:bg-transparent"
              >
                <span>Category</span>
                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortState.field === 'category' ? 'opacity-100' : 'opacity-40'}`} />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOfferings.map((offering) => (
            <TableRow key={offering.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{offering.name}</div>
                  <div className="text-sm text-muted-foreground">{offering.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {getTypeLabel(offering.type)}
                </Badge>
              </TableCell>
              <TableCell>{offering.category || 'Uncategorized'}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setEditingOffer(offering)}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(offering.id)}
                      className="cursor-pointer text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {sortedOfferings.length === 0 && (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            {searchQuery
              ? 'No matching products found. Adjust your search.'
              : 'No products available yet. Add your first product using the "New Offer" button.'}
          </CardContent>
        </Card>
      )}

      <NewOfferDialog 
        isOpen={isNewOfferDialogOpen}
        onClose={() => setIsNewOfferDialogOpen(false)}
        onAddOffer={onAddOffer}
        categories={categories}
        onAddCategory={addCategory}
      />

      <EditOfferDialog
        isOpen={!!editingOffer}
        onClose={() => setEditingOffer(null)}
        onEditOffer={onEditOffer}
        offering={editingOffer}
        categories={categories}
        onAddCategory={addCategory}
      />

      <CategoriesDialog
        isOpen={isCategoriesDialogOpen}
        onClose={() => setIsCategoriesDialogOpen(false)}
        categories={categories}
        onAddCategory={addCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
      />
    </div>
  )
}

