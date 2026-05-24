'use client'

import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Props {
  eventSlug: string
  isFull: boolean
  size?: 'default' | 'large'
  label?: string
}

export function GoogleRegisterButton({ eventSlug, isFull, size = 'default', label }: Props) {
  const { data: session } = useSession()
  const router = useRouter()

  const isLarge = size === 'large'

  if (isFull) {
    return (
      <div
        className="flex items-center justify-center gap-3 border"
        style={{
          padding: isLarge ? '18px 40px' : '14px 28px',
          borderColor: 'rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.03)',
          color: 'rgba(242,239,232,0.4)',
          fontSize: isLarge ? '13px' : '11px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        Session Full
      </div>
    )
  }

  if (session?.user) {
    return (
      <button
        onClick={() => router.push(`/events/${eventSlug}`)}
        className="pulse-gold flex items-center justify-center gap-3 w-full transition-opacity hover:opacity-90"
        style={{
          padding: isLarge ? '18px 40px' : '14px 28px',
          background: '#C8A84B',
          color: '#09162A',
          fontSize: isLarge ? '13px' : '11px',
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Complete Registration →
      </button>
    )
  }

  return (
    <button
      onClick={() => signIn('google', { callbackUrl: `/events/${eventSlug}` })}
      className="pulse-gold flex items-center justify-center gap-3 w-full transition-opacity hover:opacity-90"
      style={{
        padding: isLarge ? '18px 40px' : '14px 28px',
        background: '#C8A84B',
        color: '#09162A',
        fontSize: isLarge ? '13px' : '11px',
        fontWeight: 600,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <GoogleIcon size={isLarge ? 20 : 16} />
      {label ?? 'Reserve Your Seat'}
    </button>
  )
}

function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#09162A"
        fillOpacity="0.7"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#09162A"
        fillOpacity="0.7"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#09162A"
        fillOpacity="0.5"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#09162A"
        fillOpacity="0.6"
      />
    </svg>
  )
}
