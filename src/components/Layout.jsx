import { NavLink } from 'react-router-dom'
import { Wine, Leaf, Home, ChefHat } from 'lucide-react'

export default function Layout({ children }) {
  const navItems = [
    { to: '/drinks', icon: Wine, label: 'Drinkar' },
    { to: '/my-bar', icon: Home, label: 'Min Bar' },
    { to: '/can-make', icon: ChefHat, label: 'Kan göra' },
    { to: '/ingredients', icon: Leaf, label: 'Ingredienser' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-primary p-2 rounded-xl shadow-glow">
                <Wine className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Drinkar
              </h1>
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
            © 2024 Drinkar Web App. Hantera dina cocktails med stil. 🍸
          </p>
        </div>
      </footer>
    </div>
  )
}
