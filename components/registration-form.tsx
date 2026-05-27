'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { registerForEvent, type RegisterState } from '@/app/actions/register'
import { signIn } from 'next-auth/react'

interface RegistrationFormProps {
  eventId: string
  isLoggedIn: boolean
  isRegistered: boolean
  isFull: boolean
  tracks: string[]
  userName?: string
  userEmail?: string
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-amber w-full justify-center"
      style={{ cursor: pending ? 'wait' : 'pointer', opacity: pending ? 0.7 : 1 }}
    >
      <span>{pending ? 'Reserving…' : 'Reserve My Seat'}</span>
      {!pending && <span>→</span>}
    </button>
  )
}

const initial: RegisterState = {}

export function RegistrationForm({
  eventId,
  isLoggedIn,
  isRegistered,
  isFull,
  tracks,
  userName,
  userEmail,
}: RegistrationFormProps) {
  const [state, formAction] = useFormState(registerForEvent, initial)

  if (isFull && !isRegistered) {
    return (
      <div
        className="p-8 text-center border"
        style={{
          borderColor: 'rgba(255,80,80,0.2)',
          background: 'rgba(255,80,80,0.04)',
        }}
      >
        <p
          className="font-display font-bold text-[18px] mb-2"
          style={{ color: '#F2EFE8' }}
        >
          This session is full.
        </p>
        <p className="text-[13px]" style={{ color: 'rgba(242,239,232,0.5)' }}>
          Future sessions will be announced on our Instagram and LinkedIn.
        </p>
      </div>
    )
  }

  if (isRegistered || state.success) {
    return (
      <div
        className="p-8 text-center border"
        style={{
          borderColor: 'rgba(200,168,75,0.25)',
          background: 'rgba(200,168,75,0.05)',
        }}
      >
        <div className="mb-4 flex justify-center">
          <div
            className="w-12 h-12 flex items-center justify-center"
            style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.3)' }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#C8A84B" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>
        <p
          className="font-display font-bold text-[20px] mb-2"
          style={{ color: '#F2EFE8' }}
        >
          Your seat is reserved.
        </p>
        <p className="text-[13px]" style={{ color: 'rgba(242,239,232,0.5)', lineHeight: 1.7 }}>
          We'll reach out closer to the session date with event details.
          <br />
          Check your inbox at <strong style={{ color: 'rgba(242,239,232,0.7)' }}>{userEmail}</strong>.
        </p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-6">
        <p
          className="font-serif italic text-[15px]"
          style={{ color: 'rgba(242,239,232,0.55)', lineHeight: 1.7 }}
        >
          Sign in with your Google account to reserve a seat.
          Your registration is reviewed before confirmation.
        </p>
        <button
          onClick={() => signIn('google')}
          style={{  }}
          className="btn btn-amber"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          <span>Continue with Google</span>
        </button>
        <p className="text-[11px]" style={{ color: 'rgba(242,239,232,0.3)', lineHeight: 1.6 }}>
          By registering, you agree to our terms. This event is by application only —
          we review each registration to maintain the quality of the room.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="eventId" value={eventId} />

      {state.error && (
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

      {/* Pre-filled from Google — read-only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="admin-label">Name</label>
          <div
            className="px-4 py-3 text-[14px]"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(242,239,232,0.55)',
            }}
          >
            {userName || 'Signed in via Google'}
          </div>
        </div>
        <div>
          <label className="admin-label">Email</label>
          <div
            className="px-4 py-3 text-[14px]"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(242,239,232,0.55)',
            }}
          >
            {userEmail || '—'}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="admin-label">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="admin-input"
          placeholder="+91 98765 43210"
        />
      </div>

      <div>
        <label htmlFor="currentRole" className="admin-label">Current Role</label>
        <input
          id="currentRole"
          name="currentRole"
          type="text"
          className="admin-input"
          placeholder="e.g. Analyst, Associate, VP, Director…"
        />
      </div>

      <div>
        <label htmlFor="yearsInFinance" className="admin-label">Years in Finance</label>
        <select id="yearsInFinance" name="yearsInFinance" className="admin-input">
          <option value="">Select…</option>
          <option value="0-2">0 – 2 years</option>
          <option value="2-5">2 – 5 years</option>
          <option value="5-10">5 – 10 years</option>
          <option value="10+">10+ years</option>
        </select>
      </div>

      <div>
        <label htmlFor="city" className="admin-label">City</label>
        <input
          id="city"
          name="city"
          type="text"
          className="admin-input"
          placeholder="e.g. Mumbai, Delhi, Bengaluru…"
        />
      </div>

      <div>
        <label htmlFor="linkedIn" className="admin-label">LinkedIn Profile</label>
        <input
          id="linkedIn"
          name="linkedIn"
          type="url"
          className="admin-input"
          placeholder="linkedin.com/in/yourname"
        />
      </div>

      {tracks.length > 0 && (
        <div>
          <label htmlFor="track" className="admin-label">Track of Interest</label>
          <select id="track" name="track" className="admin-input">
            <option value="">Select…</option>
            {tracks.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      )}

      <SubmitButton />

      <p className="text-[11px]" style={{ color: 'rgba(242,239,232,0.3)', lineHeight: 1.6 }}>
        Registrations are reviewed. A seat is held for you but confirmed only after review.
        No confidential information is shared — sessions use public or hypothetical scenarios.
      </p>
    </form>
  )
}
