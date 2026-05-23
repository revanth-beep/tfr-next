import Link from 'next/link'
import { prisma } from '@/lib/db'
import { formatTime } from '@/lib/utils'
import { Ticker } from '@/components/ticker'
import { GoogleRegisterButton } from '@/components/google-register-button'

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

// ─── Illustrations ─────────────────────────────────────────────────────────────

function NetworkIllustration() {
  return (
    <svg viewBox="0 0 480 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="270" cy="210" r="200" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
      <circle cx="270" cy="210" r="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 8" />
      <circle cx="270" cy="210" r="100" stroke="rgba(200,168,75,0.1)"   strokeWidth="1" />
      <circle cx="270" cy="210" r="52"  stroke="rgba(200,168,75,0.18)"  strokeWidth="1" strokeDasharray="2 6" />
      <circle cx="270" cy="210" r="22" fill="rgba(200,168,75,0.08)" />
      <circle cx="270" cy="210" r="10" fill="rgba(200,168,75,0.22)" />
      <circle cx="270" cy="210" r="4"  fill="#C8A84B" />
      {[
        { cx: 270, cy: 58,  r: 5,   o: 0.7 },
        { cx: 404, cy: 130, r: 4,   o: 0.5 },
        { cx: 420, cy: 286, r: 5.5, o: 0.75},
        { cx: 320, cy: 384, r: 3.5, o: 0.4 },
        { cx: 148, cy: 360, r: 4.5, o: 0.6 },
        { cx: 80,  cy: 200, r: 4,   o: 0.5 },
        { cx: 134, cy: 76,  r: 4,   o: 0.6 },
      ].map((n, i) => (
        <g key={i}>
          <line x1="270" y1="210" x2={n.cx} y2={n.cy} stroke="rgba(200,168,75,0.1)" strokeWidth="0.8" />
          <circle cx={n.cx} cy={n.cy} r={n.r+8} fill={`rgba(200,168,75,${n.o*0.06})`} />
          <circle cx={n.cx} cy={n.cy} r={n.r}   fill={`rgba(200,168,75,${n.o})`} />
        </g>
      ))}
      {[
        {x1:270,y1:58,x2:404,y2:130},{x1:404,y1:130,x2:420,y2:286},
        {x1:80,y1:200,x2:148,y2:360},{x1:134,y1:76,x2:270,y2:58},
      ].map((l,i)=>(
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(255,255,255,0.035)" strokeWidth="0.6" />
      ))}
      {[{cx:192,cy:142,r:1.5},{cx:342,cy:96,r:1},{cx:362,cy:318,r:1.5},
        {cx:158,cy:292,r:1},{cx:226,cy:328,r:1.2},{cx:310,cy:142,r:1}].map((p,i)=>(
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="rgba(255,255,255,0.2)" />
      ))}
    </svg>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

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
      {/* ═══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: '#08080F' }}>
        <div className="container relative z-10 pt-24 pb-20 md:pt-28 md:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-6 md:gap-8">
            <p className="kicker">Online · By Application Only</p>

            <h1 className="heading-display" style={{ fontSize: 'clamp(44px,8vw,108px)', color:'#F2EFE8' }}>
              <span className="block">The room you</span>
              <span className="block">were never</span>
              <span className="block" style={{ color:'#C8A84B' }}>told about.</span>
            </h1>

            <p className="font-serif italic" style={{
              fontSize:'clamp(15px,1.7vw,20px)', color:'rgba(242,239,232,0.6)', lineHeight:1.65
            }}>
              Practitioner-led. Community-driven.<br />
              Built for serious finance careers.
            </p>

            <p style={{ fontSize:'clamp(13px,1.2vw,15px)', color:'rgba(242,239,232,0.45)', lineHeight:1.8, maxWidth:'420px' }}>
              The most valuable knowledge in finance is never written down.
              It lives inside people. It moves through proximity.
              It rarely reaches most people.
            </p>

            <div className="flex flex-wrap gap-3 md:gap-4">
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
          </div>

          <div className="hidden lg:flex items-center justify-center" style={{ height:'440px' }}>
            <NetworkIllustration />
          </div>
        </div>

      </section>

      {/* ═══ TICKER ════════════════════════════════════════════════════════════ */}
      <Ticker />

      {/* ═══ FEATURED EVENT ════════════════════════════════════════════════════ */}
      <section id="events" className="section-pad" style={{ background: '#08080F' }}>
        <div className="container">
          <p className="kicker mb-10">Upcoming Session</p>

          {event ? (
            <Link href={`/events/${event.slug}`} className="block" style={{ textDecoration: 'none' }}>
              <div className="flex flex-col md:flex-row" style={{ border: '1px solid rgba(200,168,75,0.4)', overflow: 'hidden' }}>

                {/* ── Date panel (amber) ──────────────────────────── */}
                <div className="shrink-0 border-b md:border-b-0 md:border-r"
                  style={{ background: '#C8A84B', borderColor: 'rgba(8,8,15,0.15)' }}>
                  {/* Mobile: horizontal strip */}
                  <div className="flex items-center gap-5 px-8 py-5 md:hidden">
                    <span className="font-display font-bold" style={{ fontSize: '52px', lineHeight: 1, color: '#08080F' }}>
                      {eventDay}
                    </span>
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: 'rgba(8,8,15,0.52)' }}>{eventMonth}</p>
                      <p className="text-[11px] tracking-[0.18em] mt-0.5" style={{ color: 'rgba(8,8,15,0.38)' }}>{eventYear}</p>
                    </div>
                  </div>
                  {/* Desktop: vertical column */}
                  <div className="hidden md:flex flex-col items-center justify-center text-center px-10"
                    style={{ minWidth: 184, minHeight: 260 }}>
                    <p className="text-[10px] font-bold tracking-[0.32em] uppercase mb-3" style={{ color: 'rgba(8,8,15,0.48)' }}>{eventMonth}</p>
                    <p className="font-display font-bold" style={{ fontSize: '80px', lineHeight: 0.88, color: '#08080F' }}>{eventDay}</p>
                    <p className="text-[10px] tracking-[0.2em] mt-3" style={{ color: 'rgba(8,8,15,0.38)' }}>{eventYear}</p>
                  </div>
                </div>

                {/* ── Content panel ──────────────────────────────── */}
                <div className="flex flex-1 flex-col p-6 md:p-10" style={{ background: '#0C0B18' }}>

                  {/* Status + tags */}
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
                      <span style={{ fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '4px 10px', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(242,239,232,0.38)' }}>Online</span>
                    </div>
                  </div>

                  {/* Title + subtitle */}
                  <h2 className="heading-section mb-3" style={{ fontSize: 'clamp(22px,3.8vw,48px)', color: '#F2EFE8' }}>
                    {event.title}
                  </h2>
                  {event.subtitle && (
                    <p className="font-serif italic" style={{ fontSize: 'clamp(13px,1.4vw,17px)', color: 'rgba(242,239,232,0.48)', lineHeight: 1.65 }}>
                      {event.subtitle}
                    </p>
                  )}

                  <div className="flex-1 min-h-[32px]" />

                  {/* Footer: meta + CTA */}
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
            <div className="border p-12 md:p-16 text-center" style={{ borderColor:'rgba(255,255,255,0.07)', borderStyle:'dashed' }}>
              <p className="font-serif italic text-[20px] mb-3" style={{ color:'rgba(242,239,232,0.35)' }}>
                The next session is being curated.
              </p>
              <p className="text-[12px] tracking-[0.14em] uppercase" style={{ color:'rgba(242,239,232,0.2)' }}>
                Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ═══ INSIDER SERIES ════════════════════════════════════════════════════ */}
      <section id="insider" className="relative section-pad overflow-hidden"
        style={{ background: '#07070F', borderTop: '1px solid rgba(200,168,75,0.15)', borderBottom: '1px solid rgba(200,168,75,0.1)' }}>

        {/* Ambient amber glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 55% at 50% -5%, rgba(200,168,75,0.09) 0%, transparent 70%)',
        }} />

        <div className="container relative">

          {/* Header row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 mb-14 md:mb-16 items-end">
            <div>
              <p className="kicker mb-8">The Insider Series</p>
              <h2 className="heading-section" style={{ fontSize: 'clamp(28px,5vw,66px)', color: '#F2EFE8' }}>
                One practitioner.<br />One real decision.<br />
                <em className="font-serif font-normal italic" style={{ color: '#C8A84B' }}>
                  No version for the classroom.
                </em>
              </h2>
            </div>

            <div className="flex flex-col justify-end gap-6">
              <p style={{ fontSize: 'clamp(13px,1.3vw,16px)', color: 'rgba(242,239,232,0.5)', lineHeight: 1.85, maxWidth: '420px' }}>
                Each session brings one senior practitioner into a closed room with a
                small, vetted group. One live session. One question: how does an
                experienced practitioner actually think?
              </p>
              <div className="flex items-center gap-4">
                <Link href="/events" className="btn btn-amber">
                  <span>View Upcoming Sessions</span>
                  <span>→</span>
                </Link>
              </div>
              <p className="text-[10px] tracking-[0.16em] uppercase" style={{ color: 'rgba(242,239,232,0.25)' }}>
                Free to attend · Online · By application
              </p>
            </div>
          </div>

          {/* Three pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            {[
              {
                n: '01',
                title: 'Unsanitized decision-making',
                body: 'Not the polished retrospective. The actual judgment calls — including the ones that were hard to make.',
              },
              {
                n: '02',
                title: 'How experienced professionals think',
                body: 'The instincts and pattern recognition that come only from years of real exposure across cycles and situations.',
              },
              {
                n: '03',
                title: 'Access is the actual asset',
                body: 'Two hours with the right person can reshape your professional trajectory more than a year of coursework.',
              },
            ].map(({ n, title, body }) => (
              <div
                key={n}
                className="flex flex-col gap-3 py-8 md:py-10 px-0 md:px-8 border-b md:border-b-0 md:border-r last:border-r-0"
                style={{ borderColor: 'rgba(255,255,255,0.07)' }}
              >
                <span className="font-display font-bold block mb-1 text-[10px] tracking-[0.22em]"
                  style={{ color: 'rgba(200,168,75,0.55)' }}>
                  {n}
                </span>
                <p className="font-display font-medium"
                  style={{ fontSize: 'clamp(14px,1.5vw,17px)', color: '#F2EFE8', lineHeight: 1.2 }}>
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

      {/* ═══ PRINCIPLES ════════════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background:'#08080F' }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l" style={{ borderColor:'rgba(255,255,255,0.07)' }}>
            {[
              { n:'01', text:'Finance is not learned in classrooms.' },
              { n:'02', text:'The best network knows more than you.' },
              { n:'03', text:'Judgment cannot be modelled.' },
              { n:'04', text:'Access is the actual asset.' },
            ].map(({ n, text }) => (
              <div key={n} className="group relative p-6 md:p-12 border-b border-r overflow-hidden transition-colors"
                style={{ borderColor:'rgba(255,255,255,0.07)' }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background:'rgba(200,168,75,0.03)' }} />
                <div className="font-display font-bold select-none mb-4"
                  style={{ fontSize:'clamp(60px,9vw,120px)', color:'rgba(242,239,232,0.04)', letterSpacing:'-0.04em', lineHeight:0.9 }}>
                  {n}
                </div>
                <p className="relative font-display" style={{
                  fontSize:'clamp(16px,2vw,24px)', fontWeight:500,
                  color:'#F2EFE8', lineHeight:1.25, letterSpacing:'-0.01em',
                }}>
                  {text}
                </p>
                <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                  style={{ background:'#C8A84B' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHO IT'S FOR ══════════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background:'#0B0B16' }}>
        <div className="container">
          <div className="max-w-[700px] mx-auto text-center mb-12 md:mb-14">
            <p className="kicker justify-center mb-8" style={{ justifyContent:'center' }}>
              Who it&#39;s for
            </p>
            <h2 className="heading-section mb-6" style={{ fontSize:'clamp(24px,4vw,54px)', color:'#F2EFE8' }}>
              For those who have done the work —<br />
              <em className="font-serif font-normal italic" style={{ color:'#C8A84B' }}>
                and are ready for what the work doesn&#39;t teach.
              </em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t" style={{ borderColor:'rgba(255,255,255,0.07)' }}>
            {[
              {
                tag: 'Early career',
                head: "You've learned the models and frameworks.",
                body: "But you know that's not enough. If you have a point of view, you will thrive. If you're still waiting for one, this is not your room yet.",
              },
              {
                tag: 'Practitioners',
                head: 'People who have spent years making real decisions.',
                body: 'Across cycles. Across situations. Not here to give a talk — but to show how they approach work to people who can engage at that level.',
              },
            ].map(({ tag, head, body }) => (
              <div key={tag} className="p-6 md:p-12 border-r last:border-r-0 border-b" style={{ borderColor:'rgba(255,255,255,0.07)' }}>
                <span className="inline-block text-[10px] tracking-[0.22em] uppercase px-3 py-1.5 mb-5"
                  style={{ background:'rgba(200,168,75,0.1)', color:'#C8A84B', border:'1px solid rgba(200,168,75,0.2)' }}>
                  {tag}
                </span>
                <h3 className="font-display mb-3" style={{ fontSize:'clamp(15px,1.8vw,20px)', fontWeight:500, color:'#F2EFE8' }}>
                  {head}
                </h3>
                <p style={{ fontSize:'14px', color:'rgba(242,239,232,0.52)', lineHeight:1.78 }}>{body}</p>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 font-serif italic text-[15px]" style={{ color:'rgba(242,239,232,0.4)' }}>
            Not filtered by seniority. Filtered by seriousness.
          </p>
        </div>
      </section>

      {/* ═══ FINAL CTA ═════════════════════════════════════════════════════════ */}
      <section className="section-pad" style={{ background:'#0B0B16', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div className="max-w-[600px] mx-auto text-center">
            <h2 className="heading-section mb-8" style={{ fontSize:'clamp(26px,4vw,52px)', color:'#F2EFE8' }}>
              Two ways to build{' '}
              <em className="font-serif font-normal italic" style={{ color:'#C8A84B' }}>judgment.</em>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-10 text-left">
              {[
                { label:'Learn slowly', items:['Make mistakes.','Figure it out over a decade.'], dim:true },
                { label:'Two hours in The Finance Room', items:['Or spend two hours','with someone who already has it.'], dim:false },
              ].map(({ label, items, dim }) => (
                <div key={label} className="p-5 md:p-6" style={{
                  background: dim ? 'rgba(255,255,255,0.02)' : 'rgba(200,168,75,0.06)',
                  border:`1px solid ${dim ? 'rgba(255,255,255,0.06)' : 'rgba(200,168,75,0.2)'}`,
                }}>
                  <p className="text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: dim ? 'rgba(242,239,232,0.28)' : '#C8A84B' }}>{label}</p>
                  {items.map(t => <p key={t} className="text-[13px] md:text-[14px] leading-relaxed" style={{ color: dim ? 'rgba(242,239,232,0.35)' : 'rgba(242,239,232,0.72)' }}>{t}</p>)}
                </div>
              ))}
            </div>

            <p className="mb-8 font-serif italic" style={{ fontSize:'clamp(15px,1.6vw,20px)', color:'rgba(242,239,232,0.6)' }}>
              Both paths work.{' '}
              <strong className="font-display font-bold not-italic" style={{ color:'#F2EFE8' }}>One is faster.</strong>
            </p>

            {event ? (
              <GoogleRegisterButton eventSlug={event.slug} isFull={seatsLeft <= 0} size="large" />
            ) : (
              <a
                href="https://instagram.com/thefinanceroom"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <span>Follow for Updates</span>
                <span>→</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
