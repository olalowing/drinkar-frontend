import { useState, useEffect, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Wine, Leaf, Home, ChefHat, Upload, ChevronDown } from 'lucide-react'
import Logo from './Logo'

export default function Layout({ children }) {
  const [actionsOpen, setActionsOpen] = useState(false)
  const actionsRef = useRef(null)

  const navItems = [
    { to: '/drinks', icon: Wine, label: 'Drinkar' },
    { to: '/my-bar', icon: Home, label: 'Min Bar' },
    { to: '/can-make', icon: ChefHat, label: 'Kan göra' },
    { to: '/ingredients', icon: Leaf, label: 'Ingredienser' },
  ]

  const quickActions = [
    {
      to: '/drinks/new',
      icon: Wine,
      label: 'Ny drink',
      description: 'Skapa en ny cocktail i samlingen',
    },
    {
      to: '/ingredients/new',
      icon: Leaf,
      label: 'Ny ingrediens',
      description: 'Lägg till en ny sprit eller ingrediens',
    },
    {
      to: '/drinks/import',
      icon: Upload,
      label: 'Importera CSV',
      description: 'Massimportera drinkar från fil',
    },
  ]

  useEffect(() => {
    const handleClick = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setActionsOpen(false)
      }
    }

    if (actionsOpen) {
      document.addEventListener('click', handleClick)
    }

    return () => document.removeEventListener('click', handleClick)
  }, [actionsOpen])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-slate-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="default" />
            <div className="relative" ref={actionsRef}>
              <button
                onClick={() => setActionsOpen(!actionsOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-300 text-sm font-medium text-gray-700 bg-white/70 hover:bg-white focus:ring-2 focus:ring-primary-500 transition-all"
              >
                Meny
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${actionsOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {actionsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl shadow-gray-500/15 overflow-hidden z-50">
                  <div className="py-1">
                    {quickActions.map((action) => (
                      <Link
                        key={action.to}
                        to={action.to}
                        onClick={() => setActionsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-gray-500">
                          <action.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{action.label}</p>
                          <p className="text-xs text-gray-500">{action.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-5 py-3.5 border-b-2 font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'border-primary-600 text-primary-600 bg-primary-50/50'
                      : 'border-transparent text-gray-600 hover:text-primary-600 hover:border-primary-300 hover:bg-gray-50/50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-gray-200/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2025 Drinkar Web App. Hantera dina cocktails med stil. 🍸
          </p>
        </div>
      </footer>
    </div>
  )
}
