'use client'

import { deleteEvent } from '@/app/actions/admin'

interface Props {
  eventId: string
  eventTitle: string
}

export function DeleteEventButton({ eventId, eventTitle }: Props) {
  return (
    <form
      action={deleteEvent.bind(null, eventId)}
      onSubmit={e => {
        if (!confirm(`Delete "${eventTitle}"? This cannot be undone.`)) {
          e.preventDefault()
        }
      }}
    >
      <button
        type="submit"
        className="text-[11px] tracking-[0.1em] uppercase"
        style={{ color: 'rgba(255,100,100,0.5)' }}
      >
        Delete
      </button>
    </form>
  )
}
