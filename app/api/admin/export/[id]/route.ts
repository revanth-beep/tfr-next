export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import * as XLSX from 'xlsx'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      registrations: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const rows = event.registrations.map((reg, idx) => ({
    '#': idx + 1,
    Name: reg.user.name ?? '',
    Email: reg.user.email ?? '',
    Phone: reg.phone ?? '',
    'Current Role': reg.currentRole ?? '',
    'Years in Finance': reg.yearsInFinance ?? '',
    City: reg.city ?? '',
    Track: reg.track ?? '',
    LinkedIn: reg.linkedIn ?? '',
    'Registered At': new Date(reg.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows)

  // Column widths
  ws['!cols'] = [
    { wch: 4 }, { wch: 24 }, { wch: 32 }, { wch: 18 },
    { wch: 22 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 36 }, { wch: 22 },
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'Registrations')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const slug = event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const filename = `registrations-${slug}.xlsx`

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
