'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function requireAdmin() {
  const token = cookies().get('admin_token')?.value
  if (token !== process.env.ADMIN_SECRET) throw new Error('Unauthorized')
}

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null) ?? ''
}

export async function updateHomepageContent(
  prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  requireAdmin()

  const data = {
    heroLine1:   str(formData, 'heroLine1'),
    heroLine2:   str(formData, 'heroLine2'),
    heroLine3:   str(formData, 'heroLine3'),
    heroTagline: str(formData, 'heroTagline'),

    belief1: str(formData, 'belief1'),
    belief2: str(formData, 'belief2'),
    belief3: str(formData, 'belief3'),
    belief4: str(formData, 'belief4'),

    whoHeadline:          str(formData, 'whoHeadline'),
    whoHeadlineHighlight: str(formData, 'whoHeadlineHighlight'),
    whoBody:              str(formData, 'whoBody'),

    insiderLine1: str(formData, 'insiderLine1'),
    insiderLine2: str(formData, 'insiderLine2'),
    insiderLine3: str(formData, 'insiderLine3'),
    insiderBody:  str(formData, 'insiderBody'),
    insiderNote:  str(formData, 'insiderNote'),

    insiderPanel1Title: str(formData, 'insiderPanel1Title'),
    insiderPanel1Body:  str(formData, 'insiderPanel1Body'),
    insiderPanel2Title: str(formData, 'insiderPanel2Title'),
    insiderPanel2Body:  str(formData, 'insiderPanel2Body'),
    insiderPanel3Title: str(formData, 'insiderPanel3Title'),
    insiderPanel3Body:  str(formData, 'insiderPanel3Body'),

    eventsPageKicker:      str(formData, 'eventsPageKicker'),
    eventsPageTitle:       str(formData, 'eventsPageTitle'),
    eventsPageDescription: str(formData, 'eventsPageDescription'),

    eventLabelCovers:       str(formData, 'eventLabelCovers'),
    eventLabelWho:          str(formData, 'eventLabelWho'),
    eventLabelAbout:        str(formData, 'eventLabelAbout'),
    eventLabelExpect:       str(formData, 'eventLabelExpect'),
    eventLabelPractitioner: str(formData, 'eventLabelPractitioner'),
    eventLabelIdentity:     str(formData, 'eventLabelIdentity'),

    colorBackground: str(formData, 'colorBackground'),
    colorGold:       str(formData, 'colorGold'),
    colorText:       str(formData, 'colorText'),
    colorSteelBlue:  str(formData, 'colorSteelBlue'),
    colorCard:       str(formData, 'colorCard'),
  }

  await prisma.homepageContent.upsert({
    where:  { id: 'main' },
    update: data,
    create: { id: 'main', ...data },
  })

  revalidatePath('/')
  revalidatePath('/events')
  revalidatePath('/admin/homepage')
  redirect('/admin/homepage')
}
