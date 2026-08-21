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

      <footer className="border-t">
        <div className="mx-auto max-w-5xl space-y-1 px-4 py-6 text-xs text-muted-foreground">
          <p>
            Modelos de corazón, hígado, pulmones y riñones:{' '}
            <a
              href="https://apps.humanatlas.io/kg-explorer/?do=ref-organ"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Human Reference Atlas
            </a>
            , licenciado bajo{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              CC BY 4.0
            </a>
            .
          </p>
          <p>
            Modelo de estómago:{' '}
            <a
              href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              BodyParts3D
            </a>
            , © The Database Center for Life Science, licenciado bajo CC BY 4.0.
          </p>
        </div>
      </footer>
    </div>
  )
}
