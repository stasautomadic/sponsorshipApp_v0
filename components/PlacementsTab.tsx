import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SponsorshipBooking, SponsorshipOffering, Sponsor } from '../types/sponsorship'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus } from 'lucide-react'
import { useState, useMemo } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { BookSponsorshipDialog } from './BookSponsorshipDialog'
import { toast } from "sonner"
import { useSponsorship } from '@/contexts/SponsorshipContext'

interface PlacementsTabProps {
  bookings: SponsorshipBooking[]
  offerings: SponsorshipOffering[]
  sponsors: Sponsor[]
}

type ViewMode = 'products' | 'sponsors'
type StatusFilter = 'all' | 'active' | 'inactive'

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

export function PlacementsTab({ 
  bookings = [], 
  offerings = [], 
  sponsors = [], 
}: PlacementsTabProps) {
  const { addBooking, addOffering, addSponsor } = useSponsorship()
  const [viewMode, setViewMode] = useState<ViewMode>('products')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getBookingsForOffering = (offeringId: string) => {
    return bookings.filter(b => b.offeringId === offeringId)
  }

  const getBookingsForSponsor = (sponsorId: string) => {
    return bookings.filter(b => b.sponsorId === sponsorId)
  }

  const getActiveBookingsForSponsor = (sponsorId: string) => {
    return bookings.filter(b => b.sponsorId === sponsorId && b.isActive)
  }

  const filteredOfferings = useMemo(() => {
    return offerings ? offerings.filter(offering => 
      offering.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offering.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];
  }, [offerings, searchQuery])

  const filteredSponsors = useMemo(() => {
    return sponsors ? sponsors.filter(sponsor => {
      if (!sponsor || typeof sponsor !== 'object') return false;
      const searchLower = searchQuery.toLowerCase();
      return (
        ((sponsor.name && typeof sponsor.name === 'string') ? sponsor.name.toLowerCase() : '').includes(searchLower) ||
        ((sponsor.category && typeof sponsor.category === 'string') ? sponsor.category.toLowerCase() : '').includes(searchLower) ||
        ((sponsor.accountManager && typeof sponsor.accountManager === 'string') ? sponsor.accountManager.toLowerCase() : '').includes(searchLower) ||
        ((sponsor.contact && sponsor.contact.name && typeof sponsor.contact.name === 'string') ? sponsor.contact.name.toLowerCase() : '').includes(searchLower)
      );
    }) : [];
  }, [sponsors, searchQuery]);

  const handleAddBooking = (booking: SponsorshipBooking) => {
    addBooking({
      ...booking,
      id: Date.now().toString(),
      isActive: new Date(booking.startDate) <= new Date() && new Date(booking.endDate) >= new Date()
    })
    toast.success('Sponsoring erfolgreich gebucht', {
      description: `${booking.sponsorName} für ${booking.offeringName}`,
    })
  }

  const handleAddSponsor = (sponsor: Sponsor) => {
    if (!sponsor.name || typeof sponsor.name !== 'string') {
      toast.error('Sponsor name is required and must be a string');
      return;
    }
    addSponsor({
      ...sponsor,
      id: Date.now().toString()
    })
    toast.success('Sponsor erfolgreich hinzugefügt', {
      description: sponsor.name,
    })
  }

  const handleAddOffering = (offering: SponsorshipOffering) => {
    addOffering({
      ...offering,
      id: Date.now().toString()
    })
    toast.success('Angebot erfolgreich hinzugefügt', {
      description: offering.name,
    })
  }

  const renderProductsView = () => (
    <div className="space-y-6">
      {filteredOfferings && filteredOfferings.length > 0 ? (
        filteredOfferings.map((offering) => {
          const allBookings = getBookingsForOffering(offering.id)
          const activeBookings = allBookings.filter(b => b.isActive)
          
          return (
            <Card key={offering.id} className="bg-white">
              <CardHeader>
                <div className="space-y-2">
                  <CardTitle>{offering.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{offering.description}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline">
                      Total: {allBookings.length}
                    </Badge>
                    <Badge variant="default">
                      Active: {activeBookings.length}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allBookings.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sponsor</TableHead>
                          <TableHead>Date Range</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src="/logo-placeholder-image.png" alt={booking.sponsorName} />
                                  <AvatarFallback>{booking.sponsorName[0]}</AvatarFallback>
                                </Avatar>
                                <span>{booking.sponsorName}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={booking.isActive ? "default" : "secondary"}
                                className={booking.isActive ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                              >
                                {booking.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No sponsors assigned yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })
      ) : (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            No products found
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderSponsorsView = () => (
    <div className="space-y-6">
      {filteredSponsors && filteredSponsors.length > 0 ? (
        filteredSponsors.map((sponsor) => {
          if (!sponsor || typeof sponsor !== 'object' || !sponsor.name || typeof sponsor.name !== 'string') return null;
          const allBookings = getBookingsForSponsor(sponsor.id)
          const activeBookings = getActiveBookingsForSponsor(sponsor.id)
          
          return (
            <Card key={sponsor.id} className="bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={sponsor.logo || ''} alt={sponsor.name} />
                    <AvatarFallback>{sponsor.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <CardTitle>{sponsor.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{sponsor.category || 'Uncategorized'} Sponsor</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">

                  <div className="flex gap-2">
                    <Badge variant="outline">
                      Total Products: {allBookings.length}
                    </Badge>
                    <Badge variant="default">
                      Active: {activeBookings.length}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Products:</h4>
                    {allBookings.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Date Range</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allBookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">
                                {booking.offeringName}
                              </TableCell>
                              <TableCell>
                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={booking.isActive ? "default" : "secondary"}
                                  className={booking.isActive ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                                >
                                  {booking.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No products assigned yet
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })
      ) : (
        <Card>
          <CardContent className="py-6 text-center text-muted-foreground">
            No sponsors found
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="inline-flex rounded-lg p-1 bg-white shadow-sm">
          <Button
            variant={viewMode === 'products' ? 'default' : 'ghost'}
            className="rounded-lg px-8"
            onClick={() => setViewMode('products')}
          >
            Products
          </Button>
          <Button
            variant={viewMode === 'sponsors' ? 'default' : 'ghost'}
            className="rounded-lg px-8"
            onClick={() => setViewMode('sponsors')}
          >
            Sponsors
          </Button>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Sponsorship
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${viewMode === 'products' ? 'products' : 'sponsors'}...`}
            className="pl-9 max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {/* Removed Category Filter Select */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={dateRange.from ? "font-normal" : ""}>
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd.MM.yyyy")} -{" "}
                    {format(dateRange.to, "dd.MM.yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "dd.MM.yyyy")
                )
              ) : (
                "Date Range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              selected={{ 
                from: dateRange.from,
                to: dateRange.to
              }}
              onSelect={(range) => setDateRange({ 
                from: range?.from,
                to: range?.to
              })}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {viewMode === 'products' ? renderProductsView() : renderSponsorsView()}

      <BookSponsorshipDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddBooking}
        editingBooking={null}
      />
    </div>
  )
}

