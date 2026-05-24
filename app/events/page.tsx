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

  // Upcoming ascending (nearest first), then past descending (most recent first)
  const upcoming = allEvents.filter(e => new Date(e.date) >= now)
  const past     = allEvents.filter(e => new Date(e.date) < now).reverse()
  const sorted   = [...upcoming, ...past]

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

        <div className="container relative z-10 pt-36 pb-20 md:pt-44 md:pb-24">
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

      {/* ── Unified session list ───────────────────────────────── */}
      <section className="section-pad">
        <div className="container">

          {sorted.length === 0 ? (
            <div className="border p-12 md:p-16 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)', borderStyle: 'dashed' }}>
              <p className="font-serif italic text-[18px] mb-3" style={{ color: 'rgba(242,239,232,0.3)' }}>
                The next session is being curated.
              </p>
              <p className="text-[11px] tracking-[0.14em] uppercase" style={{ color: 'rgba(242,239,232,0.18)' }}>
                Check back soon.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {sorted.map((event, idx) => {
                const isUpcoming  = new Date(event.date) >= now
                const isFeatured  = event.isFeatured && isUpcoming
                const seats       = Math.max(0, event.totalSeats - event._count.registrations)
                const pct         = Math.round((event._count.registrations / event.totalSeats) * 100)
                const isFirst     = idx === 0
                const isLast      = idx === sorted.length - 1

                // divider between upcoming and past
                const showDivider = idx > 0 && isUpcoming === false && new Date(sorted[idx - 1].date) >= now

                return (
                  <div key={event.id}>
                    {showDivider && (
                      <div className="flex items-center gap-4 py-8">
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        <span className="text-[9px] tracking-[0.24em] uppercase" style={{ color: 'rgba(242,239,232,0.2)' }}>
                          Past sessions
                        </span>
                        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                      </div>
                    )}

                    <Link
                      href={`/events/${event.slug}`}
                      className="group block border-x border-b transition-all duration-300"
                      style={{
                        borderTopWidth: isFirst ? '1px' : '0',
                        borderStyle: 'solid',
                        borderColor: isFeatured
                          ? 'rgba(200,168,75,0.35)'
                          : isUpcoming
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(255,255,255,0.06)',
                        background: isFeatured
                          ? 'rgba(200,168,75,0.03)'
                          : 'transparent',
                      }}
                    >
                      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">

                        {/* ── Left: info */}
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            {isFeatured && (
                              <span className="inline-flex items-center gap-1.5 text-[9px] tracking-[0.22em] uppercase px-2.5 py-1"
                                style={{ background: 'rgba(200,168,75,0.15)', color: '#C8A84B', border: '1px solid rgba(200,168,75,0.3)' }}>
                                <span className="relative flex">
                                  <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full opacity-60" style={{ background: '#C8A84B' }} />
                                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: '#C8A84B' }} />
                                </span>
                                Next up
                              </span>
                            )}
                            {!isUpcoming && (
                              <span className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1"
                                style={{ color: 'rgba(242,239,232,0.3)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                Completed
                              </span>
                            )}
                            {event.topic && (
                              <span className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1"
                                style={{
                                  color: isUpcoming ? 'rgba(242,239,232,0.4)' : 'rgba(242,239,232,0.22)',
                                  background: 'rgba(255,255,255,0.03)',
                                  border: '1px solid rgba(255,255,255,0.06)',
                                }}>
                                {event.topic}
                              </span>
                            )}
                          </div>

                          <h2
                            className="font-display font-bold"
                            style={{
                              fontSize: 'clamp(17px,2.2vw,24px)',
                              color: isUpcoming ? '#F2EFE8' : 'rgba(242,239,232,0.5)',
                              letterSpacing: '-0.01em',
                            }}
                          >
                            {event.title}
                          </h2>

                          {event.subtitle && isUpcoming && (
                            <p className="font-serif italic text-[13px]" style={{ color: 'rgba(242,239,232,0.45)' }}>
                              {event.subtitle}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 text-[11px]"
                            style={{ color: isUpcoming ? 'rgba(242,239,232,0.4)' : 'rgba(242,239,232,0.25)' }}>
                            <span>{formatDate(new Date(event.date))}</span>
                            {isUpcoming && (
                              <>
                                <span style={{ opacity: 0.4 }}>·</span>
                                <span>{formatTime(new Date(event.date))} IST</span>
                                <span style={{ opacity: 0.4 }}>·</span>
                                <span>{event.duration} min</span>
                              </>
                            )}
                            {!isUpcoming && (
                              <>
                                <span style={{ opacity: 0.4 }}>·</span>
                                <span>{event._count.registrations} attended</span>
                              </>
                            )}
                          </div>

                          {isUpcoming && (
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex-1 max-w-[180px] h-0.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                                <div className="h-full" style={{
                                  width: `${pct}%`,
                                  background: pct > 80 ? 'rgba(255,100,80,0.7)' : '#C8A84B',
                                  opacity: 0.7,
                                }} />
                              </div>
                              <span className="text-[10px]" style={{ color: seats === 0 ? 'rgba(255,100,80,0.8)' : 'rgba(242,239,232,0.35)' }}>
                                {seats === 0 ? 'Full' : `${seats} seats left`}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* ── Right: CTA */}
                        <div className="shrink-0">
                          {isUpcoming ? (
                            <span className="btn btn-amber text-[10px]" style={{ pointerEvents: 'none' }}>
                              <span>{seats === 0 ? 'Join waitlist' : 'Explore The Event'}</span>
                              <span>→</span>
                            </span>
                          ) : (
                            <span className="text-[10px] tracking-[0.16em] uppercase"
                              style={{ color: 'rgba(242,239,232,0.25)' }}>
                              View session →
                            </span>
                          )}
                        </div>

                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
