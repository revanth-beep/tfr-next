'use client'

import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { updateSiteColors } from '@/app/actions/colors'
import type { HomepageContent } from '@/lib/homepage'

function SaveButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-amber"
      style={{ cursor: pending ? 'wait' : 'pointer', opacity: pending ? 0.7 : 1 }}
    >
      <span>{pending ? 'Saving…' : 'Save colors'}</span>
    </button>
  )
}

function ColorSwatch({
  id, label, defaultValue, hint,
}: {
  id: string; label: string; defaultValue: string; hint: string
}) {
  const [hex, setHex] = React.useState(defaultValue ?? '#000000')
  return (
    <div className="flex flex-col gap-3 p-5 border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
      <label htmlFor={id} className="admin-label mb-0">{label}</label>
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            id={id}
            name={id}
            type="color"
            value={hex}
            onChange={e => setHex(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div
            className="w-14 h-14 border-2 rounded"
            style={{ background: hex, borderColor: 'rgba(255,255,255,0.15)' }}
          />
        </div>
        <div>
          <p className="text-[15px] font-mono font-medium" style={{ color: 'var(--color-text)' }}>{hex.toUpperCase()}</p>
          <p className="text-[11px] mt-0.5" style={{ color: 'rgba(242,239,232,0.4)' }}>{hint}</p>
        </div>
      </div>
    </div>
  )
}

type Colors = Pick<HomepageContent, 'colorBackground' | 'colorGold' | 'colorText' | 'colorSteelBlue' | 'colorCard'>

export function ColorsForm({ colors }: { colors: Colors }) {
  const [state, formAction] = useFormState(
    updateSiteColors as (s: { error?: string }, f: FormData) => Promise<{ error?: string }>,
    {} as { error?: string },
  )

  return (
    <form action={formAction} className="flex flex-col gap-8 max-w-2xl">
      {state?.error && (
        <div className="p-4 text-[13px]"
          style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', color: 'rgba(255,150,150,0.9)' }}>
          {state.error}
        </div>
      )}

      <div>
        <h2 className="text-[11px] tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(242,239,232,0.4)' }}>Core Palette</h2>
        <p className="text-[12px] mb-5" style={{ color: 'rgba(242,239,232,0.3)' }}>
          Changes apply across the entire site on save. Click a swatch to open the color picker.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <ColorSwatch
            id="colorBackground"
            label="Background"
            defaultValue={colors.colorBackground}
            hint="Page base — deepest layer"
          />
          <ColorSwatch
            id="colorCard"
            label="Card / Panel"
            defaultValue={colors.colorCard}
            hint="Event cards, feature panels"
          />
          <ColorSwatch
            id="colorGold"
            label="Gold — Accent"
            defaultValue={colors.colorGold}
            hint="CTAs, kickers, upcoming events"
          />
          <ColorSwatch
            id="colorText"
            label="Primary Text"
            defaultValue={colors.colorText}
            hint="Headings and body copy"
          />
          <ColorSwatch
            id="colorSteelBlue"
            label="Steel Blue"
            defaultValue={colors.colorSteelBlue}
            hint="Past / concluded session labels"
          />
        </div>
      </div>

      <div className="p-4 border" style={{ borderColor: 'rgba(200,168,75,0.15)', background: 'rgba(200,168,75,0.04)' }}>
        <p className="text-[11px]" style={{ color: 'rgba(200,168,75,0.7)' }}>
          Changes go live immediately after saving. Hard-refresh the site to see the updated palette.
        </p>
      </div>

      <div className="flex gap-4">
        <SaveButton />
        <a href="/admin" className="btn btn-ghost-dark"><span>Back to events</span></a>
      </div>
    </form>
  )
}
