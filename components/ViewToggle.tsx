import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from 'lucide-react'

interface ViewToggleProps {
  view: 'card' | 'row'
  onToggle: () => void
}

export function ViewToggle({ view, onToggle }: ViewToggleProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onToggle}>
      {view === 'card' ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
    </Button>
  )
}

