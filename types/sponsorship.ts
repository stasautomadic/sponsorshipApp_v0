export interface SponsorshipVariant {
  id: string
  name?: string
  description?: string
  isAvailable: boolean
}

export interface SponsorshipOffering {
  id: string
  name: string
  description: string
  type: 'digital' | 'physical' | 'event'
  category: string
  variants: SponsorshipVariant[]
  totalQuantity: number
}

export interface Address {
  street: string
  number: string
  zip: string
  city: string
  country: string
}

export interface SponsorFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadDate: Date
}

export interface Sponsor {
  id: string
  name: string
  logo: string
  industry: string
  category: string
  accountManager: string
  contact: {
    name: string
    role: string
    email: string
  }
  address: Address
  billingAddress: Address
  files?: SponsorFile[]
}

export interface SponsorshipBooking {
  id: string
  sponsorId: string
  offeringId: string
  variantId: string
  sponsorName: string
  offeringName: string
  startDate: string
  endDate: string
  isActive: boolean
}

