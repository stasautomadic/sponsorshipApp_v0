import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sponsor, SponsorshipBooking } from '../../types/sponsorship'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SponsorPlacementsProps {
  sponsor: Sponsor
  bookings: SponsorshipBooking[]
}

export function SponsorPlacements({ sponsor, bookings }: SponsorPlacementsProps) {
  const sponsorBookings = bookings.filter(booking => booking.sponsorId === sponsor.id)
  const activeBookings = sponsorBookings.filter(booking => booking.isActive)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Placement Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Badge variant="outline">
              Total Placements: {sponsorBookings.length}
            </Badge>
            <Badge variant="default">
              Active Placements: {activeBookings.length}
            </Badge>
          </div>

          {sponsorBookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placement</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsorBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.offeringName}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(booking.endDate).toLocaleDateString()}
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
            <div className="text-center py-8 text-muted-foreground">
              No placements found for this sponsor
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

