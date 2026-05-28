import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatDate, formatTime } from '@/lib/utils'
import { Reveal } from '@/components/reveal'
import { getHomepageContent } from '@/lib/homepage'

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
  const [allEvents, content] = await Promise.all([getAllEvents(), getHomepageContent()])
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

        <div className="container relative z-10 pt-10 pb-10 md:pt-14 md:pb-14 xl:pt-16 xl:pb-16">
          <p className="kicker mb-5">{content.eventsPageKicker}</p>
          <h1 className="heading-display mb-4" style={{ fontSize: 'clamp(36px,5vw,68px)', color: '#F2EFE8' }}>
            {content.eventsPageTitle}
          </h1>
          <p style={{ fontSize: 'clamp(13px,1.3vw,16px)', color: 'rgba(242,239,232,0.78)', lineHeight: 1.7, maxWidth: '440px' }}>
            {content.eventsPageDescription}
          </p>
        </div>
      </section>

      {/* ── Upcoming sessions ─────────────────────────────────── */}
      <section style={{ paddingTop: 'clamp(28px, 4vw, 48px)', paddingBottom: upcoming.length ? 'clamp(28px, 4vw, 48px)' : '0' }}>
        <div className="container">

          {upcoming.length === 0 && past.length === 0 ? (
            <div className="border p-10 md:p-12 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)', borderStyle: 'dashed' }}>
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

                return (
                  <Reveal key={event.id} delay={idx * 0.1} style={{ marginBottom: '8px' }}>
                  <Link
                    href={`/events/${event.slug}`}
                    className="group block"
                    style={{
                      border: isFeatured
                        ? '1px solid rgba(200,168,75,0.45)'
                        : '1px solid rgba(255,255,255,0.12)',
                      background: isFeatured ? '#0F1E2E' : '#0D1B2E',
                    }}
                  >
                    <div className="p-5 md:p-6 xl:p-7 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 md:gap-6 items-center">

                      <div className="flex flex-col gap-3">
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
                          style={{ fontSize: 'clamp(19px,2.2vw,28px)', color: '#F2EFE8', letterSpacing: '-0.01em' }}
                        >
                          {event.title}
                        </h2>

                        {event.subtitle && (
                          <p className="font-serif italic text-[13px]" style={{ color: 'rgba(242,239,232,0.78)' }}>
                            {event.subtitle}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-[12px]"
                          style={{ color: 'rgba(242,239,232,0.75)' }}>
                          <span>{formatDate(new Date(event.date))}</span>
                          <span style={{ opacity: 0.4 }}>·</span>
                          <span>{formatTime(new Date(event.date))} IST</span>
                          <span style={{ opacity: 0.4 }}>·</span>
                          <span>{event.duration} min</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex-1 max-w-[160px] h-px overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <div className="h-full" style={{
                              width: `${pct}%`,
                              background: pct > 80 ? '#E05A5A' : '#C8A84B',
                            }} />
                          </div>
                          <span className="text-[11px]" style={{ color: seats === 0 ? '#E05A5A' : 'rgba(242,239,232,0.55)' }}>
                            {seats === 0 ? 'Full' : `${seats} seats left`}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <span className="btn btn-amber text-[10px]" style={{ pointerEvents: 'none' }}>
                          <span>{seats === 0 ? 'Join waitlist' : 'Explore Session'}</span>
                          <span>→</span>
                        </span>
                      </div>

                    </div>
                  </Link>
                  </Reveal>
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
            paddingTop: 'clamp(28px, 4vw, 48px)',
            paddingBottom: 'clamp(32px, 5vw, 60px)',
          }}
        >
          <div className="container">

            {/* Section header */}
            <div className="flex items-end justify-between mb-5 md:mb-7 pb-4"
              style={{ borderBottom: '1px solid rgba(124,185,217,0.15)' }}>
              <h2 className="font-display"
                style={{ fontSize: 'clamp(20px,2.5vw,30px)', color: '#D6EAFA', letterSpacing: '-0.01em' }}>
                Past Sessions
              </h2>
              <span className="text-[11px] tracking-[0.16em] uppercase pb-0.5"
                style={{ color: 'rgba(124,185,217,0.5)' }}>
                {past.length} session{past.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Past event cards */}
            <div className="flex flex-col gap-2">
              {past.map((event, idx) => (
                <Reveal
                  key={event.id}
                  delay={idx * 0.08}
                  style={{
                    border: '1px solid rgba(242,239,232,0.1)',
                    background: '#0E1F38',
                  }}
                >
                  <div className="p-5 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">

                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5"
                          style={{ color: '#7CB9D9', background: 'rgba(124,185,217,0.12)', border: '1px solid rgba(124,185,217,0.35)' }}>
                          Completed
                        </span>
                        {event.topic && (
                          <span className="text-[9px] tracking-[0.2em] uppercase px-2 py-0.5"
                            style={{ color: 'rgba(124,185,217,0.9)', background: 'rgba(124,185,217,0.08)', border: '1px solid rgba(124,185,217,0.25)' }}>
                            {event.topic}
                          </span>
                        )}
                      </div>

                      <h2
                        className="font-display"
                        style={{ fontSize: 'clamp(16px,2vw,22px)', color: '#F2EFE8', letterSpacing: '-0.01em' }}
                      >
                        {event.title}
                      </h2>

                      {event.subtitle && (
                        <p className="font-serif italic text-[13px]" style={{ color: 'rgba(242,239,232,0.75)' }}>
                          {event.subtitle}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-[12px]"
                        style={{ color: 'rgba(124,185,217,0.85)' }}>
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
                        style={{ color: '#F2EFE8', border: '1px solid rgba(242,239,232,0.25)', background: 'rgba(255,255,255,0.05)' }}
                      >
                        View Session Details →
                      </Link>
                    </div>

                  </div>
                </Reveal>
              ))}
            </div>

          </div>
        </section>
      )}

    </div>
  )
}
