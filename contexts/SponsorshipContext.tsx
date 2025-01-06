"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { SponsorshipOffering, Sponsor, SponsorshipBooking } from '@/types/sponsorship'
import { toast } from 'sonner'
import { fetchGames, fetchSponsors, deleteSponsor, createSponsorWithLogo, createSponsor, updateSponsor } from '@/lib/airtable';

interface SponsorshipContextType {
  offerings: SponsorshipOffering[]
  sponsors: Sponsor[]
  bookings: SponsorshipBooking[]
  categories: string[]
  gameSchedule: any[]
  isLoading: boolean;
  error: string | null;
  addOffering: (offering: SponsorshipOffering) => void
  editOffering: (offering: SponsorshipOffering) => void
  deleteOffering: (id: string) => void
  addSponsor: (sponsor: Sponsor) => Promise<void>
  editSponsor: (sponsor: Sponsor) => Promise<void>
  deleteSponsor: (id: string) => Promise<void>
  addBooking: (booking: SponsorshipBooking) => void
  editBooking: (booking: SponsorshipBooking) => void
  deleteBooking: (id: string) => void
  addCategory: (category: string) => void
  updateCategory: (oldCategory: string, newCategory: string) => void
  deleteCategory: (category: string) => void
  addGame: (game: any) => void
  addFileToSponsor: (sponsorId: string, file: any) => void
}

const SponsorshipContext = createContext<SponsorshipContextType | undefined>(undefined)

