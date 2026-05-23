'use client'

import { useEffect, useState } from 'react'

interface CountdownProps {
  targetDate: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    function calculate(): TimeLeft | null {
      const diff = targetDate.getTime() - Date.now()
      if (diff <= 0) return null
      return {
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      }
    }

    setTimeLeft(calculate())
    const timer = setInterval(() => setTimeLeft(calculate()), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (!timeLeft) {
    return (
      <span
        className="text-[11px] tracking-[0.2em] uppercase"
        style={{ color: '#C8A84B' }}
      >
        Event live
      </span>
    )
  }

  const units = [
    { label: 'Days',    value: timeLeft.days },
    { label: 'Hours',   value: timeLeft.hours },
    { label: 'Min',     value: timeLeft.minutes },
    { label: 'Sec',     value: timeLeft.seconds },
  ]

  return (
    <div className="flex items-center gap-4">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-4">
          <div className="text-center">
            <div
              className="font-display font-bold tabular-nums"
              style={{ fontSize: '28px', color: '#C8A84B', lineHeight: 1 }}
            >
              {String(value).padStart(2, '0')}
            </div>
            <div
              className="text-[9px] tracking-[0.2em] uppercase mt-1"
              style={{ color: 'rgba(242,239,232,0.4)' }}
            >
              {label}
            </div>
          </div>
          {i < units.length - 1 && (
            <span
              className="font-display font-bold pb-4"
              style={{ fontSize: '20px', color: 'rgba(200,168,75,0.4)' }}
            >
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
