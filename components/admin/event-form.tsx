'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createEvent, updateEvent } from '@/app/actions/admin'
import type { Event } from '@prisma/client'

function SaveButton({ label = 'Save event' }: { label?: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-amber"
      style={{ cursor: pending ? 'wait' : 'pointer', opacity: pending ? 0.7 : 1 }}
    >
      <span>{pending ? 'Saving…' : label}</span>
    </button>
  )
}

interface EventFormProps {
  event?: Event | null
}

export function EventForm({ event }: EventFormProps) {
  const action = event
    ? updateEvent.bind(null, event.id)
    : createEvent

  const [state, formAction] = useFormState(
    action as (prevState: { error?: string }, formData: FormData) => Promise<{ error?: string }>,
    {} as { error?: string },
  )

  const practitioner = event?.practitioner
    ? JSON.parse(event.practitioner as string) as {
        name?: string; title?: string; company?: string; experience?: string; bio?: string; attributes?: string[]
      }
    : null

  const toDatetimeLocal = (d?: Date | null) => {
    if (!d) return ''
    const dt = new Date(d)
    return new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
  }

  return (
    <form action={formAction} className="flex flex-col gap-8 max-w-2xl">
      {state?.error && (
        <div
          className="p-4 text-[13px]"
          style={{
            background: 'rgba(255,80,80,0.08)',
            border: '1px solid rgba(255,80,80,0.2)',
            color: 'rgba(255,150,150,0.9)',
          }}
        >
          {state.error}
        </div>
      )}

      {/* Basic info */}
      <div
        className="border p-6 flex flex-col gap-5"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <h3 className="text-[11px] tracking-[0.2em] uppercase" style={{ color: '#C8A84B' }}>
          Basic Info
        </h3>

        <div>
          <label htmlFor="title" className="admin-label">Title *</label>
          <input
            id="title" name="title" type="text" required
            defaultValue={event?.title}
            className="admin-input"
            placeholder="Inside the Deal Room"
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="admin-label">Subtitle</label>
          <input
            id="subtitle" name="subtitle" type="text"
            defaultValue={event?.subtitle ?? ''}
            className="admin-input"
            placeholder="What Happens Before a PE Fund Puts ₹500 Crore on the Table"
          />
        </div>

        <div>
          <label htmlFor="description" className="admin-label">Description *</label>
          <p className="text-[11px] mb-1.5" style={{ color: 'rgba(242,239,232,0.35)' }}>
            Separate paragraphs with a blank line. The first paragraph becomes "What this session covers", the second becomes "Who should be in the room".
          </p>
          <textarea
            id="description" name="description" rows={8} required
            defaultValue={event?.description}
            className="admin-input resize-y"
            placeholder="What attendees will experience in this session…&#10;&#10;Who this session is designed for…"
          />
        </div>

        <div>
          <label htmlFor="coverNote" className="admin-label">Opening pull-quote</label>
          <input
            id="coverNote" name="coverNote" type="text"
            defaultValue={event?.coverNote ?? ''}
            className="admin-input"
            placeholder="₹500 crore does not move because a model said so…"
          />
        </div>

        <div>
          <label htmlFor="topic" className="admin-label">Topic / Track</label>
          <input
            id="topic" name="topic" type="text"
            defaultValue={event?.topic ?? ''}
            className="admin-input"
            placeholder="PE/VC Investments"
          />
        </div>

        <div>
          <label htmlFor="tracks" className="admin-label">
            Tracks (comma-separated)
          </label>
          <input
            id="tracks" name="tracks" type="text"
            defaultValue={event?.tracks ?? ''}
            className="admin-input"
            placeholder="PE/VC, Wealth & Investments, Strategy & Corporate Finance"
          />
        </div>
      </div>

      {/* Schedule & Format */}
      <div
        className="border p-6 flex flex-col gap-5"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <h3 className="text-[11px] tracking-[0.2em] uppercase" style={{ color: '#C8A84B' }}>
          Schedule & Format
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="admin-label">Date & Time *</label>
            <input
              id="date" name="date" type="datetime-local" required
              defaultValue={toDatetimeLocal(event?.date)}
              className="admin-input"
            />
          </div>
          <div>
            <label htmlFor="duration" className="admin-label">Duration (minutes)</label>
            <input
              id="duration" name="duration" type="number"
              defaultValue={event?.duration ?? 60}
              className="admin-input"
              min={15}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="format" className="admin-label">Format</label>
            <select
              id="format" name="format"
              defaultValue={event?.format ?? 'Online'}
              className="admin-input"
              style={{  }}
            >
              <option value="Online">Online</option>
              <option value="In-person">In-person</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label htmlFor="totalSeats" className="admin-label">Total seats</label>
            <input
              id="totalSeats" name="totalSeats" type="number"
              defaultValue={event?.totalSeats ?? 30}
              className="admin-input"
              min={1}
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="admin-label">Location (for in-person)</label>
          <input
            id="location" name="location" type="text"
            defaultValue={event?.location ?? ''}
            className="admin-input"
            placeholder="e.g. BKC, Mumbai"
          />
        </div>
      </div>

      {/* Practitioner */}
      <div
        className="border p-6 flex flex-col gap-5"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <h3 className="text-[11px] tracking-[0.2em] uppercase" style={{ color: '#C8A84B' }}>
          Practitioner
        </h3>
        <p className="text-[12px]" style={{ color: 'rgba(242,239,232,0.4)' }}>
          Name is shown publicly when set. Leave blank to show the identity label from CMS.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="practitionerName" className="admin-label">Name (optional)</label>
            <input
              id="practitionerName" name="practitionerName" type="text"
              defaultValue={practitioner?.name ?? ''}
              className="admin-input"
            />
          </div>
          <div>
            <label htmlFor="practitionerTitle" className="admin-label">Title</label>
            <input
              id="practitionerTitle" name="practitionerTitle" type="text"
              defaultValue={practitioner?.title ?? ''}
              className="admin-input"
              placeholder="Director, VP, Partner…"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="practitionerCompany" className="admin-label">Company / Fund</label>
            <input
              id="practitionerCompany" name="practitionerCompany" type="text"
              defaultValue={practitioner?.company ?? ''}
              className="admin-input"
            />
          </div>
          <div>
            <label htmlFor="practitionerExperience" className="admin-label">Experience</label>
            <input
              id="practitionerExperience" name="practitionerExperience" type="text"
              defaultValue={practitioner?.experience ?? ''}
              className="admin-input"
              placeholder="10+ years buyside experience"
            />
          </div>
        </div>

        <div>
          <label htmlFor="practitionerBio" className="admin-label">Bio</label>
          <textarea
            id="practitionerBio" name="practitionerBio" rows={3}
            defaultValue={practitioner?.bio ?? ''}
            className="admin-input resize-y"
          />
        </div>

        <div>
          <label htmlFor="practitionerAttributes" className="admin-label">Key attributes (one per line)</label>
          <p className="text-[11px] mb-1.5" style={{ color: 'rgba(242,239,232,0.35)' }}>
            Bullet points shown below the bio. Each line is one attribute.
          </p>
          <textarea
            id="practitionerAttributes" name="practitionerAttributes" rows={4}
            defaultValue={(practitioner?.attributes ?? []).join('\n')}
            className="admin-input resize-y"
            placeholder={'10+ years in PE/VC investing\nLed 30+ investment decisions\nPreviously at Goldman Sachs'}
          />
        </div>
      </div>

      {/* What to expect */}
      <div
        className="border p-6 flex flex-col gap-5"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <h3 className="text-[11px] tracking-[0.2em] uppercase" style={{ color: '#C8A84B' }}>
          What to Expect
        </h3>
        <p className="text-[12px]" style={{ color: 'rgba(242,239,232,0.4)' }}>
          One bullet per line. Leave blank to use the default list.
        </p>
        <div>
          <label htmlFor="whatToExpect" className="admin-label">Bullet points (one per line)</label>
          <textarea
            id="whatToExpect" name="whatToExpect" rows={6}
            defaultValue={(event as any)?.whatToExpect ?? ''}
            className="admin-input resize-y"
            placeholder={'One practitioner per session\nA small, vetted group\nA real scenario — your judgment tested\n60 minutes. No recordings.\nBy application only.'}
          />
        </div>
      </div>

      {/* Visibility */}
      <div
        className="border p-6 flex flex-col gap-4"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <h3 className="text-[11px] tracking-[0.2em] uppercase" style={{ color: '#C8A84B' }}>
          Post-session
        </h3>
        <p className="text-[12px]" style={{ color: 'rgba(242,239,232,0.4)' }}>
          Add the recording link once the session is completed. Attendees on the event page will see a "Watch recording" button instead of the registration form.
        </p>
        <div>
          <label htmlFor="recordingUrl" className="admin-label">Recording / Watch link</label>
          <input
            id="recordingUrl" name="recordingUrl" type="url"
            defaultValue={(event as any)?.recordingUrl ?? ''}
            className="admin-input"
            placeholder="https://youtube.com/watch?v=… or https://vimeo.com/…"
          />
        </div>
      </div>

      <div
        className="border p-6 flex flex-col gap-4"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <h3 className="text-[11px] tracking-[0.2em] uppercase" style={{ color: '#C8A84B' }}>
          Visibility
        </h3>

        {[
          { id: 'isPublished', label: 'Published', sub: 'Visible to the public' },
          { id: 'isFeatured',  label: 'Featured',  sub: 'Shown prominently on the home page' },
        ].map(({ id, label, sub }) => (
          <label
            key={id}
            htmlFor={id}
            className="flex items-start gap-3 cursor-pointer"
            style={{  }}
          >
            <input
              type="checkbox"
              id={id}
              name={id}
              defaultChecked={event ? (event as Record<string, unknown>)[id] as boolean : false}
              className="mt-0.5 accent-amber-DEFAULT"
              style={{  }}
            />
            <div>
              <p className="text-[14px]" style={{ color: '#F2EFE8' }}>{label}</p>
              <p className="text-[12px]" style={{ color: 'rgba(242,239,232,0.4)' }}>{sub}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex gap-4">
        <SaveButton label={event ? 'Update event' : 'Create event'} />
        <a href="/admin" className="btn btn-ghost-dark" style={{  }}>
          <span>Cancel</span>
        </a>
      </div>
    </form>
  )
}
