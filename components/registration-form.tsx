'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { registerForEvent, type RegisterState } from '@/app/actions/register'
import { signIn } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'

// ── Data ─────────────────────────────────────────────────────────────────────

const FINANCE_ROLES = [
  // Finance & Investment
  'Analyst',
  'Senior Analyst',
  'Associate',
  'Senior Associate',
  'Vice President (VP)',
  'Senior Vice President (SVP)',
  'Director',
  'Managing Director (MD)',
  'Partner',
  'Investment Banker',
  'Portfolio Manager',
  'Fund Manager',
  'Equity Analyst',
  'Credit Analyst',
  'Research Analyst',
  'Risk Manager',
  'Quant / Quant Analyst',
  'Trader',
  'Financial Advisor',
  'Chartered Accountant (CA)',
  'CFA Charterholder',
  'CFO / Finance Head',
  'Finance Manager',
  // Business & Strategy
  'Founder / Co-Founder',
  'CEO / MD',
  'COO',
  'Business Development',
  'Strategy & Consulting',
  'Management Consultant',
  // Technology
  'Software Engineer',
  'Product Manager',
  'Data Scientist / Analyst',
  'Engineering Manager',
  'CTO',
  // Legal & Compliance
  'Legal Counsel',
  'Compliance Officer',
  // Operations & Other Corporate
  'Operations Manager',
  'HR / People & Culture',
  'Marketing / Brand',
  // Academia & Research
  'Professor / Academic',
  'Researcher',
  // Early Career
  'Student / Fresher',
  'Intern',
  'Other',
]

const INDIAN_CITIES = [
  'Mumbai',
  'Delhi / NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Gurugram',
  'Noida',
  'Chandigarh',
  'Jaipur',
  'Lucknow',
  'Kochi',
  'Indore',
  'Bhopal',
  'Nagpur',
  'Surat',
  'Vadodara',
  'Visakhapatnam',
  'Outside India',
]

const COUNTRY_CODES = [
  { flag: '🇮🇳', code: '+91',  country: 'India' },
  { flag: '🇺🇸', code: '+1',   country: 'United States' },
  { flag: '🇬🇧', code: '+44',  country: 'United Kingdom' },
  { flag: '🇦🇪', code: '+971', country: 'UAE' },
  { flag: '🇸🇬', code: '+65',  country: 'Singapore' },
  { flag: '🇨🇦', code: '+1',   country: 'Canada' },
  { flag: '🇦🇺', code: '+61',  country: 'Australia' },
  { flag: '🇩🇪', code: '+49',  country: 'Germany' },
  { flag: '🇫🇷', code: '+33',  country: 'France' },
  { flag: '🇯🇵', code: '+81',  country: 'Japan' },
  { flag: '🇨🇳', code: '+86',  country: 'China' },
  { flag: '🇭🇰', code: '+852', country: 'Hong Kong' },
  { flag: '🇨🇭', code: '+41',  country: 'Switzerland' },
  { flag: '🇳🇱', code: '+31',  country: 'Netherlands' },
  { flag: '🇸🇪', code: '+46',  country: 'Sweden' },
  { flag: '🇳🇴', code: '+47',  country: 'Norway' },
  { flag: '🇩🇰', code: '+45',  country: 'Denmark' },
  { flag: '🇮🇹', code: '+39',  country: 'Italy' },
  { flag: '🇪🇸', code: '+34',  country: 'Spain' },
  { flag: '🇧🇷', code: '+55',  country: 'Brazil' },
  { flag: '🇲🇽', code: '+52',  country: 'Mexico' },
  { flag: '🇿🇦', code: '+27',  country: 'South Africa' },
  { flag: '🇳🇬', code: '+234', country: 'Nigeria' },
  { flag: '🇰🇪', code: '+254', country: 'Kenya' },
  { flag: '🇸🇦', code: '+966', country: 'Saudi Arabia' },
  { flag: '🇶🇦', code: '+974', country: 'Qatar' },
  { flag: '🇧🇭', code: '+973', country: 'Bahrain' },
  { flag: '🇰🇼', code: '+965', country: 'Kuwait' },
  { flag: '🇴🇲', code: '+968', country: 'Oman' },
  { flag: '🇲🇾', code: '+60',  country: 'Malaysia' },
  { flag: '🇮🇩', code: '+62',  country: 'Indonesia' },
  { flag: '🇵🇭', code: '+63',  country: 'Philippines' },
  { flag: '🇳🇿', code: '+64',  country: 'New Zealand' },
  { flag: '🇮🇪', code: '+353', country: 'Ireland' },
  { flag: '🇵🇹', code: '+351', country: 'Portugal' },
  { flag: '🇧🇪', code: '+32',  country: 'Belgium' },
  { flag: '🇦🇹', code: '+43',  country: 'Austria' },
  { flag: '🇵🇱', code: '+48',  country: 'Poland' },
  { flag: '🇷🇺', code: '+7',   country: 'Russia' },
  { flag: '🇹🇷', code: '+90',  country: 'Turkey' },
  { flag: '🇮🇱', code: '+972', country: 'Israel' },
  { flag: '🇵🇰', code: '+92',  country: 'Pakistan' },
  { flag: '🇧🇩', code: '+880', country: 'Bangladesh' },
  { flag: '🇱🇰', code: '+94',  country: 'Sri Lanka' },
  { flag: '🇳🇵', code: '+977', country: 'Nepal' },
]

