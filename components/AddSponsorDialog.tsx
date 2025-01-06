"use client"

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sponsor } from '../types/sponsorship'
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface AddSponsorDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddSponsor: (sponsor: Sponsor, logoFile?: File) => void
  categories: string[]
}

export function AddSponsorDialog({ isOpen, onClose, onAddSponsor, categories }: AddSponsorDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    industry: '',
    accountManager: '',
    contactName: '',
    contactRole: '',
    contactEmail: '',
    category: '',
    // Business Address
    street: '',
    number: '',
    zip: '',
    city: '',
    country: '',
    // Billing Address
    billingStreet: '',
    billingNumber: '',
    billingZip: '',
    billingCity: '',
    billingCountry: '',
    useSameAddress: true
  })


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.name.trim()) {
        toast.error("Please enter a company name");
        return;
      }

      if (!formData.category) {
        toast.error("Please select a category");
        return;
      }

      const newSponsor: Sponsor = {
        id: Date.now().toString(),
        name: formData.name,
        logo: formData.logo || '/placeholder.svg',
        industry: formData.industry,
        accountManager: formData.accountManager,
        contact: {
          name: formData.contactName,
          role: formData.contactRole,
          email: formData.contactEmail
        },
        category: formData.category,
        address: {
          street: formData.street,
          number: formData.number,
          zip: formData.zip,
          city: formData.city,
          country: formData.country
        },
        billingAddress: formData.useSameAddress ? undefined : {
          street: formData.billingStreet,
          number: formData.billingNumber,
          zip: formData.billingZip,
          city: formData.billingCity,
          country: formData.billingCountry
        }
      };

      await onAddSponsor(newSponsor);
      
      setFormData({
        name: '',
        logo: '',
        industry: '',
        accountManager: '',
        contactName: '',
        contactRole: '',
        contactEmail: '',
        category: '',
        street: '',
        number: '',
        zip: '',
        city: '',
        country: '',
        billingStreet: '',
        billingNumber: '',
        billingZip: '',
        billingCity: '',
        billingCountry: '',
        useSameAddress: true
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof Error) {
        toast.error(`Failed to add sponsor: ${error.message}`);
      } else {
        toast.error('An unexpected error occurred while adding the sponsor');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Sponsor</DialogTitle>
          <DialogDescription>
            Add the details of the new sponsor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="address">Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Acme Corp"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={formData.logo}
                  onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="z.B. Retail, IT, Transport"
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
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="address" className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-4">Geschäftsadresse</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Strasse</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Nummer</Label>
                    <Input
                      id="number"
                      value={formData.number}
                      onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">PLZ</Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => setFormData(prev => ({ ...prev, zip: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ort</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="country">Land</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="useSameAddress"
                    checked={formData.useSameAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, useSameAddress: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="useSameAddress">
                    Rechnungsadresse entspricht Geschäftsadresse
                  </Label>
                </div>

                {!formData.useSameAddress && (
                  <div>
                    <h3 className="text-sm font-medium mb-4">Rechnungsadresse</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingStreet">Strasse</Label>
                        <Input
                          id="billingStreet"
                          value={formData.billingStreet}
                          onChange={(e) => setFormData(prev => ({ ...prev, billingStreet: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingNumber">Nummer</Label>
                        <Input
                          id="billingNumber"
                          value={formData.billingNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, billingNumber: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingZip">PLZ</Label>
                        <Input
                          id="billingZip"
                          value={formData.billingZip}
                          onChange={(e) => setFormData(prev => ({ ...prev, billingZip: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="billingCity">Ort</Label>
                        <Input
                          id="billingCity"
                          value={formData.billingCity}
                          onChange={(e) => setFormData(prev => ({ ...prev, billingCity: e.target.value }))}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="billingCountry">Land</Label>
                        <Input
                          id="billingCountry"
                          value={formData.billingCountry}
                          onChange={(e) => setFormData(prev => ({ ...prev, billingCountry: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button type="submit" className="w-full">
              Add Sponsor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

