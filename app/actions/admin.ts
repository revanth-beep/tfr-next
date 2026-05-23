'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { generateSlug } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

function requireAdmin() {
  const token = cookies().get('admin_token')?.value
  if (token !== process.env.ADMIN_SECRET) {
    throw new Error('Unauthorized')
  }
}

export async function createEvent(prevState: { error?: string }, formData: FormData) {
  requireAdmin()

  const title = formData.get('title') as string
  if (!title?.trim()) return { error: 'Title is required.' }

  const slug = generateSlug(title)

  const practitioner = JSON.stringify({
    name:       formData.get('practitionerName')       as string || null,
    title:      formData.get('practitionerTitle')      as string || null,
    company:    formData.get('practitionerCompany')    as string || null,
    experience: formData.get('practitionerExperience') as string || null,
    bio:        formData.get('practitionerBio')        as string || null,
  })

  const tracks = (formData.get('tracks') as string) || ''

  await prisma.event.create({
    data: {
      slug,
      title,
      subtitle:    formData.get('subtitle')    as string || null,
      description: formData.get('description') as string,
      date:        new Date(formData.get('date') as string),
      format:      formData.get('format')      as string || 'Online',
      duration:    parseInt(formData.get('duration')   as string) || 60,
      location:    formData.get('location')    as string || null,
      totalSeats:  parseInt(formData.get('totalSeats') as string) || 30,
      topic:       formData.get('topic')       as string || null,
      tracks,
      practitioner,
      coverNote:    formData.get('coverNote')    as string || null,
      recordingUrl: formData.get('recordingUrl') as string || null,
      isPublished:  formData.get('isPublished')  === 'on',
      isFeatured:   formData.get('isFeatured')   === 'on',
    },
  })

  revalidatePath('/')
  revalidatePath('/events')
  revalidatePath('/admin')
  redirect('/admin')
}

export async function updateEvent(id: string, prevState: { error?: string }, formData: FormData) {
  requireAdmin()

  const practitioner = JSON.stringify({
    name:       formData.get('practitionerName')       as string || null,
    title:      formData.get('practitionerTitle')      as string || null,
    company:    formData.get('practitionerCompany')    as string || null,
    experience: formData.get('practitionerExperience') as string || null,
    bio:        formData.get('practitionerBio')        as string || null,
  })

  const tracks = (formData.get('tracks') as string) || ''

  const event = await prisma.event.update({
    where: { id },
    data: {
      title:       formData.get('title')       as string,
      subtitle:    formData.get('subtitle')    as string || null,
      description: formData.get('description') as string,
      date:        new Date(formData.get('date') as string),
      format:      formData.get('format')      as string || 'Online',
      duration:    parseInt(formData.get('duration')   as string) || 60,
      location:    formData.get('location')    as string || null,
      totalSeats:  parseInt(formData.get('totalSeats') as string) || 30,
      topic:       formData.get('topic')       as string || null,
      tracks,
      practitioner,
      coverNote:    formData.get('coverNote')    as string || null,
      recordingUrl: formData.get('recordingUrl') as string || null,
      isPublished:  formData.get('isPublished')  === 'on',
      isFeatured:   formData.get('isFeatured')   === 'on',
    },
  })

  revalidatePath('/')
  revalidatePath('/events')
  revalidatePath(`/events/${event.slug}`)
  revalidatePath('/admin')
  redirect('/admin')
}

export async function deleteEvent(id: string) {
  requireAdmin()
  await prisma.event.delete({ where: { id } })
  revalidatePath('/')
  revalidatePath('/admin')
}

export async function adminLogout() {
  requireAdmin()
  cookies().delete('admin_token')
  redirect('/admin/login')
}
