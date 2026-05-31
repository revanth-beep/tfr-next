'use server'

import { cookies } from 'next/headers'
import { prisma } from '@/lib/db'
import { HOMEPAGE_DEFAULTS } from '@/lib/homepage'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function requireAdmin() {
  const token = cookies().get('admin_token')?.value
  if (token !== process.env.ADMIN_SECRET) throw new Error('Unauthorized')
}

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null) ?? ''
}

export async function updateSiteColors(
  prevState: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> {
  try {
    requireAdmin()

    const data = {
      colorBackground: str(formData, 'colorBackground'),
      colorGold:       str(formData, 'colorGold'),
      colorText:       str(formData, 'colorText'),
      colorSteelBlue:  str(formData, 'colorSteelBlue'),
      colorCard:       str(formData, 'colorCard'),
    }

    const existing = await prisma.homepageContent.findUnique({ where: { id: 'main' } })
    if (existing) {
      await prisma.homepageContent.update({ where: { id: 'main' }, data })
    } else {
      await prisma.homepageContent.create({ data: { id: 'main', ...HOMEPAGE_DEFAULTS, ...data } })
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Failed to save colors' }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/events')
  revalidatePath('/admin/colors')
  redirect('/admin/colors')
}
