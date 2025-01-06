"use client"

import { useState } from 'react'
import { Sponsor } from '../types/sponsorship'
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, MoreHorizontal, Pencil, Trash, Search, ExternalLink, Tags, ArrowUpDown, Upload } from 'lucide-react'
import { toast } from "sonner"
import { AddSponsorDialog } from './AddSponsorDialog'
import { EditSponsorDialog } from './EditSponsorDialog'
import { SponsorDetail } from './sponsor/SponsorDetail'
import { CategoriesDialog } from './CategoriesDialog'
import { CsvUploadDialog } from './CsvUploadDialog'

interface SponsorsTabProps {
  sponsors: Sponsor[]
  categories: string[]
  onAddSponsor: (sponsor: Sponsor) => void
  onEditSponsor: (sponsor: Sponsor) => void
  onDeleteSponsor: (sponsorId: string) => Promise<void>
  onAddCategory: (category: string) => void
  onUpdateCategory: (oldCategory: string, newCategory: string) => void
  onDeleteCategory: (category: string) => void
}

type SortField = 'name' | 'industry' | 'category' | 'accountManager'
type SortOrder = 'asc' | 'desc'

interface SortState {
  field: SortField
  order: SortOrder
}

export function SponsorsTab({ 
  sponsors, 
  categories,
  onAddSponsor, 
  onEditSponsor, 
  onDeleteSponsor,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory
}: SponsorsTabProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddSponsorDialogOpen, setIsAddSponsorDialogOpen] = useState(false)
  const [isCategoriesDialogOpen, setIsCategoriesDialogOpen] = useState(false)
  const [isCsvUploadDialogOpen, setIsCsvUploadDialogOpen] = useState(false)
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null)
  const [sortState, setSortState] = useState<SortState>({
    field: 'name',
    order: 'asc'
  })

  const filteredSponsors = sponsors.filter(sponsor =>
    sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sponsor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sponsor.industry.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedSponsors = [...filteredSponsors].sort((a, b) => {
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

  const handleDelete = async (sponsorId: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie diesen Sponsor löschen möchten?')) {
      try {
        await onDeleteSponsor(sponsorId);
        toast.success('Sponsor successfully deleted');
      } catch (error) {
        // Error is already handled in the context with a toast
        console.error('Error deleting sponsor:', error);
      }
    }
  }

  const handleOpenSponsor = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor)
  }

  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor)
  }

  if (selectedSponsor) {
    return (
      <SponsorDetail 
        sponsor={selectedSponsor}
        onBack={() => setSelectedSponsor(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Sponsors</h2>
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
            variant="outline"
            onClick={() => setIsCsvUploadDialogOpen(true)}
            className="text-gray-600"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload List
          </Button>
          <Button 
            onClick={() => setIsAddSponsorDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Sponsor
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sponsors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 max-w-md"
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button
                variant="ghost"
                onClick={() => handleSort('name')}
                className="p-0 hover:bg-transparent"
              >
                <span>Sponsor</span>
                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortState.field === 'name' ? 'opacity-100' : 'opacity-40'}`} />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('industry')}
                className="p-0 hover:bg-transparent"
              >
                <span>Industry</span>
                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortState.field === 'industry' ? 'opacity-100' : 'opacity-40'}`} />
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
            <TableHead className="w-[200px]">
              <Button
                variant="ghost"
                onClick={() => handleSort('accountManager')}
                className="p-0 hover:bg-transparent"
              >
                <span>Account Manager</span>
                <ArrowUpDown className={`ml-2 h-4 w-4 ${sortState.field === 'accountManager' ? 'opacity-100' : 'opacity-40'}`} />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSponsors.map((sponsor) => (
            <TableRow key={sponsor.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={sponsor.logo || '/placeholder.svg'} 
                      alt={sponsor.name} 
                      className="object-contain"
                    />
                    <AvatarFallback>{sponsor.name ? sponsor.name[0] : 'S'}</AvatarFallback>
                  </Avatar>
                  <span>{sponsor.name || 'Unnamed Sponsor'}</span>
                </div>
              </TableCell>
              <TableCell>{sponsor.industry || '-'}</TableCell>
              <TableCell>{sponsor.category || 'Uncategorized'}</TableCell>
              <TableCell>{sponsor.accountManager || '-'}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenSponsor(sponsor)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleEdit(sponsor)}
                      className="cursor-pointer"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(sponsor.id)}
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

      {sortedSponsors.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          No sponsors found. Add new sponsors or adjust your search.
        </div>
      )}
      
      <AddSponsorDialog 
        isOpen={isAddSponsorDialogOpen}
        onClose={() => setIsAddSponsorDialogOpen(false)}
        onAddSponsor={onAddSponsor}
        categories={categories}
      />

      <EditSponsorDialog
        isOpen={!!editingSponsor}
        onClose={() => setEditingSponsor(null)}
        onEditSponsor={onEditSponsor}
        onAddCategory={onAddCategory}
        sponsor={editingSponsor}
        categories={categories}
      />

      <CategoriesDialog
        isOpen={isCategoriesDialogOpen}
        onClose={() => setIsCategoriesDialogOpen(false)}
        categories={categories}
        onAddCategory={onAddCategory}
        onUpdateCategory={onUpdateCategory}
        onDeleteCategory={onDeleteCategory}
      />
      <CsvUploadDialog 
        isOpen={isCsvUploadDialogOpen}
        onClose={() => setIsCsvUploadDialogOpen(false)}
        onUpload={(sponsors) => {
          sponsors.forEach(sponsor => onAddSponsor(sponsor))
          toast.success(`Successfully added ${sponsors.length} sponsors`)
        }}
        existingCategories={categories}
      />
    </div>
  )
}

