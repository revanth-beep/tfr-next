'use client'

const WORDS = [
  'Practitioner-led',
  'Community-driven',
  'Online',
  'By application only',
  'Vetted groups',
  'One practitioner',
  'Real decisions',
  'Unsanitized judgment',
  'Serious finance careers',
  'Access is the asset',
  '≤12 per session',
  'Invite-only',
  'Live sessions',
  'Senior practitioners',
  'No information diet',
]

export function Ticker() {
  const doubled = [...WORDS, ...WORDS]
  return (
    <div className="overflow-hidden py-[11px]" style={{ background: '#C8A84B' }}>
      <div className="flex whitespace-nowrap animate-marq">
        {doubled.map((word, i) => (
          <span key={i} className="flex items-center">
            <span
              className="px-5"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '9px',
                fontWeight: 500,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#08080F',
              }}
            >
              {word}
            </span>
            <span style={{ color: 'rgba(8,8,15,0.35)', fontSize: '9px' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
