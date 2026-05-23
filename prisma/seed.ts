import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const event = await prisma.event.upsert({
    where: { slug: 'session-01-inside-the-deal-room' },
    update: {},
    create: {
      slug:        'session-01-inside-the-deal-room',
      title:       'Inside the Deal Room',
      subtitle:    'What Happens Before a PE Fund Puts ₹500 Crore on the Table',
      description: `₹500 crore does not move because a model said so. It moves because someone — with years of pattern recognition and instinct built from failure and success across cycles — decided it should.

This session is not about the model. It is about the person running it.

A director-level professional from a leading Indian PE fund walks you through a real investment decision. Not the version in the annual report. The actual version — the conversations with the management team, the moment they nearly walked away, the thing they noticed in the data room that nobody else picked up on.

You will be asked what you would do. You will be challenged on it. You will see where your reasoning holds and where it doesn't.

You don't leave with notes. You leave seeing your work differently.`,
      coverNote:   '₹500 crore does not move because a model said so. It moves because someone decided it should.',
      date:        new Date('2026-05-22T16:00:00+05:30'),
      format:      'Online',
      duration:    60,
      totalSeats:  30,
      topic:       'PE/VC Investments',
      tracks:       'PE/VC, Wealth & Investments, Strategy & Corporate Finance',
      practitioner: JSON.stringify({
        title:      'Director',
        company:    'Leading Indian PE Fund',
        experience: '10+ years buyside experience',
        bio:        'This practitioner has participated in investment committees for significant capital deployments across multiple market cycles and deal structures. Identity disclosed to confirmed attendees.',
      }),
      isPublished: true,
      isFeatured:  true,
    },
  })

  console.log(`✓ Seeded event: "${event.title}" (slug: ${event.slug})`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
