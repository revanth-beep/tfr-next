import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatDate, formatTime, getSeatsRemaining } from '@/lib/utils'
import { RegistrationForm } from '@/components/registration-form'
import Link from 'next/link'

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
  const [event, session] = await Promise.all([
    prisma.event.findUnique({
      where: { slug: params.slug },
      include: { _count: { select: { registrations: true } } },
    }),
    getServerSession(authOptions),
  ])

  if (!event || !event.isPublished) notFound()

  const practitioner = event.practitioner
    ? JSON.parse(event.practitioner as string) as {
        name?: string; title?: string; company?: string; experience?: string; bio?: string
      }
    : null

  const registered = event._count.registrations
  const seatsLeft  = getSeatsRemaining(event.totalSeats, registered)
  const full       = seatsLeft <= 0
  const pct        = Math.round((registered / event.totalSeats) * 100)

  let isRegistered = false
  if (session?.user?.id) {
    const reg = await prisma.registration.findUnique({
      where: { eventId_userId: { eventId: event.id, userId: session.user.id } },
    })
    isRegistered = !!reg
  }

  return (
    <>
      {/* Hero */}
      <section
        className="relative pt-28 md:pt-36 pb-16 md:pb-20"
        style={{ background: '#08080F' }}
      >
          <div className="container relative z-10">
          <Link
            href="/events"
            className="event-back-link inline-flex items-center gap-2 mb-8 text-[11px] tracking-[0.16em] uppercase"
          >
            <span>←</span> All Events
          </Link>

          <h1
            className="heading-section mb-4"
            style={{ fontSize: 'clamp(32px, 5vw, 68px)', color: '#F2EFE8', maxWidth: '800px' }}
          >
            {event.title}
          </h1>
          {event.subtitle && (
            <p
              className="font-serif italic mb-8"
              style={{
                fontSize: 'clamp(16px, 2vw, 24px)',
                color: 'rgba(242,239,232,0.55)',
                lineHeight: 1.5,
                maxWidth: '640px',
              }}
            >
              {event.subtitle}
            </p>
          )}

          {/* Meta strip */}
          <div className="flex flex-wrap gap-6">
            {[
              { icon: '📅', label: formatDate(new Date(event.date)) },
              { icon: '🕐', label: `${formatTime(new Date(event.date))} IST` },
              { icon: '💻', label: event.format },
              { icon: '⏱',  label: `${event.duration} min` },
              { icon: '💺', label: full ? 'Full' : `${seatsLeft} seats left` },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span style={{ fontSize: '13px' }}>{icon}</span>
                <span
                  className="text-[13px] font-medium"
                  style={{ color: 'rgba(242,239,232,0.65)' }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section style={{ background: '#08080F', paddingBottom: '120px' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Left — content (2 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-12">

              {/* Cover note / pull quote */}
              {event.coverNote && (
                <blockquote
                  className="pl-6 font-serif italic"
                  style={{
                    borderLeft: '2px solid rgba(200,168,75,0.4)',
                    fontSize: 'clamp(18px, 2vw, 24px)',
                    color: 'rgba(242,239,232,0.72)',
                    lineHeight: 1.6,
                  }}
                >
                  {event.coverNote}
                </blockquote>
              )}

              {/* Description */}
              <div>
                <h2
                  className="font-display font-bold mb-5 text-[11px] tracking-[0.22em] uppercase"
                  style={{ color: '#C8A84B' }}
                >
                  About this session
                </h2>
                <div
                  className="prose"
                  style={{
                    fontSize: 'clamp(14px, 1.3vw, 16px)',
                    color: 'rgba(242,239,232,0.62)',
                    lineHeight: 1.85,
                  }}
                >
                  {event.description.split('\n\n').map((para, i) => (
                    <p key={i} className="mb-4">{para}</p>
                  ))}
                </div>
              </div>

              {/* Format breakdown */}
              <div
                className="border-t pt-10"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
              >
                <h2
                  className="text-[11px] tracking-[0.22em] uppercase mb-6"
                  style={{ color: '#C8A84B' }}
                >
                  What to expect
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { n: '01', text: 'One practitioner per session' },
                    { n: '02', text: `A small group — never more than ${event.totalSeats}` },
                    { n: '03', text: 'A real scenario. Your judgment, tested.' },
                    { n: '04', text: `${event.duration} minutes. No recordings.` },
                    { n: '05', text: 'By application only.' },
                    { n: '06', text: 'Built around public or hypothetical situations.' },
                  ].map(({ n, text }) => (
                    <div
                      key={n}
                      className="flex gap-4 py-4 border-b"
                      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                    >
                      <span
                        className="shrink-0 text-[10px] tracking-[0.14em] font-bold"
                        style={{ color: 'rgba(200,168,75,0.5)', paddingTop: '2px' }}
                      >
                        {n}
                      </span>
                      <span className="text-[14px]" style={{ color: 'rgba(242,239,232,0.65)', lineHeight: 1.65 }}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practitioner */}
              {practitioner && (
                <div
                  className="border-t pt-10"
                  style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                >
                  <h2
                    className="text-[11px] tracking-[0.22em] uppercase mb-6"
                    style={{ color: '#C8A84B' }}
                  >
                    The practitioner
                  </h2>
                  <div
                    className="flex gap-6 p-8 border"
                    style={{
                      borderColor: 'rgba(200,168,75,0.15)',
                      background: 'rgba(200,168,75,0.04)',
                    }}
                  >
                    <div
                      className="shrink-0 flex items-center justify-center"
                      style={{
                        width: 64, height: 64,
                        background: 'rgba(200,168,75,0.1)',
                        border: '1px solid rgba(200,168,75,0.25)',
                      }}
                    >
                      {practitioner.name ? (
                        <span
                          className="font-display font-bold text-[20px]"
                          style={{ color: '#C8A84B' }}
                        >
                          {practitioner.name.charAt(0)}
                        </span>
                      ) : (
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="rgba(200,168,75,0.6)" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                        </svg>
                      )}
                    </div>
                    <div>
                      {practitioner.name ? (
                        <p className="font-display font-bold text-[17px] mb-1" style={{ color: '#F2EFE8' }}>
                          {practitioner.name}
                        </p>
                      ) : (
                        <p className="font-serif italic text-[14px] mb-1" style={{ color: 'rgba(242,239,232,0.45)' }}>
                          Identity disclosed to confirmed attendees
                        </p>
                      )}
                      {practitioner.title && (
                        <p className="text-[13px] mb-1" style={{ color: 'rgba(242,239,232,0.6)' }}>
                          {practitioner.title}
                          {practitioner.company && ` · ${practitioner.company}`}
                        </p>
                      )}
                      {practitioner.experience && (
                        <p className="text-[12px] mb-3" style={{ color: 'rgba(200,168,75,0.7)' }}>
                          {practitioner.experience}
                        </p>
                      )}
                      {practitioner.bio && (
                        <p className="text-[13.5px]" style={{ color: 'rgba(242,239,232,0.52)', lineHeight: 1.72 }}>
                          {practitioner.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right — registration sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <div
                  className="border p-8 flex flex-col gap-8"
                  style={{
                    borderColor: 'rgba(200,168,75,0.2)',
                    background: 'rgba(200,168,75,0.03)',
                  }}
                >
                  <div>
                    <p
                      className="text-[10px] tracking-[0.22em] uppercase mb-3"
                      style={{ color: '#C8A84B' }}
                    >
                      Reserve your seat
                    </p>

                    {/* Seat bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px]" style={{ color: 'rgba(242,239,232,0.55)' }}>
                          {seatsLeft} of {event.totalSeats} seats remaining
                        </span>
                        {seatsLeft <= 5 && seatsLeft > 0 && (
                          <span
                            className="text-[9px] tracking-[0.18em] uppercase px-2 py-0.5"
                            style={{
                              background: 'rgba(200,168,75,0.12)',
                              color: '#C8A84B',
                              border: '1px solid rgba(200,168,75,0.25)',
                            }}
                          >
                            Almost full
                          </span>
                        )}
                      </div>
                      <div
                        className="h-1 w-full rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.07)' }}
                      >
                        <div
                          className="h-full"
                          style={{
                            width: `${pct}%`,
                            background: pct > 80 ? '#C84B4B' : '#C8A84B',
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[12px]" style={{ color: 'rgba(242,239,232,0.45)' }}>
                        {formatDate(new Date(event.date))} at {formatTime(new Date(event.date))} IST
                      </span>
                    </div>
                    <span
                      className="inline-block text-[11px] tracking-[0.14em] uppercase px-2 py-1"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: 'rgba(242,239,232,0.5)',
                      }}
                    >
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
