"use client"

import { useState, useMemo } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SponsorshipBooking, SponsorshipOffering } from "../types/sponsorship"
import { format, isWithinInterval, parseISO, isSameDay } from "date-fns"
import { de } from "date-fns/locale"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { useSponsorship } from "@/contexts/SponsorshipContext"

interface CalendarTabProps {
  bookings: SponsorshipBooking[]
  offerings: SponsorshipOffering[]
}

export function CalendarTab({ bookings, offerings }: CalendarTabProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [bookingFilter, setBookingFilter] = useState<'all' | 'booked' | 'unbooked'>('all')
  const [openItems, setOpenItems] = useState<string[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>('all')
  const { gameSchedule } = useSponsorship()

  const productTypes = useMemo(() => {
    return Array.from(new Set(offerings.map(offering => offering.name)))
  }, [offerings])

  const getBookingsForDate = (date: Date, offeringId: string) => {
    return bookings.filter(booking => {
      const startDate = parseISO(booking.startDate)
      const endDate = parseISO(booking.endDate)
      return isWithinInterval(date, { start: startDate, end: endDate }) &&
        booking.offeringId === offeringId
    })
  }

  const getGamesForDate = (date: Date) => {
    return gameSchedule.filter(game => 
      isSameDay(parseISO(game.date), date)
    )
  }

  const isDateBooked = (date: Date, offeringId: string) => {
    return bookings.some(booking => {
      const startDate = parseISO(booking.startDate)
      const endDate = parseISO(booking.endDate)
      return isWithinInterval(date, { start: startDate, end: endDate }) &&
        booking.offeringId === offeringId
    })
  }

  const isGameDay = (date: Date) => {
    return gameSchedule.some(game => 
      isSameDay(parseISO(game.date), date)
    )
  }

  const isDateBookedForSelectedProduct = (date: Date) => {
    if (selectedProduct === 'all') {
      return bookings.some(booking => {
        const startDate = parseISO(booking.startDate)
        const endDate = parseISO(booking.endDate)
        return isWithinInterval(date, { start: startDate, end: endDate })
      })
    }

    return bookings.some(booking => {
      const startDate = parseISO(booking.startDate)
      const endDate = parseISO(booking.endDate)
      const offering = offerings.find(o => o.id === booking.offeringId)
      return isWithinInterval(date, { start: startDate, end: endDate }) &&
        offering?.name === selectedProduct
    })
  }

  const toggleItem = (id: string) => {
    setOpenItems(current => 
      current.includes(id) 
        ? current.filter(item => item !== id)
        : [...current, id]
    )
  }

  const filteredOfferings = useMemo(() => {
    return offerings.filter(offering => {
      const matchesSearch = offering.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesProduct = selectedProduct === 'all' || offering.name === selectedProduct
      const hasBookings = bookings.some(booking => booking.offeringId === offering.id)
      
      if (bookingFilter === 'booked') return matchesSearch && matchesProduct && hasBookings
      if (bookingFilter === 'unbooked') return matchesSearch && matchesProduct && !hasBookings
      return matchesSearch && matchesProduct
    })
  }, [offerings, searchQuery, selectedProduct, bookingFilter, bookings])

  const gamesForSelectedDate = getGamesForDate(selectedDate)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Calendar</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9 w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={bookingFilter} onValueChange={(value: 'all' | 'booked' | 'unbooked') => setBookingFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Booking Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="booked">Booked</SelectItem>
              <SelectItem value="unbooked">Available</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select product type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {productTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[auto_minmax(250px,1fr)]">
        <Card className="w-fit h-fit">
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => setSelectedDate(date || new Date())}
              locale={de}
              className="rounded-md border [&_.rdp-day_button.rdp-day_selected]:text-white w-fit"
              modifiers={{
                booked: (date) => isDateBookedForSelectedProduct(date),
                gameDay: (date) => isGameDay(date),
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                },
                gameDay: {
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  fontWeight: 'bold',
                },
              }}
            />
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h3 className="text-base font-medium mb-2">
            {format(selectedDate, 'dd. MMMM yyyy', { locale: de })}
          </h3>

          {gamesForSelectedDate.length > 0 && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Games on this day:</h4>
                {gamesForSelectedDate.map((game) => (
                  <div key={game.id} className="p-3 bg-blue-50 rounded-lg mb-2 last:mb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{game.homeTeam} vs {game.awayTeam}</p>
                        <p className="text-sm text-muted-foreground">{game.time} • {game.venue}</p>
                      </div>
                      <Badge variant="secondary">{game.league}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            {filteredOfferings.map((offering) => {
              const dateBookings = getBookingsForDate(selectedDate, offering.id)
              const isBooked = isDateBooked(selectedDate, offering.id)
              const isOpen = openItems.includes(offering.id)

              return (
                <Card
                  key={offering.id}
                  className={`${!isBooked ? 'opacity-50' : ''}`}
                >
                  <Collapsible open={isOpen} onOpenChange={() => toggleItem(offering.id)}>
                    <CollapsibleTrigger className="w-full">
                      <CardContent className="p-3 flex items-center justify-between hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-4">
                          {isBooked && (
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                          )}
                          <h4 className="font-medium">{offering.name}</h4>
                          {dateBookings.length > 0 && (
                            <span className="text-sm text-muted-foreground">
                              {dateBookings.length} Booking{dateBookings.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0 pb-3 px-3">
                        {dateBookings.map((booking) => (
                          <div
                            key={`booking-${booking.id}`}
                            className="flex items-center justify-between rounded-md bg-accent/50 px-3 py-2 mt-2"
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{booking.sponsorName}</span>
                              <span className="text-sm text-muted-foreground">
                                {format(parseISO(booking.startDate), 'dd.MM.yyyy')} - {format(parseISO(booking.endDate), 'dd.MM.yyyy')}
                              </span>
                            </div>
                            <Badge
                              variant="default"
                              className={booking.isActive ? 'bg-black hover:bg-black/90' : 'bg-gray-500'}
                            >
                              {booking.isActive ? "Aktiv" : "Inaktiv"}
                            </Badge>
                          </div>
                        ))}
                        {dateBookings.length === 0 && (
                          <div className="text-sm text-muted-foreground py-2">
                            No bookings on this day
                          </div>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              )
            })}
          </div>

          {filteredOfferings.length === 0 && (
            <Card>
              <CardContent className="py-4 text-center text-sm text-muted-foreground">
                No products found. Please adjust your filter settings.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

