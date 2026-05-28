'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

interface NavProps {
  upcomingEvent?: { title: string; slug: string; date: string } | null
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

export function Nav({ upcomingEvent: _ }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header>
      <div
        className="transition-all duration-500"
        style={{
          paddingLeft: 'clamp(20px, 4vw, 64px)',
          paddingRight: 'clamp(20px, 4vw, 64px)',
          paddingTop: scrolled ? '13px' : '20px',
          paddingBottom: scrolled ? '13px' : '20px',
          background: scrolled ? 'rgba(9,22,42,0.94)' : 'rgba(9,22,42,0.6)',
          backdropFilter: 'blur(20px) saturate(1.4)',
          borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.06)' : 'transparent'}`,
        }}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="The Finance Room"
              className="h-9 w-auto"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.88 }}
            />
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-7">
            {[
              { href: '/events',   label: 'Events' },
              { href: '/#insider', label: 'Insider Series' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[11px] font-medium tracking-[0.12em] uppercase transition-colors duration-200"
                style={{ color: 'rgba(242,239,232,0.55)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#F2EFE8')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(242,239,232,0.55)')}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? ''}
                    className="w-7 h-7 rounded-full"
                    style={{ border: '1px solid rgba(255,255,255,0.15)', opacity: 0.85 }}
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="text-[11px] tracking-[0.14em] uppercase transition-colors"
                  style={{ color: 'rgba(242,239,232,0.4)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(242,239,232,0.7)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(242,239,232,0.4)')}
                >
                  Sign out
                </button>
              </div>
            ) : (
              /* Instagram CTA — highlighted */
              <a
                href="https://instagram.com/thefinanceroom"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-all duration-200"
                style={{
                  color: '#F2EFE8',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '7px 14px',
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(255,255,255,0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
              >
                <InstagramIcon />
                <span>Follow us</span>
              </a>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center gap-[5px] p-2 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`} style={{ background: '#F2EFE8' }} />
            <span className={`block w-5 h-px transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} style={{ background: '#F2EFE8' }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{ background: 'rgba(9,22,42,0.98)', backdropFilter: 'blur(20px)', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="px-6 py-8 flex flex-col gap-6">
            {[
              { href: '/events',   label: 'Events' },
              { href: '/#insider', label: 'Insider Series' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-[12px] tracking-[0.12em] uppercase"
                style={{ color: 'rgba(242,239,232,0.75)' }}
              >
                {label}
              </Link>
            ))}

            <a
              href="https://instagram.com/thefinanceroom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase"
              style={{ color: '#F2EFE8' }}
              onClick={() => setMenuOpen(false)}
            >
              <InstagramIcon />
              <span>Follow us on Instagram</span>
            </a>

            {session && (
              <button
                onClick={() => { signOut(); setMenuOpen(false) }}
                className="text-left text-[11px] tracking-[0.14em] uppercase"
                style={{ color: 'rgba(242,239,232,0.5)' }}
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
