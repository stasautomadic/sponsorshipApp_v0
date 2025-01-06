import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sponsor } from '../../types/sponsorship'

interface SponsorGeneralInfoProps {
  sponsor: Sponsor
}

export function SponsorGeneralInfo({ sponsor }: SponsorGeneralInfoProps) {
  const formatAddress = (address?: typeof sponsor.address) => {
    if (!address) return 'No address provided';
    return `${address.street} ${address.number}, ${address.zip} ${address.city}, ${address.country}`;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Account Manager</h3>
            <p className="text-sm text-muted-foreground">{sponsor.accountManager}</p>
          </div>
          <div>
            <h3 className="font-medium">Contact Person</h3>
            <p className="text-sm text-muted-foreground">{sponsor.contact.name}</p>
            <p className="text-sm text-muted-foreground">{sponsor.contact.role}</p>
            <p className="text-sm text-muted-foreground">{sponsor.contact.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Business Address</h3>
            <p className="text-sm text-muted-foreground">{formatAddress(sponsor.address)}</p>
          </div>
          <div>
            <h3 className="font-medium">Billing Address</h3>
            <p className="text-sm text-muted-foreground">
              {sponsor.billingAddress ? formatAddress(sponsor.billingAddress) : 'Same as business address'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sponsorship Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Category</h3>
            <p className="text-sm text-muted-foreground">{sponsor.category} Sponsor</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

