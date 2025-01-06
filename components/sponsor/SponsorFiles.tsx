"use client"

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, Video, ImageIcon, File, X } from 'lucide-react'
import { Sponsor } from '../../types/sponsorship'
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface SponsorFilesProps {
  sponsor: Sponsor
  files: Array<{
    id: string
    name: string
    type: string
    size: number
    url: string
    uploadDate: Date
  }>
  onAddFile: (file: SponsorFilesProps['files'][0]) => void
  onDeleteFile: (fileId: string) => void
}

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadDate: Date
}

export function SponsorFiles({ sponsor, files, onAddFile, onDeleteFile }: SponsorFilesProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

    // Simulate file upload progress
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create object URL for preview
      const url = URL.createObjectURL(file)

      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        uploadDate: new Date()
      }

      onAddFile(newFile)
      setUploadProgress(100)
      
      toast.success("File uploaded successfully")
    } catch (error) {
      toast.error("Upload failed", {
        description: "Please try again"
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      setIsDialogOpen(false)
      clearInterval(interval)
    }
  }

  const handleDelete = (fileId: string) => {
    onDeleteFile(fileId)
    toast.success("File deleted")
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('video/')) return <Video className="h-6 w-6" />
    if (type.startsWith('image/')) return <ImageIcon className="h-6 w-6" />
    return <File className="h-6 w-6" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Files & Media</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                  <DialogDescription>
                    Upload MP4, images, or documents. Maximum file size is 100MB.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    accept={allowedTypes.join(',')}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
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
          </div>
        </CardHeader>
        <CardContent>
          {files.length > 0 ? (
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(file.url)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(file.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 opacity-50" />
              <p className="mt-2">No files uploaded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

