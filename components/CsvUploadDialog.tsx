"use client"

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, AlertCircle, CheckCircle2, FileDown, TableIcon } from 'lucide-react'
import { toast } from "sonner"
import { Sponsor } from '@/types/sponsorship'
import Papa from 'papaparse'
import { v4 as uuidv4 } from 'uuid'

interface CsvUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (sponsors: Sponsor[]) => void
  existingCategories: string[]
}

interface CsvRow {
  name: string
  industry: string
  category: string
  accountManager: string
  email: string
  role: string
  street: string
  number: string
  zip: string
  city: string
  country: string
}

interface ValidationError {
  row: number
  errors: string[]
}

export function CsvUploadDialog({ isOpen, onClose, onUpload, existingCategories }: CsvUploadDialogProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [previewData, setPreviewData] = useState<CsvRow[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateRow = (row: CsvRow, rowIndex: number): string[] => {
    const errors: string[] = []

    if (!row.name?.trim()) errors.push('Name is required')
    if (!row.industry?.trim()) errors.push('Industry is required')
    if (!row.category?.trim()) errors.push('Category is required')
    if (!existingCategories.includes(row.category)) {
      errors.push(`Category must be one of: ${existingCategories.join(', ')}`)
    }
    if (!row.accountManager?.trim()) errors.push('Account Manager is required')
    if (!row.email?.trim()) errors.push('Email is required')
    if (!row.role?.trim()) errors.push('Role is required')
    if (!row.street?.trim()) errors.push('Street is required')
    if (!row.number?.trim()) errors.push('Street number is required')
    if (!row.zip?.trim()) errors.push('ZIP code is required')
    if (!row.city?.trim()) errors.push('City is required')
    if (!row.country?.trim()) errors.push('Country is required')

    return errors
  }

  const processFile = async (file: File) => {
    setIsProcessing(true)
    setProgress(0)
    setValidationErrors([])
    setPreviewData([])

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as CsvRow[]
        const errors: ValidationError[] = []
        
        // Validate headers
        const requiredHeaders = ['name', 'industry', 'category', 'accountManager', 'email', 'role', 'street', 'number', 'zip', 'city', 'country']
        const missingHeaders = requiredHeaders.filter(header => !results.meta.fields?.includes(header))
        
        if (missingHeaders.length > 0) {
          toast.error(`Missing required columns: ${missingHeaders.join(', ')}`)
          setIsProcessing(false)
          return
        }

        // Validate each row
        rows.forEach((row, index) => {
          const rowErrors = validateRow(row, index)
          if (rowErrors.length > 0) {
            errors.push({ row: index + 1, errors: rowErrors })
          }
        })

        setValidationErrors(errors)
        setPreviewData(rows)
        setProgress(100)
        setIsProcessing(false)

        if (errors.length === 0) {
          const sponsors: Sponsor[] = rows.map(row => ({
            id: uuidv4(),
            name: row.name,
            industry: row.industry,
            category: row.category,
            accountManager: row.accountManager,
            logo: '/placeholder.svg',
            contact: {
              name: '',
              role: row.role,
              email: row.email
            },
            address: {
              street: row.street,
              number: row.number,
              zip: row.zip,
              city: row.city,
              country: row.country
            },
            billingAddress: undefined
          }))

          onUpload(sponsors)
          toast.success(`Successfully processed ${sponsors.length} sponsors`)
          onClose()
        }
      },
      error: (error) => {
        toast.error('Error processing file', {
          description: error.message
        })
        setIsProcessing(false)
      }
    })
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type === 'text/csv') {
      await processFile(file)
    } else {
      toast.error('Please upload a CSV file')
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await processFile(file)
    }
  }

  const downloadTemplate = () => {
    const headers = 'name,industry,category,accountManager,email,role,street,number,zip,city,country\n'
    const example = 'Acme Corp,Technology,Gold,John Smith,contact@acme.com,CEO,Main Street,123,12345,New York,USA'
    const content = headers + example

    const blob = new Blob([content], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sponsor-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Upload Sponsor List</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing your sponsor information. Download the template to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">File Requirements</h3>
              <p className="text-sm text-muted-foreground">
                CSV file with headers and comma (,) delimiter
              </p>
            </div>
            <Button variant="outline" onClick={downloadTemplate}>
              <FileDown className="mr-2 h-4 w-4" />
              Download Template
            </Button>
          </div>

          <div
            className={`
              relative rounded-lg border-2 border-dashed p-6 transition-colors
              ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2">
              <Upload className={`h-8 w-8 ${isDragging ? 'text-primary' : 'text-muted-foreground/50'}`} />
              <div className="text-center">
                <Button
                  variant="ghost"
                  disabled={isProcessing}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Click to upload
                </Button>
                {' '}or drag and drop
              </div>
              <p className="text-sm text-muted-foreground">
                CSV file up to 10MB
              </p>
            </div>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Processing file... {progress}%
              </p>
            </div>
          )}

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Found {validationErrors.length} errors in the CSV file. Please fix them and try again.
              </AlertDescription>
            </Alert>
          )}

          {previewData.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Preview</h3>
                <Badge variant={validationErrors.length > 0 ? "destructive" : "default"}>
                  {validationErrors.length > 0 ? (
                    <AlertCircle className="mr-2 h-4 w-4" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  {previewData.length} Records
                </Badge>
              </div>

              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-4">
                  {validationErrors.map(({ row, errors }) => (
                    <div key={row} className="mb-4 rounded-lg bg-destructive/10 p-4">
                      <p className="font-medium text-destructive">Row {row}:</p>
                      <ul className="mt-2 list-disc pl-4">
                        {errors.map((error, i) => (
                          <li key={i} className="text-sm text-destructive">
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {validationErrors.length === 0 && (
                    <div className="rounded-lg border">
                      <div className="grid grid-cols-4 gap-4 border-b p-3 font-medium">
                        <div>Name</div>
                        <div>Category</div>
                        <div>Industry</div>
                        <div>Account Manager</div>
                      </div>
                      <div className="divide-y">
                        {previewData.map((row, i) => (
                          <div key={i} className="grid grid-cols-4 gap-4 p-3">
                            <div>{row.name}</div>
                            <div>{row.category}</div>
                            <div>{row.industry}</div>
                            <div>{row.accountManager}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (previewData.length > 0 && validationErrors.length === 0) {
                  const sponsors: Sponsor[] = previewData.map(row => ({
                    id: uuidv4(),
                    name: row.name,
                    industry: row.industry,
                    category: row.category,
                    accountManager: row.accountManager,
                    logo: '/placeholder.svg',
                    contact: {
                      name: '',
                      role: row.role,
                      email: row.email
                    },
                    address: {
                      street: row.street,
                      number: row.number,
                      zip: row.zip,
                      city: row.city,
                      country: row.country
                    },
                    billingAddress: undefined
                  }))
                  onUpload(sponsors)
                  toast.success(`Successfully imported ${sponsors.length} sponsors`)
                  onClose()
                }
              }}
              disabled={previewData.length === 0 || validationErrors.length > 0}
            >
              Import Sponsors
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

