import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatDate, formatTime } from '@/lib/utils'

async function getAllEvents() {
  try {
    return await prisma.event.findMany({
      where: { isPublished: true },
      include: { _count: { select: { registrations: true } } },
      orderBy: { date: 'desc' },
    })
  } catch {
    return []
  }
}

export default async function EventsPage() {
  const allEvents = await getAllEvents()
  const now = new Date()

  const upcoming = allEvents.filter(e => new Date(e.date) >= now).reverse()
  const past     = allEvents.filter(e => new Date(e.date) < now)

  return (
    <div style={{ background: '#09162A', minHeight: '100vh' }}>

      {/* ── Page header ────────────────────────────────────── */}
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

      {/* ── All sessions — upcoming highlighted, past below ─ */}
      <section className="section-pad">
        <div className="container">

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className={past.length > 0 ? 'mb-20' : ''}>
              <div className="flex items-baseline gap-4 mb-10">
                <h2 className="heading-section" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#F2EFE8' }}>
                  Upcoming
                </h2>
                <span className="text-[11px] tracking-[0.12em] uppercase" style={{ color: 'rgba(242,239,232,0.3)' }}>
                  {upcoming.length} session{upcoming.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex flex-col gap-5">
                {upcoming.map((event) => {
                  const seats = Math.max(0, event.totalSeats - event._count.registrations)
                  const pct   = Math.round((event._count.registrations / event.totalSeats) * 100)
                  const isFeatured = event.isFeatured
                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="group block border transition-all duration-300"
                      style={{
                        borderColor: isFeatured ? 'rgba(200,168,75,0.35)' : 'rgba(255,255,255,0.07)',
                        background: isFeatured ? 'rgba(200,168,75,0.04)' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
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
                            {event.topic && (
                              <span className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1"
                                style={{ color: 'rgba(242,239,232,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                {event.topic}
                              </span>
                            )}
                          </div>

                          <h2 className="font-display font-bold transition-colors"
                            style={{ fontSize: 'clamp(18px,2.5vw,26px)', color: '#F2EFE8', letterSpacing: '-0.01em' }}>
                            {event.title}
                          </h2>

                          {event.subtitle && (
                            <p className="font-serif italic text-[14px]" style={{ color: 'rgba(242,239,232,0.5)' }}>
                              {event.subtitle}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-[11px]" style={{ color: 'rgba(242,239,232,0.4)' }}>
                            <span>{formatDate(new Date(event.date))}</span>
                            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                            <span>{formatTime(new Date(event.date))} IST</span>
                            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                            <span>{event.format}</span>
                            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
                            <span>{event.duration} min</span>
                          </div>

                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex-1 max-w-[200px] h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                              <div className="h-full transition-all duration-700" style={{
                                width: `${pct}%`,
                                background: pct > 80 ? 'rgba(255,100,80,0.7)' : 'linear-gradient(to right, rgba(200,168,75,0.4), #C8A84B)',
                              }} />
                            </div>
                            <span className="text-[11px]" style={{ color: seats === 0 ? 'rgba(255,100,80,0.7)' : 'rgba(242,239,232,0.4)' }}>
                              {seats === 0 ? 'Full' : `${seats} seats left`}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 md:flex-col md:items-end">
                          <span
                            className="btn btn-amber text-[10px] gap-2 shrink-0"
                            style={{ pointerEvents: 'none' }}
                          >
                            {seats === 0 ? <span>Join waitlist</span> : <span>Explore The Event →</span>}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Past Sessions */}
          {past.length > 0 && (
            <div>
              {upcoming.length > 0 && (
                <div className="border-t mb-16" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
              )}

              <div className="flex items-baseline gap-4 mb-10">
                <h2 className="heading-section" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: '#F2EFE8' }}>
                  Past Sessions
                </h2>
                <span className="text-[11px] tracking-[0.12em] uppercase" style={{ color: 'rgba(242,239,232,0.3)' }}>
                  {past.length} session{past.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {past.map(event => (
                  <Link
                    key={event.id}
                    href={`/events/${event.slug}`}
                    className="group block border transition-all duration-300"
                    style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.01)' }}
                  >
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-5 items-center">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] tracking-[0.2em] uppercase px-2.5 py-1"
                            style={{ color: 'rgba(242,239,232,0.3)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            Completed
                          </span>
                          {event.topic && (
                            <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: 'rgba(242,239,232,0.25)' }}>
                              {event.topic}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display font-bold transition-colors" style={{ fontSize: 'clamp(16px,2vw,22px)', color: 'rgba(242,239,232,0.6)', letterSpacing: '-0.01em' }}>
                          {event.title}
                        </h3>
                        <p className="text-[11px]" style={{ color: 'rgba(242,239,232,0.3)' }}>
                          {formatDate(new Date(event.date))} · {event._count.registrations} attendees
                        </p>
                      </div>

                      <span
                        className="text-[10px] tracking-[0.16em] uppercase transition-colors"
                        style={{ color: 'rgba(242,239,232,0.3)' }}
                      >
                        View session →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {upcoming.length === 0 && past.length === 0 && (
            <div className="border p-12 md:p-16 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)', borderStyle: 'dashed' }}>
              <p className="font-serif italic text-[18px] mb-3" style={{ color: 'rgba(242,239,232,0.3)' }}>
                The next session is being curated.
              </p>
              <p className="text-[11px] tracking-[0.14em] uppercase" style={{ color: 'rgba(242,239,232,0.18)' }}>
                Check back soon.
              </p>
            </div>
          )}

        </div>
      </section>
    </div>
  )
}
