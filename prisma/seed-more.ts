import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ── Past events ──────────────────────────────────────────────────────────────

  const e1 = await prisma.event.upsert({
    where: { slug: 'session-00-the-pitch-that-nearly-didnt-happen' },
    update: {},
    create: {
      slug:     'session-00-the-pitch-that-nearly-didnt-happen',
      title:    'The Pitch That Nearly Didn\'t Happen',
      subtitle: 'How a ₹200 Crore Fundraise Was Rebuilt the Night Before the IC',
      description: `Fundraising decks are written for committees, not for truth. The version you see in the final close announcement is the sixth draft — cleaned up, tightened, and stripped of every near-miss that almost killed the deal.

This session is the fifth draft.

A founding partner from a mid-market fund walks through a live fundraise — the LP conversation that went quiet for three months, the co-investor who pulled out the night before the investment committee, and the single slide that changed the room.

You will hear what it sounds like when conviction has to speak for itself. No deck. No model. Just judgement and everything it costs.`,
      coverNote:    'The final close announcement is always a lie of omission. This is everything they left out.',
      date:         new Date('2026-03-20T17:00:00+05:30'),
      format:       'Online',
      duration:     60,
      totalSeats:   30,
      topic:        'PE/VC Investments',
      tracks:       'PE/VC, Strategy & Corporate Finance',
      practitioner: JSON.stringify({
        title:      'Founding Partner',
        company:    'Mid-Market Private Equity Fund',
        experience: '15+ years across fundraising, deal origination, and portfolio management',
        bio:        'Has closed three fund cycles and sat on both sides of the LP-GP table. Identity disclosed to confirmed attendees.',
      }),
      isPublished: true,
      isFeatured:  false,
    },
  })

  const e2 = await prisma.event.upsert({
    where: { slug: 'session-00b-the-credit-call' },
    update: {},
    create: {
      slug:     'session-00b-the-credit-call',
      title:    'The Credit Call',
      subtitle: 'Reading a Borrower When the Numbers Are Telling You What You Want to Hear',
      description: `Credit analysis is easy when the numbers are bad. Everyone says no. The hard calls are the ones where the DSCR is fine, the collateral looks right, and something still feels wrong.

This session is about that feeling — and how to trust it.

A senior credit officer from a large NBFC walks through a structured lending decision that went sideways. Not because of what was in the CMA. Because of what wasn't.

Participants will work through the information set in real time — challenged to identify the signals that the underwriting model couldn't capture. The debrief covers what the credit committee saw, what they missed, and how the situation eventually resolved.`,
      coverNote:    'The model said yes. The room said something else. Here\'s what the room knew.',
      date:         new Date('2026-04-24T17:00:00+05:30'),
      format:       'Online',
      duration:     75,
      totalSeats:   30,
      topic:        'Credit & Fixed Income',
      tracks:       'Credit & Lending, Banking & Treasury, Risk & Compliance',
      practitioner: JSON.stringify({
        title:      'Senior Credit Officer',
        company:    'Large Indian NBFC',
        experience: '12+ years in structured and project finance credit',
        bio:        'Has underwritten over ₹3,000 crore in structured transactions. Identity disclosed to confirmed attendees.',
      }),
      isPublished: true,
      isFeatured:  false,
    },
  })

  // ── Future events ────────────────────────────────────────────────────────────

  const e3 = await prisma.event.upsert({
    where: { slug: 'session-02-the-merger-table' },
    update: {},
    create: {
      slug:     'session-02-the-merger-table',
      title:    'The Merger Table',
      subtitle: 'What the Bankers Don\'t Tell the Board — and What the Board Doesn\'t Ask',
      description: `Every M&A announcement comes with a fairness opinion and a press release. Neither of them explains why the deal happened.

The real conversation happens before the bankers are even formally mandated — in a room where the strategic logic is still rough, the price hasn't been anchored, and the outcome is genuinely uncertain.

A managing director from a bulge-bracket advisory practice walks through a cross-border acquisition they ran. The target management that didn't want to sell. The competing bid that appeared on day eleven. The valuation argument that the board accepted and the one that they quietly rejected.

You will be asked to advise the board. Your recommendation will be challenged. You will see how the room actually works.`,
      coverNote:    'Every merger has a moment before the process starts. This session takes you there.',
      date:         new Date('2026-06-19T17:00:00+05:30'),
      format:       'Online',
      duration:     60,
      totalSeats:   30,
      topic:        'Investment Banking & M&A',
      tracks:       'Investment Banking, Strategy & Corporate Finance, PE/VC',
      practitioner: JSON.stringify({
        title:      'Managing Director',
        company:    'Global Advisory Practice',
        experience: '14+ years in cross-border M&A and strategic advisory',
        bio:        'Has advised on transactions exceeding $4bn in aggregate deal value across India, Southeast Asia, and the Middle East. Identity disclosed to confirmed attendees.',
      }),
      isPublished: true,
      isFeatured:  true,
    },
  })

  const e4 = await prisma.event.upsert({
    where: { slug: 'session-03-the-portfolio-company' },
    update: {},
    create: {
      slug:     'session-03-the-portfolio-company',
      title:    'The Portfolio Company',
      subtitle: 'When the Business You Backed Stops Performing — and What You Actually Do',
      description: `The investment memo said the management team was the asset. Two years in, the management team is the problem.

This is the conversation most PE case studies skip — the board call where the numbers are off plan, the founder is defensive, and everyone in the room knows the options are bad.

A partner from an operationally-focused growth fund walks through a real portfolio intervention. The metrics that triggered concern. The conversation they had to have with the founder. The decision to bring in an operating advisor, and everything that went wrong before it went right.

Participants work through the information as it was available at each stage — advising the investment team in real time. The debrief covers what was knowable, what was a judgment call, and what changed the outcome.`,
      coverNote:    'Every fund has a portfolio company like this. Most GPs won\'t talk about it. This one will.',
      date:         new Date('2026-07-17T17:00:00+05:30'),
      format:       'Online',
      duration:     60,
      totalSeats:   30,
      topic:        'PE/VC Investments',
      tracks:       'PE/VC, Strategy & Corporate Finance',
      practitioner: JSON.stringify({
        title:      'Partner',
        company:    'Operationally-Focused Growth Fund',
        experience: '11+ years in private equity with active portfolio management',
        bio:        'Has managed turnarounds and transitions across consumer, B2B SaaS, and services portfolio companies. Identity disclosed to confirmed attendees.',
      }),
      isPublished: true,
      isFeatured:  false,
    },
  })

  console.log(`✓ ${e1.title}`)
  console.log(`✓ ${e2.title}`)
  console.log(`✓ ${e3.title}`)
  console.log(`✓ ${e4.title}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
