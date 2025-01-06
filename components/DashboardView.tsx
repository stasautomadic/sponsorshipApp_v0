import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SponsorshipOffering, Sponsor, SponsorshipAssignment } from './SponsorshipDashboard'

interface DashboardViewProps {
  offerings: SponsorshipOffering[]
  sponsors: Sponsor[]
  assignments: SponsorshipAssignment[]
}

export function DashboardView({ offerings, sponsors, assignments }: DashboardViewProps) {
  const activeAssignments = assignments.filter(a => a.isActive)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Offerings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{offerings.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total Sponsors</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{sponsors.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{activeAssignments.length}</p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {assignments.slice(-5).reverse().map(assignment => {
              const sponsor = sponsors.find(s => s.id === assignment.sponsorId)
              const offering = offerings.find(o => o.id === assignment.offeringId)
              return (
                <li key={assignment.id} className="flex justify-between items-center">
                  <span>{sponsor?.name} - {offering?.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(assignment.startDate).toLocaleDateString()}
                  </span>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

