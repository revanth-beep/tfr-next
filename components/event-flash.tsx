'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Props {
  event: { title: string; slug: string; date: string } | null
}

function fmt(iso: string) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata',
  }).format(new Date(iso))
}

const BANNER_H = 44

export function EventFlash({ event }: Props) {
  const [visible, setVisible]     = useState(false)
  const [leaving, setLeaving]     = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('tfr-banner-dismissed')) {
      setDismissed(true)
      return
    }
    // Show after the loader finishes (~3.5s)
    const t = setTimeout(() => setVisible(true), 3800)
    return () => clearTimeout(t)
  }, [])

  // Update CSS variable so Nav can offset itself
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--banner-h',
      visible && !leaving ? `${BANNER_H}px` : '0px'
    )
    return () => {
      document.documentElement.style.setProperty('--banner-h', '0px')
    }
  }, [visible, leaving])

  function dismiss() {
    setLeaving(true)
    sessionStorage.setItem('tfr-banner-dismissed', '1')
    setTimeout(() => setDismissed(true), 380)
  }

  if (!event || dismissed) return null

  return (
    <div
      aria-label="Upcoming session announcement"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: `${BANNER_H}px`,
        zIndex: 60,
        background: '#C8A84B',
        display: 'flex',
        alignItems: 'center',
        animation: !visible
          ? 'none'
          : leaving
            ? 'bannerOut 0.38s cubic-bezier(0.4,0,1,1) forwards'
            : 'bannerIn 0.55s cubic-bezier(0.16,1,0.3,1) forwards',
        transform: visible ? undefined : 'translateY(-100%)',
      }}
    >
      <div className="container flex items-center justify-between gap-3" style={{ height: '100%' }}>

        {/* Status */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex shrink-0">
            <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full opacity-50"
              style={{ background: '#08080F' }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5"
              style={{ background: '#08080F' }} />
          </span>
          <span className="hidden sm:block text-[9px] font-bold tracking-[0.26em] uppercase"
            style={{ color: 'rgba(8,8,15,0.5)' }}>
            Registrations open
          </span>
        </div>

        {/* Event info */}
        <div className="flex-1 flex items-center justify-center gap-2.5 min-w-0">
          <p className="font-display font-bold truncate"
            style={{ fontSize: 'clamp(11px,2vw,13px)', color: '#08080F', letterSpacing: '-0.01em' }}>
            {event.title}
          </p>
          <span className="hidden sm:block shrink-0" style={{ width: 3, height: 3, background: 'rgba(8,8,15,0.3)', borderRadius: '50%' }} />
          <p className="hidden sm:block text-[11px] shrink-0" style={{ color: 'rgba(8,8,15,0.55)' }}>
            {fmt(event.date)} · Free
          </p>
        </div>

        {/* CTA + Dismiss */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={`/events/${event.slug}`}
            className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 transition-opacity hover:opacity-80"
            style={{ background: '#08080F', color: '#C8A84B' }}
            onClick={dismiss}
          >
            Reserve Seat →
          </Link>
          <Link
            href={`/events/${event.slug}`}
            className="sm:hidden text-[11px] font-bold"
            style={{ color: 'rgba(8,8,15,0.65)' }}
            onClick={dismiss}
          >
            Register →
          </Link>
          <button
            onClick={dismiss}
            className="text-[18px] leading-none transition-opacity hover:opacity-40 pl-1"
            style={{ color: 'rgba(8,8,15,0.45)' }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>

      </div>
    </div>
  )
}
