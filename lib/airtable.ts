const AIRTABLE_BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID || process.env.AIRTABLE_BASE_ID;
const AIRTABLE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_AIRTABLE_ACCESS_TOKEN || process.env.AIRTABLE_ACCESS_TOKEN;

if (!AIRTABLE_BASE_ID || !AIRTABLE_ACCESS_TOKEN) {
  console.error('Missing Airtable environment variables');
  console.error('AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID ? 'Set' : 'Missing');
  console.error('AIRTABLE_ACCESS_TOKEN:', AIRTABLE_ACCESS_TOKEN ? 'Set' : 'Missing');
  throw new Error('Missing required Airtable configuration. Please check your environment variables.');
}

import { z } from 'zod';

const gameSchema = z.object({
  id: z.string(),
  fields: z.object({
    Time: z.string().optional(),
    League: z.string().optional(),
    'Home Team': z.string().optional(),
    'Away Team': z.string().optional(),
    Venue: z.string().optional(),
    Date: z.string().optional(),
  }),
});

const sponsorSchema = z.object({
  id: z.string(),
  fields: z.object({
    Name: z.string().optional(),
    Logo_url: z.string().optional(),
    Industry: z.string().optional(),
    Category: z.string().optional(),
    'Account Manager': z.string().optional(),
    'Contact Name': z.string().optional(),
    'Contact Role': z.string().optional(),
    'Contact Email': z.string().optional(),
    Address: z.string().optional(),
    'Billing Address': z.string().optional(),
  }),
});

type AirtableGame = z.infer<typeof gameSchema>;
type AirtableSponsor = z.infer<typeof sponsorSchema>;


export async function createSponsor(sponsor: any): Promise<AirtableSponsor> {
  try {
    console.log('Starting createSponsor');
    
    const fields = {
      Name: sponsor.name,
      Logo_url: sponsor.logo,
      Industry: sponsor.industry,
      Category: sponsor.category,
      'Account Manager': sponsor.accountManager,
      'Contact Name': sponsor.contact.name,
      'Contact Role': sponsor.contact.role,
      'Contact Email': sponsor.contact.email,
      Address: `${sponsor.address.street},${sponsor.address.number},${sponsor.address.zip},${sponsor.address.city},${sponsor.address.country}`,
      ...(sponsor.billingAddress && {
        'Billing Address': `${sponsor.billingAddress.street},${sponsor.billingAddress.number},${sponsor.billingAddress.zip},${sponsor.billingAddress.city},${sponsor.billingAddress.country}`
      })
    };

    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/tblTfxLEmoMgMfZAR`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable API Error:', errorData);
      throw new Error(`Failed to create sponsor in Airtable: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Sponsor created successfully:', data);
    return sponsorSchema.parse(data);
  } catch (error) {
    console.error('Error in createSponsor:', error);
    throw error;
  }
}

export async function fetchGames(): Promise<AirtableGame[]> {
  try {
    console.log('Starting fetchGames. AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID ? 'Set' : 'Missing', 'AIRTABLE_ACCESS_TOKEN:', AIRTABLE_ACCESS_TOKEN ? 'Set' : 'Missing');
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_ID}`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch games from Airtable: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return z.array(gameSchema).parse(data.records);
  } catch (error) {
    console.error('Error in fetchGames:', error);
    throw error;
  }
}

export async function fetchSponsors(): Promise<{ sponsors: AirtableSponsor[], categories: string[] }> {
  try {
    console.log('Starting fetchSponsors. AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID ? 'Set' : 'Missing', 'AIRTABLE_ACCESS_TOKEN:', AIRTABLE_ACCESS_TOKEN ? 'Set' : 'Missing');
    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/tblTfxLEmoMgMfZAR`, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch sponsors from Airtable: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const sponsors = z.array(sponsorSchema).parse(data.records);
    const categories = Array.from(new Set(sponsors.map(s => s.fields.Category).filter(Boolean)));
    return { sponsors, categories };
  } catch (error) {
    console.error('Error in fetchSponsors:', error);
    throw error;
  }
}

export async function deleteSponsor(sponsorId: string): Promise<void> {
  try {
    console.log('Starting deleteSponsor. AIRTABLE_BASE_ID:', AIRTABLE_BASE_ID ? 'Set' : 'Missing', 'AIRTABLE_ACCESS_TOKEN:', AIRTABLE_ACCESS_TOKEN ? 'Set' : 'Missing');
    const response = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/tblTfxLEmoMgMfZAR/${sponsorId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to delete sponsor from Airtable: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error('Error in deleteSponsor:', error);
    throw error;
  }
}

export async function updateSponsor(sponsorId: string, sponsor: any): Promise<AirtableSponsor> {
  try {
    console.log('Starting updateSponsor');
    
    const fields = {
      Name: sponsor.name,
      Logo_url: sponsor.logo,
      Industry: sponsor.industry,
      Category: sponsor.category,
      'Account Manager': sponsor.accountManager,
      'Contact Name': sponsor.contact.name,
      'Contact Role': sponsor.contact.role,
      'Contact Email': sponsor.contact.email,
      Address: `${sponsor.address.street},${sponsor.address.number},${sponsor.address.zip},${sponsor.address.city},${sponsor.address.country}`,
      ...(sponsor.billingAddress && {
        'Billing Address': `${sponsor.billingAddress.street},${sponsor.billingAddress.number},${sponsor.billingAddress.zip},${sponsor.billingAddress.city},${sponsor.billingAddress.country}`
      })
    };

    const response = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/tblTfxLEmoMgMfZAR/${sponsorId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable API Error:', errorData);
      throw new Error(`Failed to update sponsor in Airtable: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Sponsor updated successfully:', data);
    return sponsorSchema.parse(data);
  } catch (error) {
    console.error('Error in updateSponsor:', error);
    throw error;
  }
}

