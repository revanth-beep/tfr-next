export const dynamic = 'force-dynamic'

import { getHomepageContent } from '@/lib/homepage'
import { ColorsForm } from '@/components/admin/colors-form'
import { adminLogout } from '@/app/actions/admin'
import Link from 'next/link'

export default async function ColorsPage() {
  const content = await getHomepageContent()

  const colors = {
    colorBackground: content.colorBackground,
    colorGold:       content.colorGold,
    colorText:       content.colorText,
    colorSteelBlue:  content.colorSteelBlue,
    colorCard:       content.colorCard,
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="border-b px-12 py-5 flex items-center justify-between"
        style={{ background: '#0F0F1A', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-6">
          <img src="/logo.png" alt="The Finance Room" className="h-6"
            style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
          <span className="text-[11px] tracking-[0.2em] uppercase"
            style={{ color: 'rgba(242,239,232,0.4)' }}>Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[11px] tracking-[0.12em] uppercase"
            style={{ color: 'rgba(242,239,232,0.4)' }}>View site →</Link>
          <form action={adminLogout}>
            <button type="submit" className="text-[11px] tracking-[0.12em] uppercase"
              style={{ color: 'rgba(242,239,232,0.4)' }}>Sign out</button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-12 py-12">
        <div className="mb-10">
          <Link href="/admin" className="text-[11px] tracking-[0.14em] uppercase"
            style={{ color: 'rgba(242,239,232,0.35)' }}>← Events</Link>
          <h1 className="font-display font-bold text-[28px] mt-2" style={{ color: 'var(--color-text)' }}>
            Brand Colors
          </h1>
          <p className="text-[13px] mt-1" style={{ color: 'rgba(242,239,232,0.4)' }}>
            Edit the site-wide color palette. Changes apply everywhere instantly.
          </p>
        </div>

        <ColorsForm colors={colors} />
      </div>
    </div>
  )
}
