import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sponsor, SponsorshipOffering, SponsorshipAssignment } from './SponsorshipDashboard'

interface SponsorshipOverviewProps {
  sponsors: Sponsor[]
  offerings: SponsorshipOffering[]
  assignments: SponsorshipAssignment[]
}

export function SponsorshipOverview({ sponsors, offerings, assignments }: SponsorshipOverviewProps) {
  const getAssignmentsForOffering = (offeringId: string) => {
    return assignments.filter(a => a.offeringId === offeringId)
  }

  const getActiveAssignmentsForOffering = (offeringId: string) => {
    return assignments.filter(a => a.offeringId === offeringId && a.isActive)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sponsorship Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {offerings.map((offering) => {
              const allAssignments = getAssignmentsForOffering(offering.id)
              const activeAssignments = getActiveAssignmentsForOffering(offering.id)
              return (
                <div key={offering.id} className="p-4 border rounded">
                  <h3 className="font-semibold">{offering.name}</h3>
                  <p className="text-sm text-gray-500">{offering.description}</p>
                  <div className="mt-2 flex space-x-2">
                    <Badge variant="outline">Total: {allAssignments.length}</Badge>
                    <Badge variant="default">Active: {activeAssignments.length}</Badge>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-medium">Sponsors:</h4>
                    <ul className="list-disc list-inside">
                  {allAssignments.map((assignment) => {
                    const sponsor = sponsors.find(s => s.id === assignment.sponsorId)
                    return (
                      <li key={assignment.id} className="text-sm">
                        {sponsor?.name} 
                        <span className="text-gray-500">
                          ({new Date(assignment.startDate).toLocaleDateString()} - 
                          {new Date(assignment.endDate).toLocaleDateString()})
                        </span>
                        {assignment.isActive && <Badge className="ml-2" variant="success">Active</Badge>}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </CardContent>
  </Card>
</div>
)
}

