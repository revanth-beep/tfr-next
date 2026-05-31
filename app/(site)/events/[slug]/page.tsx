import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatDate, formatTime, getSeatsRemaining } from '@/lib/utils'
import { RegistrationForm } from '@/components/registration-form'
import { HeroReveal } from '@/components/hero-reveal'
import Link from 'next/link'
import { getHomepageContent } from '@/lib/homepage'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props) {
  const event = await prisma.event.findUnique({ where: { slug: params.slug } })
  if (!event) return {}
  return {
    title: `${event.title} — The Finance Room`,
    description: event.subtitle ?? event.description?.slice(0, 160),
  }
}

export default async function EventPage({ params }: Props) {
  const [event, session, content] = await Promise.all([
    prisma.event.findUnique({
      where: { slug: params.slug },
      include: { _count: { select: { registrations: true } } },
    }),
    getServerSession(authOptions),
    getHomepageContent(),
  ])

  if (!event || !event.isPublished) notFound()

  const practitioner = event.practitioner
    ? JSON.parse(event.practitioner as string) as {
        name?: string; title?: string; company?: string; experience?: string; bio?: string; attributes?: string[]
      }
    : null

  const descParas = event.description.split('\n\n').filter(Boolean)

  const isPast     = new Date(event.date) < new Date()
  const registered = event._count.registrations
  const seatsLeft  = getSeatsRemaining(event.totalSeats, registered)
  const full       = seatsLeft <= 0
  const pct        = Math.round((registered / event.totalSeats) * 100)

  const whatToExpectItems = (event as any).whatToExpect
    ? ((event as any).whatToExpect as string)
        .split('\n').map((t: string) => t.trim()).filter(Boolean)
        .map((text: string, i: number) => ({ n: String(i + 1).padStart(2, '0'), text }))
    : [
        { n: '01', text: 'One practitioner per session' },
        { n: '02', text: `A small group — never more than ${event.totalSeats}` },
        { n: '03', text: 'A real scenario. Your judgment, tested.' },
        { n: '04', text: `${event.duration} minutes. No recordings.` },
        { n: '05', text: 'By application only.' },
        { n: '06', text: 'Built around public or hypothetical situations.' },
      ]

  let isRegistered = false
  if (!isPast && session?.user?.id) {
    const reg = await prisma.registration.findUnique({
      where: { eventId_userId: { eventId: event.id, userId: session.user.id } },
    })
    isRegistered = !!reg
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-10 md:pt-14 xl:pt-16 pb-14 md:pb-16 xl:pb-20"
        style={{ background: 'var(--color-bg)' }}
      >
        <div className="container relative z-10">
          <HeroReveal>
            <Link
              href="/events"
              className="event-back-link inline-flex items-center gap-2 mb-8 text-[11px] tracking-[0.16em] uppercase"
            >
              <span>←</span> All Events
            </Link>

            <h1
              className="heading-section mb-4"
              style={{ fontSize: 'clamp(32px, 5vw, 68px)', color: 'var(--color-text)', maxWidth: '820px' }}
            >
              {event.title}
            </h1>

            {event.subtitle && (
              <p
                className="font-serif italic mb-8"
                style={{
                  fontSize: 'clamp(17px, 2vw, 24px)',
                  color: 'rgba(242,239,232,0.82)',
                  lineHeight: 1.55,
                  maxWidth: '640px',
                }}
              >
                {event.subtitle}
              </p>
            )}

            {/* Meta strip */}
            <div className="flex flex-wrap gap-3 md:gap-6">
              {[
                { icon: '📅', label: formatDate(new Date(event.date)) },
                { icon: '🕐', label: `${formatTime(new Date(event.date))} IST` },
                { icon: '💻', label: event.format },
                { icon: '⏱',  label: `${event.duration} min` },
                ...(!isPast
                  ? [{ icon: '💺', label: full ? 'Full' : `${seatsLeft} seats left` }]
                  : [{ icon: '👥', label: `${registered} attended` }]),
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span style={{ fontSize: '13px' }}>{icon}</span>
                  <span className="text-[13px] font-medium" style={{ color: 'rgba(242,239,232,0.88)' }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </HeroReveal>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <section style={{ background: 'var(--color-bg)', paddingBottom: 'clamp(48px, 7vw, 100px)' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left — content (2 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-12">

              {/* ── Practitioner card (always anonymous) ───────────────── */}
              {practitioner && (
                <div
                  className="flex flex-col gap-5 p-7"
                  style={{
                    border: '1px solid rgba(200,168,75,0.3)',
                    borderLeft: '3px solid var(--color-gold)',
                    background: 'linear-gradient(135deg, rgba(200,168,75,0.08) 0%, rgba(200,168,75,0.02) 100%)',
                  }}
                >
                  <p className="text-[10px] tracking-[0.24em] uppercase" style={{ color: 'var(--color-gold)' }}>
                    {content.eventLabelPractitioner}
                  </p>

                  <div className="flex items-start gap-5">
                    {/* Anonymous avatar — always */}
                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{
                        width: 64, height: 64,
                        background: 'rgba(200,168,75,0.12)',
                        border: '1px solid rgba(200,168,75,0.35)',
                      }}
                    >
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="rgba(200,168,75,0.8)" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                      </svg>
                    </div>

                    <div className="flex flex-col gap-2">
                      {practitioner.name ? (
                        <p className="font-display font-bold text-[20px]" style={{ color: 'var(--color-text)' }}>
                          {practitioner.name}
                        </p>
                      ) : (
                        <p className="font-serif italic text-[15px]" style={{ color: 'rgba(242,239,232,0.82)', lineHeight: 1.5 }}>
                          {content.eventLabelIdentity}
                        </p>
                      )}
                      {(practitioner.title || practitioner.company) && (
                        <p className="text-[14px]" style={{ color: 'var(--color-text)' }}>
                          {practitioner.title}
                          {practitioner.company && (
                            <span style={{ color: 'rgba(242,239,232,0.75)' }}> · {practitioner.company}</span>
                          )}
                        </p>
                      )}
                      {practitioner.experience && (
                        <span
                          className="text-[11px] tracking-[0.1em] self-start px-2.5 py-1"
                          style={{
                            background: 'rgba(200,168,75,0.12)',
                            border: '1px solid rgba(200,168,75,0.3)',
                            color: 'var(--color-gold)',
                          }}
                        >
                          {practitioner.experience}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bio + attributes */}
                  {(practitioner.bio || (practitioner.attributes && practitioner.attributes.length > 0)) && (
                    <div className="flex flex-col gap-3 pt-5" style={{ borderTop: '1px solid rgba(200,168,75,0.12)' }}>
                      {practitioner.bio && (
                        <p className="text-[14px]" style={{ color: 'rgba(242,239,232,0.78)', lineHeight: 1.8 }}>
                          {practitioner.bio}
                        </p>
                      )}
                      {practitioner.attributes && practitioner.attributes.length > 0 && (
                        <div className="flex flex-col">
                          {practitioner.attributes.map((attr, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 py-2.5 border-b text-[14px]"
                              style={{ borderColor: 'rgba(255,255,255,0.07)', color: 'rgba(242,239,232,0.85)', lineHeight: 1.65 }}
                            >
                              <span style={{ color: 'var(--color-gold)', flexShrink: 0 }}>—</span>
                              <span>{attr}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Cover note / pull quote ─────────────────────────────── */}
              {event.coverNote && (
                <blockquote
                  className="pl-6 font-serif italic"
                  style={{
                    borderLeft: '2px solid rgba(200,168,75,0.5)',
                    fontSize: 'clamp(18px, 2vw, 24px)',
                    color: 'rgba(242,239,232,0.9)',
                    lineHeight: 1.6,
                  }}
                >
                  {event.coverNote}
                </blockquote>
              )}

              {/* ── Description ────────────────────────────────────────── */}
              {descParas.length >= 2 && (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  {[
                    { label: content.eventLabelCovers, para: descParas[0] },
                    { label: content.eventLabelWho, para: descParas[1] },
                  ].map(({ label, para }) => (
                    <div
                      key={label}
                      className="py-8 sm:pr-8 sm:border-r last:border-r-0 last:pl-0 sm:last:pl-8 sm:last:pr-0"
                      style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                    >
                      <h2 className="text-[10px] tracking-[0.24em] uppercase mb-4" style={{ color: 'var(--color-gold)' }}>
                        {label}
                      </h2>
                      <p style={{ fontSize: 'clamp(14px, 1.3vw, 16px)', color: 'rgba(242,239,232,0.82)', lineHeight: 1.85 }}>
                        {para}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {descParas.length > 2 && (
                <div className="border-t pt-8" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: 'clamp(14px, 1.3vw, 16px)', color: 'rgba(242,239,232,0.82)', lineHeight: 1.85 }}>
                    {descParas.slice(2).map((para, i) => (
                      <p key={i} className="mb-4">{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {descParas.length === 1 && (
                <div>
                  <h2 className="text-[10px] tracking-[0.24em] uppercase mb-5" style={{ color: 'var(--color-gold)' }}>
                    {content.eventLabelAbout}
                  </h2>
                  <p style={{ fontSize: 'clamp(14px, 1.3vw, 16px)', color: 'rgba(242,239,232,0.82)', lineHeight: 1.85 }}>
                    {descParas[0]}
                  </p>
                </div>
              )}

              {/* ── What to expect ──────────────────────────────────────── */}
              <div className="border-t pt-10" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <h2 className="text-[10px] tracking-[0.24em] uppercase mb-6" style={{ color: 'var(--color-gold)' }}>
                  {content.eventLabelExpect}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {whatToExpectItems.map(({ n, text }) => (
                    <div key={n} className="flex gap-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                      <span className="shrink-0 text-[10px] tracking-[0.14em] font-bold" style={{ color: 'rgba(200,168,75,0.6)', paddingTop: '2px' }}>
                        {n}
                      </span>
                      <span className="text-[14px]" style={{ color: 'rgba(242,239,232,0.85)', lineHeight: 1.65 }}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Right — sidebar ──────────────────────────────────────── */}
            <div className="lg:col-span-1 order-first lg:order-none">
              <div className="sticky" style={{ top: 'calc(var(--chrome-h) + 24px)' }}>

                {isPast ? (
                  <div
                    className="border p-8 flex flex-col gap-6"
                    style={{ borderColor: 'rgba(124,185,217,0.35)', background: 'rgba(124,185,217,0.06)' }}
                  >
                    <div>
                      <span className="text-[9px] tracking-[0.24em] uppercase px-2.5 py-1 mb-4 inline-block"
                        style={{ color: 'var(--color-text)', border: '1px solid rgba(242,239,232,0.3)', background: 'rgba(255,255,255,0.07)' }}>
                        Session concluded
                      </span>
                      <p className="text-[13px] leading-relaxed mt-3" style={{ color: 'rgba(124,185,217,0.92)' }}>
                        {formatDate(new Date(event.date))} · {event.duration} min · {registered} attended
                      </p>
                    </div>
                    {event.recordingUrl ? (
                      <a
                        href={event.recordingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost w-full justify-center"
                      >
                        <span>Watch recording</span>
                        <span>↗</span>
                      </a>
                    ) : (
                      <p className="text-[12px] font-serif italic" style={{ color: 'rgba(124,185,217,0.75)' }}>
                        Recording not available.
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    className="border p-8 flex flex-col gap-8"
                    style={{ borderColor: 'rgba(200,168,75,0.2)', background: 'rgba(200,168,75,0.03)' }}
                  >
                    <div>
                      <p className="text-[10px] tracking-[0.22em] uppercase mb-3" style={{ color: 'var(--color-gold)' }}>
                        Reserve your seat
                      </p>

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px]" style={{ color: 'rgba(242,239,232,0.8)' }}>
                            {seatsLeft} of {event.totalSeats} seats remaining
                          </span>
                          {seatsLeft <= 5 && seatsLeft > 0 && (
                            <span className="text-[9px] tracking-[0.18em] uppercase px-2 py-0.5"
                              style={{ background: 'rgba(200,168,75,0.12)', color: 'var(--color-gold)', border: '1px solid rgba(200,168,75,0.25)' }}>
                              Almost full
                            </span>
                          )}
                        </div>
                        <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                          <div className="h-full" style={{ width: `${pct}%`, background: pct > 80 ? '#C84B4B' : 'var(--color-gold)' }} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[13px]" style={{ color: 'rgba(242,239,232,0.75)' }}>
                          {formatDate(new Date(event.date))} at {formatTime(new Date(event.date))} IST
                        </span>
                      </div>
                      <span className="inline-block text-[11px] tracking-[0.14em] uppercase px-2 py-1"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(242,239,232,0.7)' }}>
                        {event.format} · {event.duration} min
                      </span>
                    </div>

                    <RegistrationForm
                      eventId={event.id}
                      isLoggedIn={!!session}
                      isRegistered={isRegistered}
                      isFull={full}
                      tracks={event.tracks ? event.tracks.split(',').map(t => t.trim()).filter(Boolean) : []}
                      userName={session?.user?.name ?? undefined}
                      userEmail={session?.user?.email ?? undefined}
                    />
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
