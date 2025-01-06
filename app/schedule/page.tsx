"use client"

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Plus, ArrowUpDown } from 'lucide-react'
import { useSponsorship } from "@/contexts/SponsorshipContext"
import { AddGameDialog } from '@/components/AddGameDialog'
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SchedulePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddGameDialogOpen, setIsAddGameDialogOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const { gameSchedule, isLoading, error, addGame } = useSponsorship()

  const filteredSchedule = gameSchedule
    .filter(game =>
      game.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.venue.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
    })

  const formatDate = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`)
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    const day = days[dateObj.getDay()]
    const formattedDate = dateObj.toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    return `${day} ${formattedDate}, ${time}`
  }

  const isHomeGame = (game: typeof gameSchedule[0]) => game.homeTeam === 'BSV Bern'

  const handleAddGame = (gameData: {
    date: string
    time: string
    league: string
    homeTeam: string
    awayTeam: string
    venue: string
  }) => {
    addGame(gameData)
    setIsAddGameDialogOpen(false)
  }

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc')
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Spielplan BSV Bern</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button 
            onClick={() => setIsAddGameDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Neues Spiel
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">
              <Button
                variant="ghost"
                onClick={toggleSortOrder}
                className="p-0 hover:bg-transparent"
              >
                <span>Datum</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="w-[100px]">Liga</TableHead>
            <TableHead>Heimteam</TableHead>
            <TableHead>Gastteam</TableHead>
            <TableHead className="w-[250px]">Spielort</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSchedule.map((game) => (
            <TableRow key={game.id} className={isHomeGame(game) ? 'bg-blue-50/50' : undefined}>
              <TableCell>{formatDate(game.date, game.time)}</TableCell>
              <TableCell>{game.league}</TableCell>
              <TableCell>
                {game.homeTeam}
                {isHomeGame(game) && (
                  <Badge variant="default" className="ml-2">
                    Heim
                  </Badge>
                )}
              </TableCell>
              <TableCell>{game.awayTeam}</TableCell>
              <TableCell>{game.venue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredSchedule.length === 0 && (
        <p className="text-center text-muted-foreground">Keine Spiele gefunden.</p>
      )}

      <AddGameDialog 
        isOpen={isAddGameDialogOpen}
        onClose={() => setIsAddGameDialogOpen(false)}
        onAddGame={handleAddGame}
      />
    </div>
  )
}

