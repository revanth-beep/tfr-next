export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

interface Props {
  params: { id: string }
}

export default async function EventRegistrationsPage({ params }: Props) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      registrations: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  if (!event) notFound()

  const regs = event.registrations

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <div
        className="border-b px-12 py-5 flex items-center gap-4"
        style={{ background: '#0F0F1A', borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <Link href="/admin" className="text-[11px] tracking-[0.12em] uppercase"
          style={{ color: 'rgba(242,239,232,0.35)' }}>
          ← Admin
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.12)' }}>/</span>
        <Link href={`/admin/events/${params.id}`} className="text-[11px] tracking-[0.12em] uppercase"
          style={{ color: 'rgba(242,239,232,0.4)' }}>
          {event.title}
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.12)' }}>/</span>
        <span className="text-[11px] tracking-[0.12em] uppercase" style={{ color: 'rgba(242,239,232,0.7)' }}>
          Registrations
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-12 py-12">
        {/* Page header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display font-bold text-[28px] mb-1" style={{ color: 'var(--color-text)' }}>
              Registrations
            </h1>
            <p className="text-[13px]" style={{ color: 'rgba(242,239,232,0.4)' }}>
              {event.title} · {formatDate(new Date(event.date))}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-[28px]" style={{ color: 'var(--color-gold)' }}>
              {regs.length}
              <span className="font-normal text-[16px] ml-1" style={{ color: 'rgba(242,239,232,0.3)' }}>
                / {event.totalSeats}
              </span>
            </p>
            <p className="text-[11px] tracking-[0.14em] uppercase" style={{ color: 'rgba(242,239,232,0.35)' }}>
              Registered
            </p>
          </div>
        </div>

        {regs.length === 0 ? (
          <div
            className="border p-16 text-center"
            style={{ borderColor: 'rgba(255,255,255,0.07)', borderStyle: 'dashed' }}
          >
            <p className="font-serif italic text-[18px]" style={{ color: 'rgba(242,239,232,0.3)' }}>
              No registrations yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  {[
                    '#', 'Name', 'Email', 'Phone', 'Role', 'Experience',
                    'City', 'Track', 'LinkedIn', 'Registered',
                  ].map(h => (
                    <th key={h}
                      className="pb-3 pr-6 text-[9px] tracking-[0.22em] uppercase whitespace-nowrap"
                      style={{ color: 'var(--color-gold)', fontWeight: 600 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regs.map((reg, idx) => (
                  <tr
                    key={reg.id}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <td className="py-4 pr-6 text-[12px]" style={{ color: 'rgba(242,239,232,0.3)' }}>
                      {idx + 1}
                    </td>
                    <td className="py-4 pr-6 text-[13px] whitespace-nowrap" style={{ color: 'var(--color-text)' }}>
                      {reg.user.name ?? '—'}
                    </td>
                    <td className="py-4 pr-6 text-[12px]" style={{ color: 'rgba(242,239,232,0.6)' }}>
                      {reg.user.email ?? '—'}
                    </td>
                    <td className="py-4 pr-6 text-[12px] whitespace-nowrap" style={{ color: 'rgba(242,239,232,0.6)' }}>
                      {reg.phone ?? '—'}
                    </td>
                    <td className="py-4 pr-6 text-[12px] whitespace-nowrap" style={{ color: 'rgba(242,239,232,0.6)' }}>
                      {reg.currentRole ?? '—'}
                    </td>
                    <td className="py-4 pr-6 text-[12px] whitespace-nowrap" style={{ color: 'rgba(242,239,232,0.5)' }}>
                      {reg.yearsInFinance ?? '—'}
                    </td>
                    <td className="py-4 pr-6 text-[12px] whitespace-nowrap" style={{ color: 'rgba(242,239,232,0.5)' }}>
                      {reg.city ?? '—'}
                    </td>
                    <td className="py-4 pr-6 text-[12px] whitespace-nowrap" style={{ color: 'rgba(242,239,232,0.5)' }}>
                      {reg.track ?? '—'}
                    </td>
                    <td className="py-4 pr-6 text-[12px]">
                      {reg.linkedIn ? (
                        <a
                          href={reg.linkedIn.startsWith('http') ? reg.linkedIn : `https://${reg.linkedIn}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2"
                          style={{ color: 'var(--color-gold)' }}
                        >
                          View ↗
                        </a>
                      ) : (
                        <span style={{ color: 'rgba(242,239,232,0.2)' }}>—</span>
                      )}
                    </td>
                    <td className="py-4 pr-6 text-[11px] whitespace-nowrap" style={{ color: 'rgba(242,239,232,0.35)' }}>
                      {formatDate(new Date(reg.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