// ── PhoneInput ────────────────────────────────────────────────────────────────

function PhoneInput() {
  const [selected, setSelected]   = useState(COUNTRY_CODES[0])
  const [number, setNumber]       = useState('')
  const [open, setOpen]           = useState(false)
  const [query, setQuery]         = useState('')
  const containerRef              = useRef<HTMLDivElement>(null)
  const searchRef                 = useRef<HTMLInputElement>(null)

  const filtered = query.trim()
    ? COUNTRY_CODES.filter(c =>
        c.country.toLowerCase().includes(query.toLowerCase()) ||
        c.code.includes(query)
      )
    : COUNTRY_CODES

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50)
  }, [open])

  const fullNumber = number ? `${selected.code} ${number}` : ''

  const inputStyle = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#F2EFE8',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input type="hidden" name="phone" value={fullNumber} />

      {/* Combined input row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.07)',
          border: `1px solid ${open ? 'rgba(200,168,75,0.65)' : 'rgba(255,255,255,0.18)'}`,
          transition: 'border-color 0.2s',
        }}
      >
        {/* Country code button */}
        <button
          type="button"
          onClick={() => { setOpen(!open); setQuery('') }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '11px 12px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            color: '#F2EFE8',
          }}
        >
          <span style={{ fontSize: '16px', lineHeight: 1 }}>{selected.flag}</span>
          <span style={{ fontSize: '13px', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.02em', color: 'rgba(242,239,232,0.9)' }}>
            {selected.code}
          </span>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', color: 'rgba(242,239,232,0.4)' }}>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.14)', flexShrink: 0 }} />

        {/* Number input */}
        <input
          type="tel"
          value={number}
          onChange={e => setNumber(e.target.value)}
          placeholder="98765 43210"
          required
          style={{ ...inputStyle, flex: 1, padding: '11px 14px' }}
          onFocus={e => {
            const wrapper = e.currentTarget.closest('div[style]') as HTMLElement | null
            if (wrapper) wrapper.style.borderColor = 'rgba(200,168,75,0.65)'
          }}
          onBlur={e => {
            if (!open) {
              const wrapper = e.currentTarget.closest('div[style]') as HTMLElement | null
              if (wrapper) wrapper.style.borderColor = 'rgba(255,255,255,0.18)'
            }
          }}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
          background: '#0F1E37',
          border: '1px solid rgba(200,168,75,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {/* Search */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search country…"
              style={{
                ...inputStyle,
                width: '100%',
                padding: '7px 10px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '13px',
                boxSizing: 'border-box' as const,
              }}
            />
          </div>
          {/* Options */}
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {filtered.map(c => (
              <div
                key={c.country}
                onMouseDown={() => { setSelected(c); setOpen(false); setQuery('') }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 14px',
                  cursor: 'pointer',
                  background: c.country === selected.country ? 'rgba(200,168,75,0.08)' : 'transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = c.country === selected.country ? 'rgba(200,168,75,0.08)' : 'transparent')}
              >
                <span style={{ fontSize: '15px', lineHeight: 1, flexShrink: 0 }}>{c.flag}</span>
                <span style={{ fontSize: '13px', color: 'rgba(242,239,232,0.88)', flex: 1, fontFamily: "'DM Sans', sans-serif" }}>{c.country}</span>
                <span style={{ fontSize: '12px', color: 'rgba(242,239,232,0.4)', fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>{c.code}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <p style={{ padding: '12px 14px', fontSize: '13px', color: 'rgba(242,239,232,0.35)', fontFamily: "'DM Sans', sans-serif" }}>
                No results
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── SearchSelect ──────────────────────────────────────────────────────────────

function SearchSelect({
  name,
  placeholder,
  options,
}: {
  name: string
  placeholder: string
  options: string[]
}) {
  const [query, setQuery]       = useState('')
  const [open, setOpen]         = useState(false)
  const [selected, setSelected] = useState('')
  const containerRef            = useRef<HTMLDivElement>(null)

  const filtered = query.trim()
    ? options.filter(o => o.toLowerCase().includes(query.toLowerCase()))
    : options

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function pick(val: string) {
    setSelected(val)
    setQuery(val)
    setOpen(false)
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input type="hidden" name={name} value={selected} />
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected(''); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#F2EFE8',
            padding: '11px 36px 11px 14px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onKeyDown={e => {
            if (e.key === 'Escape') setOpen(false)
            if (e.key === 'Enter') { e.preventDefault(); if (filtered[0]) pick(filtered[0]) }
          }}
        />
        {/* chevron */}
        <span style={{
          position: 'absolute', right: 12, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
          transition: 'transform 0.15s', pointerEvents: 'none', color: 'rgba(242,239,232,0.4)',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>

      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
          background: '#0F1E37',
          border: '1px solid rgba(200,168,75,0.25)',
          maxHeight: 220,
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {filtered.map(opt => (
            <div
              key={opt}
              onMouseDown={() => pick(opt)}
              style={{
                padding: '10px 14px',
                fontSize: '14px',
                color: opt === selected ? 'var(--color-gold)' : 'rgba(242,239,232,0.88)',
                background: opt === selected ? 'rgba(200,168,75,0.08)' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = opt === selected ? 'rgba(200,168,75,0.08)' : 'transparent')}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.13em',
      textTransform: 'uppercase' as const,
      color: 'rgba(242,239,232,0.85)',
      display: 'block',
      marginBottom: 7,
    }}>
      {children}
    </label>
  )
}

function GoogleAccountBadge({ name, email }: { name: string; email: string }) {
  return (
    <div style={{
      background: 'rgba(200,168,75,0.07)',
      border: '1px solid rgba(200,168,75,0.22)',
      borderLeft: '3px solid rgba(200,168,75,0.6)',
      padding: '12px 14px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        marginBottom: 4,
      }}>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase' as const,
          color: 'rgba(200,168,75,0.8)',
        }}>
          Signed in via Google
        </span>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="rgba(200,168,75,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
        color: '#F2EFE8',
        marginBottom: 2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
      }}>
        {name}
      </p>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '12px',
        color: 'rgba(242,239,232,0.55)',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
      }}>
        {email}
      </p>
    </div>
  )
}

function TextInput({ name, type = 'text', placeholder, required }: {
  name: string; type?: string; placeholder: string; required?: boolean
}) {
  return (
    <input
      name={name}
      type={type}
      required={required}
      placeholder={placeholder}
      style={{
        width: '100%',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.18)',
        color: '#F2EFE8',
        padding: '11px 14px',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box' as const,
      }}
      onFocus={e => (e.currentTarget.style.borderColor = 'rgba(200,168,75,0.65)')}
      onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}
    />
  )
}

