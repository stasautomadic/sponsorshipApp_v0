"use client"

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Upload } from 'lucide-react'
import { toast } from "sonner"

interface AddMediaDialogProps {
  isOpen: boolean
  onClose: () => void
  sponsors: Array<{ id: string; name: string }>
  onAddMedia: (file: File, sponsorId: string) => void
}

export function AddMediaDialog({ isOpen, onClose, sponsors, onAddMedia }: AddMediaDialogProps) {
  const [selectedSponsor, setSelectedSponsor] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const allowedTypes = [
    'video/mp4',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!selectedSponsor) {
      toast.error("Please select a sponsor first")
      return
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload an MP4, image, or document file"
      })
      return
    }

    // Maximum file size (100MB)
    const maxSize = 100 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error("File too large", {
        description: "Maximum file size is 100MB"
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 100)

    try {
      onAddMedia(file, selectedSponsor)
      setUploadProgress(100)
      toast.success("File uploaded successfully")
      onClose()
    } catch (error) {
      toast.error("Upload failed", {
        description: "Please try again"
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      clearInterval(interval)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setSelectedSponsor("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Media</DialogTitle>
          <DialogDescription>
            Upload a file and associate it with a sponsor.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sponsor">Sponsor</Label>
            <Select
              value={selectedSponsor}
              onValueChange={setSelectedSponsor}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a sponsor" />
              </SelectTrigger>
              <SelectContent>
                {sponsors.map((sponsor) => (
                  <SelectItem key={sponsor.id} value={sponsor.id}>
                    {sponsor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept={allowedTypes.join(',')}
            className="hidden"
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !selectedSponsor}
            className="w-full h-32 border-2 border-dashed"
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8" />
              <span>Click to select file</span>
            </div>
          </Button>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

