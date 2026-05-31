import { Nav } from '@/components/nav'
import { EventFlash } from '@/components/event-flash'
import { Footer } from '@/components/footer'
import { Providers } from '@/components/providers'
import { Loader } from '@/components/loader'
import { PageTransition } from '@/components/page-transition'
import { ChromeOffset } from '@/components/chrome-offset'
import { prisma } from '@/lib/db'
import { getHomepageContent } from '@/lib/homepage'

async function getUpcomingEvent() {
  try {
    const event = await prisma.event.findFirst({
      where: { isPublished: true, date: { gte: new Date() } },
      select: { title: true, slug: true, date: true },
      orderBy: [{ isFeatured: 'desc' }, { date: 'asc' }],
    })
    if (!event) return null
    return { title: event.title, slug: event.slug, date: event.date.toISOString() }
  } catch {
    return null
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [upcomingEvent, content] = await Promise.all([getUpcomingEvent(), getHomepageContent()])
  const { instagramUrl, linkedinUrl } = content

  return (
    <Providers>
      <Loader />
      <div id="pb" aria-hidden="true" />
      <ChromeOffset />
      <div id="site-chrome" className="fixed top-0 left-0 right-0 z-50">
        <EventFlash event={upcomingEvent} />
        <Nav upcomingEvent={upcomingEvent} instagramUrl={instagramUrl} />
      </div>
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer instagramUrl={instagramUrl} linkedinUrl={linkedinUrl} />
      <script dangerouslySetInnerHTML={{ __html: PROGRESS_SCRIPT }} />
    </Providers>
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
