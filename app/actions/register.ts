'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export type RegisterState = {
  success?: boolean
  error?: string
  alreadyRegistered?: boolean
}

export async function registerForEvent(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { error: 'Please sign in with Google to register.' }
  }

  const eventId        = formData.get('eventId')        as string
  const track          = formData.get('track')          as string
  const currentRole    = formData.get('currentRole')    as string
  const yearsInFinance = formData.get('yearsInFinance') as string
  const city           = formData.get('city')           as string

  if (!eventId) return { error: 'Invalid event.' }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { _count: { select: { registrations: true } } },
  })
  if (!event || !event.isPublished) return { error: 'Event not found.' }

  const seatsLeft = event.totalSeats - event._count.registrations
  if (seatsLeft <= 0) return { error: 'This session is full.' }

  const existing = await prisma.registration.findUnique({
    where: { eventId_userId: { eventId, userId: session.user.id } },
  })
  if (existing) return { success: true, alreadyRegistered: true }

  await prisma.registration.create({
    data: {
      eventId,
      userId: session.user.id,
      track:          track || null,
      currentRole:    currentRole || null,
      yearsInFinance: yearsInFinance || null,
      city:           city || null,
    },
  })

  revalidatePath(`/events/${event.slug}`)
  revalidatePath('/')

  return { success: true }
}
