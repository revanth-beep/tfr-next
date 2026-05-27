import { prisma } from '@/lib/db'
import { formatDateShort } from '@/lib/utils'
import Link from 'next/link'
import { adminLogout } from '@/app/actions/admin'
import { DeleteEventButton } from '@/components/admin/delete-event-button'

export default async function AdminDashboard() {
  const events = await prisma.event.findMany({
    orderBy: { date: 'desc' },
    include: { _count: { select: { registrations: true } } },
  })

  return (
    <div className="min-h-screen" style={{ background: '#09162A' }}>
      {/* Admin header */}
      <div
        className="border-b px-12 py-5 flex items-center justify-between"
        style={{
          background: '#0F0F1A',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-6">
          <img
            src="/logo.png"
            alt="The Finance Room"
            className="h-6"
            style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }}
          />
          <span
            className="text-[11px] tracking-[0.2em] uppercase"
            style={{ color: 'rgba(242,239,232,0.4)' }}
          >
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin/homepage" className="text-[11px] tracking-[0.12em] uppercase" style={{ color: 'rgba(242,239,232,0.55)' }}>
            Homepage Content
          </Link>
          <Link href="/" className="text-[11px] tracking-[0.12em] uppercase" style={{ color: 'rgba(242,239,232,0.4)' }}>
            View site →
          </Link>
          <form action={adminLogout}>
            <button
              type="submit"
              className="text-[11px] tracking-[0.12em] uppercase"
              style={{ color: 'rgba(242,239,232,0.4)' }}
            >
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-12 py-12">
        {/* Page header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display font-bold text-[28px]" style={{ color: '#F2EFE8' }}>
              Events
            </h1>
            <p className="text-[13px] mt-1" style={{ color: 'rgba(242,239,232,0.4)' }}>
              {events.length} event{events.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Link href="/admin/events/new" className="btn btn-amber" style={{  }}>
            <span>+ New event</span>
          </Link>
        </div>

        {/* Events table */}
        {events.length === 0 ? (
          <div
            className="border p-16 text-center"
            style={{
              borderColor: 'rgba(255,255,255,0.08)',
              borderStyle: 'dashed',
            }}
          >
            <p className="font-serif italic text-[18px] mb-3" style={{ color: 'rgba(242,239,232,0.35)' }}>
              No events yet.
            </p>
            <Link href="/admin/events/new" className="btn btn-ghost" style={{  }}>
              <span>Create your first event</span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {events.map(event => {
              const seatsLeft = Math.max(0, event.totalSeats - event._count.registrations)
              const pct = Math.round((event._count.registrations / event.totalSeats) * 100)

              return (
                <div
                  key={event.id}
                  className="border p-6 flex items-center gap-6"
                  style={{
                    borderColor: 'rgba(255,255,255,0.08)',
                    background: '#0F0F1A',
                  }}
                >
                  {/* Status dot */}
                  <div
                    className="shrink-0 w-2 h-2 rounded-full"
                    style={{
                      background: event.isPublished
                        ? (event.isFeatured ? '#C8A84B' : 'rgba(80,200,120,0.8)')
                        : 'rgba(255,255,255,0.2)',
                    }}
                    title={
                      event.isPublished
                        ? event.isFeatured ? 'Featured' : 'Published'
                        : 'Draft'
                    }
                  />

                  {/* Event info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-display font-bold text-[16px] truncate"
                      style={{ color: '#F2EFE8' }}
                    >
                      {event.title}
                    </p>
                    <p className="text-[12px] mt-1 flex items-center gap-3" style={{ color: 'rgba(242,239,232,0.45)' }}>
                      <span>{formatDateShort(new Date(event.date))}</span>
                      <span>·</span>
                      <span>{event.format}</span>
                      {event.topic && (
                        <>
                          <span>·</span>
                          <span>{event.topic}</span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Registrations */}
                  <Link href={`/admin/events/${event.id}/registrations`} className="shrink-0 text-right group">
                    <p className="text-[14px] font-bold group-hover:underline" style={{ color: '#C8A84B' }}>
                      {event._count.registrations}
                      <span className="font-normal text-[12px]" style={{ color: 'rgba(242,239,232,0.3)' }}>
                        /{event.totalSeats}
                      </span>
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: 'rgba(242,239,232,0.3)' }}>
                      {seatsLeft} left · {pct}%
                    </p>
                  </Link>

                  {/* Badges */}
                  <div className="shrink-0 flex items-center gap-2">
                    {event.isFeatured && (
                      <span
                        className="text-[9px] tracking-[0.18em] uppercase px-2 py-0.5"
                        style={{
                          background: 'rgba(200,168,75,0.1)',
                          color: '#C8A84B',
                          border: '1px solid rgba(200,168,75,0.2)',
                        }}
                      >
                        Featured
                      </span>
                    )}
                    {!event.isPublished && (
                      <span
                        className="text-[9px] tracking-[0.18em] uppercase px-2 py-0.5"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          color: 'rgba(242,239,232,0.4)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        Draft
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-3">
                    <Link
                      href={`/events/${event.slug}`}
                      className="text-[11px] tracking-[0.1em] uppercase"
                      style={{ color: 'rgba(242,239,232,0.35)' }}
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="text-[11px] tracking-[0.1em] uppercase"
                      style={{ color: 'rgba(242,239,232,0.55)' }}
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}/registrations`}
                      className="text-[11px] tracking-[0.1em] uppercase"
                      style={{ color: '#C8A84B' }}
                    >
                      Registrations
                    </Link>
                    <DeleteEventButton eventId={event.id} eventTitle={event.title} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 flex items-center gap-6">
          {[
            { color: '#C8A84B', label: 'Featured' },
            { color: 'rgba(80,200,120,0.8)', label: 'Published' },
            { color: 'rgba(255,255,255,0.2)', label: 'Draft' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[11px]" style={{ color: 'rgba(242,239,232,0.35)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Homepage content */}
        <div className="mt-12">
          <h2 className="font-display font-bold text-[20px] mb-4" style={{ color: '#F2EFE8' }}>
            Content
          </h2>
          <Link
            href="/admin/homepage"
            className="border p-6 flex items-center justify-between group"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#0F0F1A' }}
          >
            <div>
              <p className="font-display font-bold text-[15px]" style={{ color: '#F2EFE8' }}>
                Homepage Copy
              </p>
              <p className="text-[12px] mt-1" style={{ color: 'rgba(242,239,232,0.4)' }}>
                Edit headlines, belief cards, and all body text on the homepage.
              </p>
            </div>
            <span className="text-[11px] tracking-[0.12em] uppercase" style={{ color: '#C8A84B' }}>
              Edit →
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
