"use client"

import { useState, useCallback } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Home, Image, Bell, Calendar, Users, User, LogOut, Tag } from 'lucide-react'
import Link from 'next/link'
import { NewOfferDialog } from './NewOfferDialog'
import { SponsorshipOffering } from '../types/sponsorship'
import { usePathname, useRouter } from 'next/navigation'

interface AppLayoutProps {
  children: React.ReactNode
  onAddOffer: (offer: SponsorshipOffering) => void
}

export function AppLayout({ children, onAddOffer }: AppLayoutProps) {
  const [isNewOfferDialogOpen, setIsNewOfferDialogOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleTabChange = useCallback((tab: string) => {
    router.push(`/sponsoring/${tab}`)
  }, [router])

  const isSponsoring = pathname.startsWith('/sponsoring')
  const currentTab = pathname.split('/')[2] || 'sponsors'

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-black">
              <AvatarImage src="/Screenshot 2025-01-02 at 18.10.11.png" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <span className="text-lg font-semibold text-gray-700">Ariana</span>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-2">
            {[
              { icon: Home, label: 'Create', href: '/' },
              { icon: Image, label: 'Media', href: '/media' },
              { icon: Bell, label: 'Datahub', href: '#' },
              { icon: Calendar, label: 'Schedule', href: '/schedule' },
              { icon: Users, label: 'Sponsorship', href: '/sponsoring' },
              { icon: User, label: 'Profile', href: '#' },
              { icon: Tag, label: 'Categories', href: '#' },
            ].map((item) => (
              <Button 
                key={item.label} 
                variant="ghost" 
                className={`w-full justify-start ${
                  pathname === item.href || (pathname.startsWith('/sponsoring') && item.href === '/sponsoring') || (pathname.startsWith('/schedule') && item.href === '/schedule')
                    ? 'bg-blue-600 text-white' 
                    : ''
                }`} 
                asChild
              >
                <Link href={item.href}>
                  <item.icon className={`mr-2 h-4 w-4 ${
                    pathname === item.href || (pathname.startsWith('/sponsoring') && item.href === '/sponsoring') || (pathname.startsWith('/schedule') && item.href === '/schedule')
                      ? 'text-white' 
                      : ''
                  }`} />
                  {item.label}
                </Link>
              </Button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t mt-auto">
          <Button variant="ghost" className="w-full justify-start text-gray-600">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Navigation */}
        {isSponsoring && (
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <nav className="flex">
                  {['sponsors', 'products', 'placements', 'calendar'].map((tab) => (
                    <Button 
                      key={tab}
                      variant="ghost" 
                      className={`text-sm font-medium px-3 py-2 ${
                        currentTab === tab 
                          ? 'text-blue-600 border-b-2 border-blue-600 rounded-none' 
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={() => handleTabChange(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>

        <NewOfferDialog 
          isOpen={isNewOfferDialogOpen}
          onClose={() => setIsNewOfferDialogOpen(false)}
          onAddOffer={onAddOffer}
        />
      </main>
    </div>
  )
}