export function SponsorshipProvider({ children }: { children: ReactNode }) {
  const [offerings, setOfferings] = useState<SponsorshipOffering[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [bookings, setBookings] = useState<SponsorshipBooking[]>([])
  const [categories, setCategories] = useState<string[]>(['Gold', 'Silver', 'Bronze'])
  const [gameSchedule, setGameSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        const [gamesResponse, { sponsors: sponsorsResponse, categories: fetchedCategories }] = await Promise.all([
          fetchGames(),
          fetchSponsors()
        ]);

        setGameSchedule(gamesResponse.map(game => ({
          id: game.id,
          date: game.fields.Date || '',
          time: game.fields.Time || '',
          league: game.fields.League || '',
          homeTeam: game.fields['Home Team'] || '',
          awayTeam: game.fields['Away Team'] || '',
          venue: game.fields.Venue || '',
        })));

        setSponsors(sponsorsResponse.map(sponsor => ({
          id: sponsor.id,
          name: sponsor.fields.Name || '',
          logo: sponsor.fields.Logo?.[0]?.url || '/placeholder.svg',
          industry: sponsor.fields.Industry || '',
          category: sponsor.fields.Category || 'Uncategorized',
          accountManager: sponsor.fields['Account Manager'] || '',
          contact: {
            name: sponsor.fields['Contact Name'] || '',
            role: sponsor.fields['Contact Role'] || '',
            email: sponsor.fields['Contact Email'] || ''
          },
          address: parseAddress(sponsor.fields.Address),
          billingAddress: parseAddress(sponsor.fields['Billing Address'])
        })));

        if (fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
        }

        setError(null);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  function parseAddress(addressString?: string): {
    street: string;
    number: string;
    zip: string;
    city: string;
    country: string;
  } {
    if (!addressString) {
      return {
        street: '',
        number: '',
        zip: '',
        city: '',
        country: ''
      };
    }

    const parts = addressString.split(',').map(part => part.trim());
    return {
      street: parts[0] || '',
      number: parts[1] || '',
      zip: parts[2] || '',
      city: parts[3] || '',
      country: parts[4] || ''
    };
  }

  const addOffering = (offering: SponsorshipOffering) => {
    setOfferings(prev => [...prev, offering])
    toast.success('Offering added successfully')
  }

  const editOffering = (offering: SponsorshipOffering) => {
    setOfferings(prev => prev.map(o => o.id === offering.id ? offering : o))
    toast.success('Offering updated successfully')
  }

  const deleteOffering = (id: string) => {
    setOfferings(prev => prev.filter(o => o.id !== id))
    toast.success('Offering deleted successfully')
  }

  const addSponsor = async (sponsor: Sponsor) => {
    try {
      console.log('Starting addSponsor in SponsorshipContext');
      const newSponsor = await createSponsor(sponsor);
      setSponsors(prev => [...prev, {
        ...sponsor,
        id: newSponsor.id,
        logo: newSponsor.fields.Logo_url || '/placeholder.svg'
      }]);
      toast.success('Sponsor added successfully');
    } catch (error) {
      console.error('Error adding sponsor:', error);
      if (error instanceof Error) {
        if (error.message.includes('NOT_FOUND')) {
          toast.error('Failed to add sponsor: Airtable resource not found. Please check your Base ID and Table ID.');
        } else if (error.message.includes('Insufficient permissions')) {
          toast.error('Failed to add sponsor: Insufficient permissions. Please check your Airtable API token.');
        } else {
          toast.error(`Failed to add sponsor: ${error.message}`);
        }
      } else {
        toast.error('An unexpected error occurred while adding the sponsor');
      }
      throw error;
    }
  }

  const editSponsor = async (sponsor: Sponsor) => {
    try {
      console.log('Starting editSponsor in SponsorshipContext');
      const updatedSponsor = await updateSponsor(sponsor.id, sponsor);
      setSponsors(prev => prev.map(s => s.id === sponsor.id ? {
        ...sponsor,
        logo: updatedSponsor.fields.Logo_url || '/placeholder.svg'
      } : s));
      toast.success('Sponsor updated successfully');
    } catch (error) {
      console.error('Error updating sponsor:', error);
      if (error instanceof Error) {
        if (error.message.includes('NOT_FOUND')) {
          toast.error('Failed to update sponsor: Airtable resource not found');
        } else if (error.message.includes('Insufficient permissions')) {
          toast.error('Failed to update sponsor: Insufficient permissions');
        } else {
          toast.error(`Failed to update sponsor: ${error.message}`);
        }
      } else {
        toast.error('An unexpected error occurred while updating the sponsor');
      }
      throw error;
    }
  }

  const handleDeleteSponsor = async (id: string) => {
    try {
      await deleteSponsor(id);
      setSponsors(prev => prev.filter(s => s.id !== id));
      toast.success('Sponsor deleted successfully');
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      toast.error('Failed to delete sponsor');
      throw error; 
    }
  }

  const addBooking = (booking: SponsorshipBooking) => {
    setBookings(prev => [...prev, booking])
    toast.success('Booking added successfully')
  }

  const editBooking = (booking: SponsorshipBooking) => {
    setBookings(prev => prev.map(b => b.id === booking.id ? booking : b))
    toast.success('Booking updated successfully')
  }

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id))
    toast.success('Booking deleted successfully')
  }

  const addCategory = (category: string) => {
    setCategories(prev => [...prev, category])
    toast.success('Category added successfully')
  }

  const updateCategory = (oldCategory: string, newCategory: string) => {
    setCategories(prev => prev.map(c => c === oldCategory ? newCategory : c))
    setSponsors(prev => prev.map(s => ({
      ...s,
      category: s.category === oldCategory ? newCategory : s.category
    })))
    toast.success('Category updated successfully')
  }

  const deleteCategory = (category: string) => {
    setCategories(prev => prev.filter(c => c !== category))
    toast.success('Category deleted successfully')
  }

  const addGame = (game: any) => {
    setGameSchedule(prev => [...prev, game])
    toast.success('Game added successfully')
  }

  const addFileToSponsor = (sponsorId: string, file: any) => {
    setSponsors(prev => prev.map(sponsor => {
      if (sponsor.id === sponsorId) {
        return {
          ...sponsor,
          files: [...(sponsor.files || []), file]
        }
      }
      return sponsor
    }))
    toast.success('File added successfully')
  }

  return (
    <SponsorshipContext.Provider value={{
      offerings,
      sponsors,
      bookings,
      categories,
      gameSchedule,
      isLoading,
      error,
      addOffering,
      editOffering,
      deleteOffering,
      addSponsor,
      editSponsor,
      deleteSponsor: handleDeleteSponsor,
      addBooking,
      editBooking,
      deleteBooking,
      addCategory,
      updateCategory,
      deleteCategory,
      addGame,
      addFileToSponsor
    }}>
      {children}
    </SponsorshipContext.Provider>
  )
}

export function useSponsorship() {
  const context = useContext(SponsorshipContext)
  if (context === undefined) {
    throw new Error('useSponsorship must be used within a SponsorshipProvider')
  }
  return context
}

