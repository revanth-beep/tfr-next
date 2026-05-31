import type { Metadata } from 'next'
import './globals.css'
import { getHomepageContent } from '@/lib/homepage'

export const metadata: Metadata = {
  title: 'The Finance Room',
  description: 'Practitioner-led. Community-driven. Built for serious finance careers.',
  openGraph: {
    title: 'The Finance Room',
    description: 'The room you were never told about. Now open.',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { colorBackground, colorGold, colorText, colorSteelBlue, colorCard } = await getHomepageContent()

  const colorVars = `html{--color-bg:${colorBackground};--color-gold:${colorGold};--color-text:${colorText};--color-steel:${colorSteelBlue};--color-card:${colorCard};}`

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: colorVars }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
