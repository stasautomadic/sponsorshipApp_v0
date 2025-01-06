"use client"

import { useState } from "react"
import { MediaList } from "@/components/media/MediaList"
import { Button } from "@/components/ui/button"
import { MediaItem } from "@/types/media"
import { toast } from "sonner"
import { useSponsorship } from "@/contexts/SponsorshipContext"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, Plus } from 'lucide-react'
import { AddMediaDialog } from "@/components/AddMediaDialog"

const SAMPLE_ITEMS: MediaItem[] = [
  {
    id: "1",
    title: "Aufstellung (v2)",
    createdAt: "2024-12-08",
    author: "John Doe-Test"
  },
  {
    id: "2",
    title: "Aufstellung (v2)",
    createdAt: "2024-12-08",
    author: "John Doe-Test"
  },
  {
    id: "3",
    title: "Begrüssung & Nächstes Spiel",
    createdAt: "2024-12-03",
    author: "John Doe-Test"
  },
  {
    id: "4",
    title: "Begrüssung & Nächstes Spiel",
    createdAt: "2024-12-03",
    author: "John Doe-Test"
  },
  {
    id: "5",
    title: "Endstand (IG Reel/Story)",
    createdAt: "2024-11-21",
    author: "John Doe-Test"
  }
]

type ActiveTab = 'library' | 'ext-media' | 'playlists'
type SortOrder = 'asc' | 'desc'

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('library')
  const [items] = useState<MediaItem[]>(SAMPLE_ITEMS)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [isAddMediaDialogOpen, setIsAddMediaDialogOpen] = useState(false)
  const { sponsors, addFileToSponsor } = useSponsorship()

  // Collect all files from all sponsors
  const sponsorFiles = sponsors.reduce((acc, sponsor) => {
    const files = sponsor.files || []
    return [...acc, ...files.map(file => ({
      ...file,
      sponsorName: sponsor.name
    }))]
  }, [] as Array<any>)

  // Sort sponsor files
  const sortedSponsorFiles = [...sponsorFiles].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.sponsorName.localeCompare(b.sponsorName)
    }
    return b.sponsorName.localeCompare(a.sponsorName)
  })

  const toggleSort = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc')
  }

  const handlePreview = (item: MediaItem) => {
    toast.info(`Previewing ${item.title}`)
  }

  const handleDownload = (item: MediaItem) => {
    toast.success(`Downloading ${item.title}`)
  }

  const handleDelete = (item: MediaItem) => {
    toast.error(`Deleting ${item.title}`)
  }

  const handleAddMedia = async (file: File, sponsorId: string) => {
    const sponsor = sponsors.find(s => s.id === sponsorId)
    if (!sponsor) return

    // Create a URL for the file
    const url = URL.createObjectURL(file)

    // Create new file object
    const newFile = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      url,
      uploadDate: new Date()
    }

    // Add the file using the context function
    addFileToSponsor(sponsorId, newFile)
    toast.success("File uploaded successfully")
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-sm mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center px-4">
            <nav className="flex">
              <Button 
                variant="ghost" 
                className={`text-sm font-medium px-3 py-2 ${
                  activeTab === 'library' 
                    ? 'text-blue-600 border-b-2 border-blue-600 rounded-none' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('library')}
              >
                Library
              </Button>
              <Button 
                variant="ghost" 
                className={`text-sm font-medium px-3 py-2 ${
                  activeTab === 'ext-media' 
                    ? 'text-blue-600 border-b-2 border-blue-600 rounded-none' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('ext-media')}
              >
                Ext Media
              </Button>
              <Button 
                variant="ghost" 
                className={`text-sm font-medium px-3 py-2 ${
                  activeTab === 'playlists' 
                    ? 'text-blue-600 border-b-2 border-blue-600 rounded-none' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('playlists')}
              >
                Playlists
              </Button>
            </nav>
            {activeTab === 'ext-media' && (
              <Button 
                onClick={() => setIsAddMediaDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Media
              </Button>
            )}
          </div>
        </div>
      </div>

      {activeTab === 'library' && (
        <MediaList
          items={items}
          onPreview={handlePreview}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      )}

      {activeTab === 'ext-media' && (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <Button
                    variant="ghost"
                    onClick={toggleSort}
                    className="p-0 hover:bg-transparent"
                  >
                    <span>Company</span>
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Added Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSponsorFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.sponsorName}</TableCell>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{new Date(file.uploadDate).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(file.url)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(file.url)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {sortedSponsorFiles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No external media files available from sponsors
            </div>
          )}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="text-center py-8 text-muted-foreground">
          Playlists feature coming soon
        </div>
      )}

      <AddMediaDialog 
        isOpen={isAddMediaDialogOpen}
        onClose={() => setIsAddMediaDialogOpen(false)}
        sponsors={sponsors}
        onAddMedia={handleAddMedia}
      />
    </div>
  )
}

