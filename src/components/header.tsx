'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/cn'
import { useTheme } from '@/hooks/use-theme'

export function Header() {
  const { theme, toggleTheme, mounted } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const locale = useLocale()
  const pathname = usePathname()

  const themeIcon = theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻'

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'border-b border-foreground/10 bg-background/80 backdrop-blur-sm',
        'pt-[env(safe-area-inset-top)]'
      )}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold">
          Boilerplate
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <Link
            href={pathname}
            locale="en"
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm transition-colors',
              locale === 'en'
                ? 'bg-foreground text-background'
                : 'hover:bg-foreground/10'
            )}
          >
            EN
          </Link>
          <Link
            href={pathname}
            locale="pt-BR"
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm transition-colors',
              locale === 'pt-BR'
                ? 'bg-foreground text-background'
                : 'hover:bg-foreground/10'
            )}
          >
            PT
          </Link>
          <button
            onClick={toggleTheme}
            disabled={!mounted}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm transition-colors',
              'hover:bg-foreground hover:text-background',
              !mounted && 'opacity-0'
            )}
            aria-label="Toggle theme"
          >
            {themeIcon}
          </button>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-foreground/10 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={cn(
                'h-0.5 w-6 bg-foreground transition-transform',
                menuOpen && 'translate-y-2 rotate-45'
              )}
            />
            <span
              className={cn(
                'h-0.5 w-6 bg-foreground transition-opacity',
                menuOpen && 'opacity-0'
              )}
            />
            <span
              className={cn(
                'h-0.5 w-6 bg-foreground transition-transform',
                menuOpen && '-translate-y-2 -rotate-45'
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300 md:hidden',
          menuOpen ? 'max-h-60' : 'max-h-0'
        )}
      >
        <nav className="flex flex-col gap-2 border-t border-foreground/10 p-4">
          <div className="flex items-center gap-2">
            <span className="text-foreground/60 text-sm">Idioma:</span>
            <Link
              href={pathname}
              locale="en"
              onClick={closeMenu}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm transition-colors',
                locale === 'en'
                  ? 'bg-foreground text-background'
                  : 'border hover:bg-foreground/10'
              )}
            >
              English
            </Link>
            <Link
              href={pathname}
              locale="pt-BR"
              onClick={closeMenu}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm transition-colors',
                locale === 'pt-BR'
                  ? 'bg-foreground text-background'
                  : 'border hover:bg-foreground/10'
              )}
            >
              Português
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-foreground/60 text-sm">Tema:</span>
            <button
              onClick={() => {
                toggleTheme()
              }}
              disabled={!mounted}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm transition-colors',
                'hover:bg-foreground hover:text-background',
                !mounted && 'opacity-0'
              )}
              aria-label="Toggle theme"
            >
              {themeIcon} {theme === 'light' ? 'Claro' : theme === 'dark' ? 'Escuro' : 'Sistema'}
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}
