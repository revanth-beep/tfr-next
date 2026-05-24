import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { EventForm } from '@/components/admin/event-form'
import Link from 'next/link'

interface Props {
  params: { id: string }
}

export default async function EditEventPage({ params }: Props) {
  const event = await prisma.event.findUnique({ where: { id: params.id } })
  if (!event) notFound()

  return (
    <div className="min-h-screen" style={{ background: '#09162A' }}>
      <div
        className="border-b px-12 py-5 flex items-center gap-4"
        style={{ background: '#0F0F1A', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <Link href="/admin" className="text-[11px] tracking-[0.12em] uppercase" style={{ color: 'rgba(242,239,232,0.4)' }}>
          ← Admin
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
        <span className="text-[11px] tracking-[0.12em] uppercase" style={{ color: 'rgba(242,239,232,0.6)' }}>
          Edit event
        </span>
      </div>
      <div className="max-w-5xl mx-auto px-12 py-12">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="font-display font-bold text-[28px]" style={{ color: '#F2EFE8' }}>
              Edit Event
            </h1>
            <p className="text-[13px] mt-1" style={{ color: 'rgba(242,239,232,0.4)' }}>
              {event.title}
            </p>
          </div>
          <Link
            href={`/events/${event.slug}`}
            className="btn btn-ghost-dark text-[10px]"
            style={{  }}
          >
            <span>View live →</span>
          </Link>
        </div>
        <EventForm event={event} />
      </div>
    </div>
  )
}
