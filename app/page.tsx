import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatTime } from '@/lib/utils'
import { HeroReveal } from '@/components/hero-reveal'

async function getFeaturedEvent() {
  try {
    return await prisma.event.findFirst({
      where: { isPublished: true, isFeatured: true, date: { gte: new Date() } },
      include: { _count: { select: { registrations: true } } },
      orderBy: { date: 'asc' },
    })
  } catch {
    return null
  }
}

export default async function HomePage() {
  const event = await getFeaturedEvent()

  const registered = event?._count?.registrations ?? 0
  const totalSeats = event?.totalSeats ?? 30
  const seatsLeft  = Math.max(0, totalSeats - registered)

  const eventDate  = event ? new Date(event.date) : null
  const eventDay   = eventDate?.toLocaleString('en-IN', { day: 'numeric',  timeZone: 'Asia/Kolkata' }) ?? ''
  const eventMonth = eventDate?.toLocaleString('en-IN', { month: 'short',  timeZone: 'Asia/Kolkata' }).toUpperCase() ?? ''
  const eventYear  = eventDate?.toLocaleString('en-IN', { year: 'numeric', timeZone: 'Asia/Kolkata' }) ?? ''

  return (
    <>
      {/* ═══ HERO + BELIEFS ════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: '#09162A' }}>

        {/* ── Hero copy */}
        <div className="container relative z-10 pt-14 pb-28 md:pt-24 md:pb-24">
          <HeroReveal>
            <p className="kicker">Live Sessions · By Application Only</p>

            <h1 className="heading-display" style={{ fontSize: 'clamp(44px,8vw,108px)', color: '#F2EFE8' }}>
              <span className="block">Practitioner-led.</span>
              <span className="block">Community-driven.</span>
              <span className="block" style={{ color: '#C8A84B' }}>Built for serious finance careers.</span>
            </h1>

            <p className="font-serif italic" style={{
              fontSize: 'clamp(15px,1.7vw,20px)', color: 'rgba(242,239,232,0.6)', lineHeight: 1.65, maxWidth: '520px',
            }}>
              The room you were never told about. Now open.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              {event ? (
                <Link href={`/events/${event.slug}`} className="btn btn-amber">
                  <span>Reserve Your Seat</span>
                  <span>→</span>
                </Link>
              ) : (
                <span className="btn btn-amber opacity-50 pointer-events-none">
                  <span>Sessions coming soon</span>
                </span>
              )}
              <a href="#insider" className="btn btn-ghost"><span>The Insider Series</span></a>
            </div>
          </HeroReveal>
        </div>

        {/* ── What we believe — four beliefs strip */}
        <div className="border-t mt-2 md:mt-0" style={{ borderColor: 'rgba(200,168,75,0.12)' }}>
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 border-l"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              {[
                { n: '01', text: 'Finance is not learned in classrooms.' },
                { n: '02', text: 'The best network knows more than you.' },
                { n: '03', text: 'Judgment cannot be modelled.' },
                { n: '04', text: 'Access is the actual asset.' },
              ].map(({ n, text }, i) => (
                <div key={n} className="reveal group relative p-5 md:p-8 border-b border-r overflow-hidden transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.07)', transitionDelay: `${i * 0.1}s` }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: 'rgba(200,168,75,0.03)' }} />
                  <div className="select-none mb-5"
                    style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '13px', color: '#C8A84B', letterSpacing: '2px', fontWeight: 400 }}>
                    {n}
                  </div>
                  <p className="relative" style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(16px,1.6vw,22px)', fontWeight: 300,
                    fontStyle: 'italic',
                    color: '#F2EFE8', lineHeight: 1.3,
                  }}>
                    {text}
                  </p>
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                    style={{ background: '#C8A84B' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* ═══ FEATURED EVENT ════════════════════════════════════════════════════ */}
      <section id="events" className="section-pad" style={{ background: '#09162A', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <p className="kicker mb-10 reveal">Upcoming Session</p>

          {event ? (
            <Link href={`/events/${event.slug}`} className="reveal block" style={{ textDecoration: 'none', transitionDelay: '0.14s' }}>
              <div className="flex flex-col md:flex-row" style={{ border: '1px solid rgba(200,168,75,0.4)', overflow: 'hidden' }}>

                {/* ── Date panel */}
                <div className="shrink-0 border-b md:border-b-0 md:border-r"
                  style={{ background: '#C8A84B', borderColor: 'rgba(9,22,42,0.15)' }}>
                  <div className="flex items-center gap-5 px-8 py-5 md:hidden">
                    <span className="font-display font-bold" style={{ fontSize: '52px', lineHeight: 1, color: '#09162A' }}>
                      {eventDay}
                    </span>
                    <div>
                      <p className="text-[13px] font-bold tracking-[0.22em] uppercase" style={{ color: 'rgba(9,22,42,0.75)' }}>{eventMonth}</p>
                      <p className="text-[12px] tracking-[0.14em] mt-0.5" style={{ color: 'rgba(9,22,42,0.6)' }}>{eventYear}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col items-center justify-center text-center px-10"
                    style={{ minWidth: 184, minHeight: 260 }}>
                    <p className="text-[12px] font-bold tracking-[0.26em] uppercase mb-3" style={{ color: 'rgba(9,22,42,0.75)' }}>{eventMonth}</p>
                    <p className="font-display font-bold" style={{ fontSize: '80px', lineHeight: 0.88, color: '#09162A' }}>{eventDay}</p>
                    <p className="text-[12px] tracking-[0.16em] mt-3" style={{ color: 'rgba(9,22,42,0.6)' }}>{eventYear}</p>
                  </div>
                </div>

                {/* ── Content panel */}
                <div className="flex flex-1 flex-col p-6 md:p-10" style={{ background: '#0F1E37' }}>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex shrink-0">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-40" style={{ background: '#C8A84B' }} />
                        <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#C8A84B' }} />
                      </span>
                      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C8A84B' }}>
                        Registrations Open
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '4px 10px', border: '1px solid rgba(200,168,75,0.35)', color: '#C8A84B' }}>Free</span>
                      <span style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '4px 10px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(242,239,232,0.38)' }}>Live</span>
                    </div>
                  </div>

                  <h2 className="heading-section mb-3" style={{ fontSize: 'clamp(22px,3.8vw,48px)', color: '#F2EFE8' }}>
                    {event.title}
                  </h2>
                  {event.subtitle && (
                    <p className="font-serif italic" style={{ fontSize: 'clamp(13px,1.4vw,17px)', color: 'rgba(242,239,232,0.48)', lineHeight: 1.65 }}>
                      {event.subtitle}
                    </p>
                  )}

                  <div className="flex-1 min-h-[32px]" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex flex-wrap items-center gap-3" style={{ fontSize: '12px', color: 'rgba(242,239,232,0.45)' }}>
                      <span>{formatTime(new Date(event.date))} IST</span>
                      <span style={{ width: 3, height: 3, background: 'rgba(242,239,232,0.2)', borderRadius: '50%', display: 'inline-block' }} />
                      <span>{event.duration} min</span>
                      {seatsLeft > 0 && seatsLeft <= 10 ? (
                        <>
                          <span style={{ width: 3, height: 3, background: '#C8A84B', opacity: 0.7, borderRadius: '50%', display: 'inline-block' }} />
                          <span style={{ color: '#C8A84B' }}>Only {seatsLeft} seats left</span>
                        </>
                      ) : seatsLeft > 10 ? (
                        <>
                          <span style={{ width: 3, height: 3, background: 'rgba(242,239,232,0.2)', borderRadius: '50%', display: 'inline-block' }} />
                          <span>{seatsLeft} seats remaining</span>
                        </>
                      ) : null}
                    </div>
                    <div className="btn btn-amber shrink-0">
                      <span>Reserve Your Seat</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>

              </div>
            </Link>
          ) : (
            <div className="reveal border p-12 md:p-16 text-center" style={{ borderColor: 'rgba(255,255,255,0.07)', borderStyle: 'dashed', transitionDelay: '0.14s' }}>
              <p className="font-serif italic text-[20px] mb-3" style={{ color: 'rgba(242,239,232,0.35)' }}>
                The next session is being curated.
              </p>
              <p className="text-[12px] tracking-[0.14em] uppercase" style={{ color: 'rgba(242,239,232,0.2)' }}>
                Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ WHO IT IS FOR ═════════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background: '#0F1E37', borderTop: '1px solid rgba(200,168,75,0.1)', borderBottom: '1px solid rgba(200,168,75,0.07)' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-start">
            <div className="reveal">
              <p className="kicker mb-8">Who it is for</p>
              <h2 className="heading-section" style={{ fontSize: 'clamp(26px,4.5vw,52px)', color: '#F2EFE8', lineHeight: 1.12 }}>
                For those who have done the work — and are ready for{' '}
                <em className="italic" style={{ color: '#C8A84B' }}>
                  what the work doesn't teach.
                </em>
              </h2>
            </div>
            <div className="reveal rv-d2" style={{ paddingTop: '8px' }}>
              <p style={{ fontSize: 'clamp(14px,1.4vw,17px)', color: 'rgba(242,239,232,0.55)', lineHeight: 1.85 }}>
                If you have ever felt the gap between what finance looks like on paper and how it actually moves — you already understand why The Finance Room exists. This is not for those beginning to learn finance. It is for those who know enough to know what they are still missing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INSIDER SERIES ════════════════════════════════════════════════════ */}
      <section id="insider" className="relative section-pad overflow-hidden"
        style={{ background: '#0B1628', borderTop: '1px solid rgba(200,168,75,0.15)', borderBottom: '1px solid rgba(200,168,75,0.1)' }}>

        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% -5%, rgba(200,168,75,0.09) 0%, transparent 70%)',
        }} />

        <div className="container relative">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-14 md:mb-16 items-end">
            <div className="reveal">
              <p className="kicker mb-8">The Insider Series</p>
              <h2 className="heading-section" style={{ fontSize: 'clamp(28px,5vw,60px)', color: '#F2EFE8' }}>
                One practitioner.<br />One real decision.<br />
                <em className="italic" style={{ color: '#C8A84B' }}>
                  No version for the classroom.
                </em>
              </h2>
            </div>

            <div className="reveal rv-d2 flex flex-col justify-end gap-6 pb-2 md:pb-0">
              <p style={{ fontSize: 'clamp(13px,1.3vw,16px)', color: 'rgba(242,239,232,0.5)', lineHeight: 1.85, maxWidth: '420px' }}>
                Every significant financial decision has a room behind it — where conviction is tested, where deals live or die, and where judgment matters more than any model. The Insider Series is your way in.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/events" className="btn btn-amber">
                  <span>View Upcoming Sessions</span>
                  <span>→</span>
                </Link>
              </div>
              <p className="text-[10px] tracking-[0.16em] uppercase mt-2 mb-4 md:mb-0" style={{ color: 'rgba(242,239,232,0.4)' }}>
                Free to attend · Live sessions · By application only
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            {[
              {
                n: '01',
                title: 'A real decision, not a case study',
                body: 'Every detail that gets removed to make something teachable is the detail that matters most. Nothing is sanitised here.',
              },
              {
                n: '02',
                title: 'The layer above the technical',
                body: 'What shifts a room. What the model missed. The judgment that separates those who understand finance from those who practise it.',
              },
              {
                n: '03',
                title: 'Access that compounds',
                body: 'One session is a perspective shift. A year of sessions is a different career trajectory.',
              },
            ].map(({ n, title, body }, i) => (
              <div
                key={n}
                className="reveal flex flex-col gap-3 py-8 md:py-10 px-0 md:px-8 border-b last:border-b-0 md:border-b-0 md:border-r last:border-r-0"
                style={{ borderColor: 'rgba(255,255,255,0.07)', transitionDelay: `${i * 0.12}s` }}
              >
                <span className="block mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '48px', fontWeight: 300, color: 'rgba(200,168,75,0.12)', lineHeight: 1 }}>
                  {n}
                </span>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(18px,1.6vw,22px)', fontWeight: 400, color: '#F2EFE8', lineHeight: 1.2 }}>
                  {title}
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(242,239,232,0.48)', lineHeight: 1.78 }}>
                  {body}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}
