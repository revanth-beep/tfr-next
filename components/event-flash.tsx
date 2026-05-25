'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { loaderDone } from './loader-state'

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
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!event) return
    const delay = loaderDone ? 100 : 3800
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [event])

  if (!event) return null

  return (
    <div
      aria-label="Upcoming session announcement"
      style={{
        height: `${BANNER_H}px`,
        background: '#C8A84B',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        animation: visible ? 'bannerIn 0.55s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
        transform: visible ? undefined : 'translateY(-100%)',
      }}
    >
      <div className="container flex items-center justify-between gap-3" style={{ height: '100%' }}>

        {/* Status */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex shrink-0">
            <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full opacity-50"
              style={{ background: '#09162A' }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5"
              style={{ background: '#09162A' }} />
          </span>
          <span className="hidden sm:block text-[9px] font-bold tracking-[0.26em] uppercase"
            style={{ color: 'rgba(9,22,42,0.5)' }}>
            Registrations open
          </span>
        </div>

        {/* Event info */}
        <div className="flex-1 flex items-center justify-center gap-2.5 min-w-0">
          <p className="font-display font-bold truncate"
            style={{ fontSize: 'clamp(11px,2vw,13px)', color: '#09162A', letterSpacing: '-0.01em' }}>
            {event.title}
          </p>
          <span className="hidden sm:block shrink-0" style={{ width: 3, height: 3, background: 'rgba(9,22,42,0.3)', borderRadius: '50%' }} />
          <p className="hidden sm:block text-[11px] shrink-0" style={{ color: 'rgba(9,22,42,0.55)' }}>
            {fmt(event.date)} · Free
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center shrink-0">
          <Link
            href={`/events/${event.slug}`}
            className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1.5 transition-opacity hover:opacity-80"
            style={{ background: '#09162A', color: '#C8A84B' }}
          >
            Reserve Seat →
          </Link>
          <Link
            href={`/events/${event.slug}`}
            className="sm:hidden text-[11px] font-bold"
            style={{ color: 'rgba(9,22,42,0.65)' }}
          >
            Register →
          </Link>
        </div>

      </div>
    </div>
  )
}