// ── Main component ────────────────────────────────────────────────────────────

interface RegistrationFormProps {
  eventId: string
  isLoggedIn: boolean
  isRegistered: boolean
  isFull: boolean
  tracks: string[]
  userName?: string
  userEmail?: string
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
      <div className="p-6 text-center border" style={{ borderColor: 'rgba(255,80,80,0.2)', background: 'rgba(255,80,80,0.04)' }}>
        <p className="font-display font-bold text-[18px] mb-2" style={{ color: 'var(--color-text)' }}>
          This session is full.
        </p>
        <p className="text-[13px]" style={{ color: 'rgba(242,239,232,0.55)' }}>
          Future sessions will be announced on our Instagram and LinkedIn.
        </p>
      </div>
    )
  }

  if (isRegistered || state.success) {
    return (
      <div className="p-6 text-center border" style={{ borderColor: 'rgba(200,168,75,0.25)', background: 'rgba(200,168,75,0.05)' }}>
        <div className="mb-4 flex justify-center">
          <div className="w-12 h-12 flex items-center justify-center" style={{ background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.3)' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--color-gold)" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>
        <p className="font-display font-bold text-[20px] mb-2" style={{ color: 'var(--color-text)' }}>
          Your seat is reserved.
        </p>
        <p className="text-[13px]" style={{ color: 'rgba(242,239,232,0.6)', lineHeight: 1.7 }}>
          We'll reach out closer to the session date with event details.
          <br />
          Check your inbox at <strong style={{ color: 'rgba(242,239,232,0.82)' }}>{userEmail}</strong>.
        </p>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-5">
        <p className="font-serif italic" style={{ fontSize: '15px', color: 'rgba(242,239,232,0.7)', lineHeight: 1.75 }}>
          Sign in with your Google account to reserve a seat.
          Your registration is reviewed before confirmation.
        </p>
        <button onClick={() => signIn('google')} className="btn btn-amber w-full justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
          <span>Continue with Google</span>
        </button>
        <p style={{ fontSize: '11px', color: 'rgba(242,239,232,0.35)', lineHeight: 1.6 }}>
          By registering, you agree to our terms. This event is by application only —
          we review each registration to maintain the quality of the room.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="eventId" value={eventId} />

      {state.error && (
        <div style={{ padding: '12px 14px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', color: 'rgba(255,160,160,0.95)', fontSize: '13px' }}>
          {state.error}
        </div>
      )}

      {/* Pre-filled from Google */}
      <GoogleAccountBadge
        name={userName || 'Google user'}
        email={userEmail || ''}
      />

      <div>
        <FieldLabel>Phone Number <span style={{ color: 'rgba(200,168,75,0.8)' }}>*</span></FieldLabel>
        <PhoneInput />
      </div>

      <div>
        <FieldLabel>Current Role</FieldLabel>
        <SearchSelect name="currentRole" placeholder="Search role…" options={FINANCE_ROLES} />
      </div>

      <div>
        <FieldLabel>Years in Finance</FieldLabel>
        <select name="yearsInFinance" style={{
          width: '100%',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.18)',
          color: '#F2EFE8',
          padding: '11px 14px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          outline: 'none',
          appearance: 'none' as const,
          cursor: 'pointer',
        }}>
          <option value="" style={{ background: '#0F1E37' }}>Select…</option>
          <option value="0-2" style={{ background: '#0F1E37' }}>0 – 2 years</option>
          <option value="2-5" style={{ background: '#0F1E37' }}>2 – 5 years</option>
          <option value="5-10" style={{ background: '#0F1E37' }}>5 – 10 years</option>
          <option value="10+" style={{ background: '#0F1E37' }}>10+ years</option>
        </select>
      </div>

      <div>
        <FieldLabel>City</FieldLabel>
        <SearchSelect name="city" placeholder="Search city…" options={INDIAN_CITIES} />
      </div>

      <div>
        <FieldLabel>LinkedIn Profile</FieldLabel>
        <TextInput name="linkedIn" type="url" placeholder="linkedin.com/in/yourname" />
      </div>

      {tracks.length > 0 && (
        <div>
          <FieldLabel>Track of Interest</FieldLabel>
          <select name="track" style={{
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.14)',
            color: '#F2EFE8',
            padding: '11px 14px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            outline: 'none',
            appearance: 'none' as const,
            cursor: 'pointer',
          }}>
            <option value="" style={{ background: '#0F1E37' }}>Select…</option>
            {tracks.map(t => <option key={t} value={t} style={{ background: '#0F1E37' }}>{t}</option>)}
          </select>
        </div>
      )}

      <SubmitButton />

      <p style={{ fontSize: '11px', color: 'rgba(242,239,232,0.35)', lineHeight: 1.6 }}>
        Registrations are reviewed. A seat is held for you but confirmed only after review.
        No confidential information is shared — sessions use public or hypothetical scenarios.
      </p>
    </form>
  )
}
