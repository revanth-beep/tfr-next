import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/nav'
import { EventFlash } from '@/components/event-flash'
import { Footer } from '@/components/footer'
import { Providers } from '@/components/providers'
import { Loader } from '@/components/loader'
import { prisma } from '@/lib/db'

export const metadata: Metadata = {
  title: 'The Finance Room',
  description: 'Practitioner-led. Community-driven. Built for serious finance careers.',
  openGraph: {
    title: 'The Finance Room',
    description: 'The room you were never told about. Now open.',
    type: 'website',
  },
}

async function getUpcomingEvent() {
  try {
    const event = await prisma.event.findFirst({
      where: { isPublished: true, isFeatured: true },
      select: { title: true, slug: true, date: true },
      orderBy: { date: 'asc' },
    })
    if (!event) return null
    return { title: event.title, slug: event.slug, date: event.date.toISOString() }
  } catch {
    return null
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const upcomingEvent = await getUpcomingEvent()

  return (
    <html lang="en">
      <body>
        <Loader />
        <div id="pb" aria-hidden="true" />
        <Providers>
          <Nav upcomingEvent={upcomingEvent} />
          <EventFlash event={upcomingEvent} />
          <main>{children}</main>
          <Footer />
        </Providers>
        <script dangerouslySetInnerHTML={{ __html: PROGRESS_SCRIPT }} />
      </body>
    </html>
  )
}

const PROGRESS_SCRIPT = `
(function(){
  var pb=document.getElementById('pb');
  if(pb){
    window.addEventListener('scroll',function(){
      var y=window.scrollY,t=document.body.scrollHeight-window.innerHeight;
      pb.style.transform='scaleX('+(t>0?y/t:0)+')';
    },{passive:true});
  }
})();
`
