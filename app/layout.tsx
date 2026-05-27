import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'The Finance Room',
  description: 'Practitioner-led. Community-driven. Built for serious finance careers.',
  openGraph: {
    title: 'The Finance Room',
    description: 'The room you were never told about. Now open.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
