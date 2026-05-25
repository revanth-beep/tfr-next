import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatDate, formatTime } from '@/lib/utils'

async function getAllEvents() {
  try {
    return await prisma.event.findMany({
      where: { isPublished: true },
      include: { _count: { select: { registrations: true } } },
      orderBy: { date: 'asc' },
    })
  } catch {
    return []
  }
}

export default async function EventsPage() {
  const allEvents = await getAllEvents()
  const now = new Date()

  const upcoming = allEvents.filter(e => new Date(e.date) >= now)
  const past     = allEvents.filter(e => new Date(e.date) < now).reverse()

  return (
    <div style={{ background: '#09162A', minHeight: '100vh' }}>

      {/* ── Page header ───────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0D1535 0%, #0A1428 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 70%)',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 70%)',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(200,168,75,0.07) 0%, transparent 70%)',
        }} />

        <div className="container relative z-10 pt-14 pb-20 md:pt-24 md:pb-24">
          <p className="kicker mb-6">The Insider Series</p>
          <h1 className="heading-display mb-5" style={{ fontSize: 'clamp(40px,6vw,80px)', color: '#F2EFE8' }}>
            Sessions
          </h1>
          <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', color: 'rgba(242,239,232,0.5)', lineHeight: 1.75, maxWidth: '480px' }}>
            One senior practitioner. One real decision. A small, vetted group who
            can engage at that level. No recordings. No version for the classroom.
          </p>
        </div>
      </section>

      {/* ── Upcoming sessions ─────────────────────────────────── */}
      <section style={{ paddingTop: 'clamp(40px, 8vw, 80px)', paddingBottom: upcoming.length ? 'clamp(40px, 8vw, 80px)' : '0' }}>
        <div className="container">

          {upcoming.length === 0 && past.length === 0 ? (
            <div className="border p-12 md:p-16 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)', borderStyle: 'dashed' }}>
              <p className="font-serif italic text-[18px] mb-3" style={{ color: 'rgba(242,239,232,0.3)' }}>
                The next session is being curated.
              </p>
              <p className="text-[11px] tracking-[0.14em] uppercase" style={{ color: 'rgba(242,239,232,0.18)' }}>
                Check back soon.
              </p>
            </div>
          ) : upcoming.length > 0 ? (
            <div className="flex flex-col">
              {upcoming.map((event, idx) => {
                const isFeatured = event.isFeatured
                const seats      = Math.max(0, event.totalSeats - event._count.registrations)
                const pct        = Math.round((event._count.registrations / event.totalSeats) * 100)
                const isFirst    = idx === 0

                return (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group block transition-all duration-300"
                    style={{
                      border: isFeatured
                        ? '1px solid rgba(200,168,75,0.45)'
                        : '1px solid rgba(255,255,255,0.12)',
                      background: isFeatured ? '#0F1E2E' : '#0D1B2E',
                      marginBottom: '10px',
                    }}
                  >
                    <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-center">

                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {isFeatured && (
                            <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.22em] uppercase px-2.5 py-1"
                              style={{ background: 'rgba(200,168,75,0.18)', color: '#C8A84B', border: '1px solid rgba(200,168,75,0.4)' }}>
                              <span className="relative flex">
                                <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full opacity-60" style={{ background: '#C8A84B' }} />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#C8A84B' }} />
                              </span>
                              Next up
                            </span>
                          )}
                          {event.topic && (
                            <span className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1"
                              style={{ color: 'rgba(242,239,232,0.6)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)' }}>
                              {event.topic}
                            </span>
                          )}
                        </div>

                        <h2
                          className="font-display"
                          style={{ fontSize: 'clamp(20px,2.4vw,30px)', color: '#F2EFE8', letterSpacing: '-0.01em' }}
                        >
                          {event.title}
                        </h2>

                        {event.subtitle && (
                          <p className="font-serif italic text-[14px]" style={{ color: 'rgba(242,239,232,0.6)' }}>
                            {event.subtitle}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-[12px]"
                          style={{ color: 'rgba(242,239,232,0.55)' }}>
                          <span>{formatDate(new Date(event.date))}</span>
                          <span style={{ opacity: 0.4 }}>·</span>
                          <span>{formatTime(new Date(event.date))} IST</span>
                          <span style={{ opacity: 0.4 }}>·</span>
                          <span>{event.duration} min</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[180px] h-1 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <div className="h-full rounded-full" style={{
                              width: `${pct}%`,
                              background: pct > 80 ? '#E05A5A' : '#C8A84B',
                            }} />
                          </div>
                          <span className="text-[11px]" style={{ color: seats === 0 ? '#E05A5A' : 'rgba(242,239,232,0.6)' }}>
                            {seats === 0 ? 'Full' : `${seats} seats left`}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span className="btn btn-amber text-[10px]" style={{ pointerEvents: 'none' }}>
                          <span>{seats === 0 ? 'Join waitlist' : 'Explore The Event'}</span>
                          <span>→</span>
                        </span>
                      </div>

                    </div>
                  </Link>
                )
              })}
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Past sessions ─────────────────────────────────────── */}
      {past.length > 0 && (
        <section
          style={{
            borderTop: '1px solid rgba(124,185,217,0.15)',
            background: 'rgba(10,18,40,0.6)',
            paddingTop: 'clamp(40px, 8vw, 72px)',
            paddingBottom: 'clamp(48px, 10vw, 100px)',
          }}
        >
          <div className="container">

            {/* Section header */}
            <div className="flex items-end justify-between mb-6 md:mb-10 pb-5 md:pb-6"
              style={{ borderBottom: '1px solid rgba(124,185,217,0.15)' }}>
              <div>
                <h2 className="font-display"
                  style={{ fontSize: 'clamp(22px,3vw,34px)', color: '#D6EAFA', letterSpacing: '-0.01em' }}>
                  Past Sessions
                </h2>
              </div>
              <span className="text-[11px] tracking-[0.16em] uppercase pb-1"
                style={{ color: 'rgba(124,185,217,0.5)' }}>
                {past.length} session{past.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Past event cards */}
            <div className="flex flex-col gap-[10px]">
              {past.map((event) => (
                <div
                  key={event.id}
                  style={{
                    border: '1px solid rgba(242,239,232,0.12)',
                    background: '#0E1F38',
                  }}
                >
                  <div className="p-7 md:p-9 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1"
                          style={{ color: '#7CB9D9', background: 'rgba(124,185,217,0.15)', border: '1px solid rgba(124,185,217,0.45)' }}>
                          Completed
                        </span>
                        {event.topic && (
                          <span className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1"
                            style={{ color: 'rgba(124,185,217,0.9)', background: 'rgba(124,185,217,0.1)', border: '1px solid rgba(124,185,217,0.3)' }}>
                            {event.topic}
                          </span>
                        )}
                      </div>

                      <h2
                        className="font-display"
                        style={{ fontSize: 'clamp(18px,2.2vw,26px)', color: '#F2EFE8', letterSpacing: '-0.01em' }}
                      >
                        {event.title}
                      </h2>

                      {event.subtitle && (
                        <p className="font-serif italic text-[13px]" style={{ color: 'rgba(242,239,232,0.55)' }}>
                          {event.subtitle}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[11px]"
                        style={{ color: 'rgba(124,185,217,0.8)' }}>
                        <span>{formatDate(new Date(event.date))}</span>
                        <span style={{ opacity: 0.5 }}>·</span>
                        <span>{event._count.registrations} attended</span>
                        <span style={{ opacity: 0.5 }}>·</span>
                        <span>{event.duration} min</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex flex-col sm:flex-row gap-2">
                      {event.recordingUrl && (
                        <a
                          href={event.recordingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-ghost text-[10px]"
                        >
                          <span>Watch recording</span>
                          <span>↗</span>
                        </a>
                      )}
                      <Link
                        href={`/events/${event.slug}`}
                        className="text-[10px] tracking-[0.16em] uppercase px-3 py-2 inline-flex items-center justify-center gap-2"
                        style={{ color: '#F2EFE8', border: '1px solid rgba(242,239,232,0.3)', background: 'rgba(255,255,255,0.07)' }}
                      >
                        View Session Details →
                      </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

    </div>
  )
}
