'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { updateHomepageContent } from '@/app/actions/homepage'
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
      <span>{pending ? 'Saving…' : 'Save homepage'}</span>
    </button>
  )
}

function Field({
  id, label, value, hint, multiline, rows = 3,
}: {
  id: string; label: string; value: string; hint?: string; multiline?: boolean; rows?: number
}) {
  return (
    <div>
      <label htmlFor={id} className="admin-label">{label}</label>
      {hint && <p className="text-[11px] mb-1.5" style={{ color: 'rgba(242,239,232,0.35)' }}>{hint}</p>}
      {multiline ? (
        <textarea id={id} name={id} rows={rows} defaultValue={value} className="admin-input resize-y" />
      ) : (
        <input id={id} name={id} type="text" defaultValue={value} className="admin-input" />
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border p-6 flex flex-col gap-5" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
      <h3 className="text-[11px] tracking-[0.2em] uppercase" style={{ color: '#C8A84B' }}>{title}</h3>
      {children}
    </div>
  )
}

export function HomepageForm({ content }: { content: HomepageContent }) {
  const [state, formAction] = useFormState(
    updateHomepageContent as (s: { error?: string }, f: FormData) => Promise<{ error?: string }>,
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

      {/* Hero */}
      <Section title="Hero Copy">
        <Field id="heroLine1" label="Headline — line 1" value={content.heroLine1}
          hint='Displayed as a block on its own line (white)' />
        <Field id="heroLine2" label="Headline — line 2" value={content.heroLine2}
          hint='Displayed as a block on its own line (white)' />
        <Field id="heroLine3" label="Headline — line 3 (gold)" value={content.heroLine3}
          hint='Displayed in gold (#C8A84B)' />
        <Field id="heroTagline" label="Tagline (italic, below headline)" value={content.heroTagline} />
      </Section>

      {/* Beliefs */}
      <Section title="Beliefs Strip (01 – 04)">
        <p className="text-[12px]" style={{ color: 'rgba(242,239,232,0.4)' }}>
          The four belief cards below the hero. Keep each to one sentence.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field id="belief1" label="01" value={content.belief1} />
          <Field id="belief2" label="02" value={content.belief2} />
          <Field id="belief3" label="03" value={content.belief3} />
          <Field id="belief4" label="04" value={content.belief4} />
        </div>
      </Section>

      {/* Who it is for */}
      <Section title="Who It Is For">
        <Field id="whoHeadline" label="Headline (main text)" value={content.whoHeadline}
          hint='The sentence fragment before the highlighted phrase' />
        <Field id="whoHeadlineHighlight" label="Headline (highlighted phrase, gold italic)" value={content.whoHeadlineHighlight}
          hint='Appended to the headline in gold. Ends with a period.' />
        <Field id="whoBody" label="Body paragraph" value={content.whoBody} multiline rows={4} />
      </Section>

      {/* Insider series */}
      <Section title="The Insider Series">
        <div className="grid grid-cols-3 gap-4">
          <Field id="insiderLine1" label="Headline line 1" value={content.insiderLine1} />
          <Field id="insiderLine2" label="Headline line 2" value={content.insiderLine2} />
          <Field id="insiderLine3" label="Headline line 3 (gold italic)" value={content.insiderLine3} />
        </div>
        <Field id="insiderBody" label="Body paragraph" value={content.insiderBody} multiline rows={4} />
        <Field id="insiderNote" label="Small note below CTA button" value={content.insiderNote} />
      </Section>

      {/* Insider panels */}
      <Section title="Insider Series — 3 Feature Panels">
        <div className="flex flex-col gap-6">
          {([1, 2, 3] as const).map(n => (
            <div key={n} className="flex flex-col gap-3 pb-6 border-b last:border-b-0 last:pb-0"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <p className="text-[11px] tracking-[0.18em] uppercase" style={{ color: 'rgba(200,168,75,0.6)' }}>Panel 0{n}</p>
              <Field id={`insiderPanel${n}Title`} label="Title" value={(content as Record<string, string>)[`insiderPanel${n}Title`]} />
              <Field id={`insiderPanel${n}Body`} label="Body" value={(content as Record<string, string>)[`insiderPanel${n}Body`]} multiline rows={3} />
            </div>
          ))}
        </div>
      </Section>

      {/* Events list page */}
      <Section title="Events Page — Header">
        <Field id="eventsPageKicker" label="Kicker (small label above title)" value={content.eventsPageKicker} />
        <Field id="eventsPageTitle" label="Page title" value={content.eventsPageTitle} />
        <Field id="eventsPageDescription" label="Description paragraph" value={content.eventsPageDescription} multiline rows={3} />
      </Section>

      {/* Event detail labels */}
      <Section title="Event Detail Page — Section Labels">
        <p className="text-[12px]" style={{ color: 'rgba(242,239,232,0.4)' }}>
          These labels appear as section headings on every individual event page.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Field id="eventLabelCovers"       label="'What this session covers'" value={content.eventLabelCovers} />
          <Field id="eventLabelWho"          label="'Who should be in the room'" value={content.eventLabelWho} />
          <Field id="eventLabelAbout"        label="'About this session'" value={content.eventLabelAbout} />
          <Field id="eventLabelExpect"       label="'What to expect'" value={content.eventLabelExpect} />
          <Field id="eventLabelPractitioner" label="Practitioner card label" value={content.eventLabelPractitioner} />
          <Field id="eventLabelIdentity"     label="Hidden-identity text" value={content.eventLabelIdentity}
            hint="Shown when no name is set for the practitioner." />
        </div>
      </Section>

      <div className="flex gap-4">
        <SaveButton />
        <a href="/admin" className="btn btn-ghost-dark"><span>Back to events</span></a>
      </div>
    </form>
  )
}
