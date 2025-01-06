import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, Users, PieChart } from 'lucide-react'

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'offerings', label: 'Offerings', icon: Package },
    { id: 'assignments', label: 'Assignments', icon: Users },
    { id: 'overview', label: 'Overview', icon: PieChart },
  ]

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Sponsorship Manager</h2>
        <nav>
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveView(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}

