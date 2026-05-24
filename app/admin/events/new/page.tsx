import { EventForm } from '@/components/admin/event-form'
import Link from 'next/link'

export default function NewEventPage() {
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
          New event
        </span>
      </div>
      <div className="max-w-5xl mx-auto px-12 py-12">
        <h1 className="font-display font-bold text-[28px] mb-10" style={{ color: '#F2EFE8' }}>
          Create Event
        </h1>
        <EventForm />
      </div>
    </div>
  )
}
