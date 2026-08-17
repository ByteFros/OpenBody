import { NavLink, Outlet } from 'react-router'

import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/explorer', label: 'Explorador' },
  { to: '/organs', label: 'Órganos' },
]

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="mx-auto max-w-5xl flex items-center gap-6 px-4 py-4">
          <span className="font-semibold">OpenBody</span>
          <ul className="flex gap-4">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'text-sm text-muted-foreground hover:text-foreground',
                      isActive && 'text-foreground font-medium',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
