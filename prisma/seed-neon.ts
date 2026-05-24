import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL!
const sql = neon(DATABASE_URL)

async function upsert(slug: string, values: Record<string, unknown>) {
  const cols = Object.keys(values)
  const setClauses = cols.filter(c => c !== 'slug').map(c => `"${c}" = EXCLUDED."${c}"`).join(', ')
  const colList = cols.map(c => `"${c}"`).join(', ')
  const valList = cols.map((_, i) => `$${i + 1}`).join(', ')
  const vals = Object.values(values)

  await sql.query(
    `INSERT INTO "Event" (${colList}) VALUES (${valList})
     ON CONFLICT (slug) DO UPDATE SET ${setClauses}`,
    vals,
  )
  console.log(`✓ ${values.title}`)
}

async function main() {
  const practitionerPitch = JSON.stringify({
    title: 'Founding Partner',
    company: 'Mid-Market Private Equity Fund',
    experience: '15+ years across fundraising and deal origination',
    bio: 'Has closed three fund cycles and sat on both sides of the LP-GP table. Identity disclosed to confirmed attendees.',
  })

  const practitionerCredit = JSON.stringify({
    title: 'Senior Credit Officer',
    company: 'Large Indian NBFC',
    experience: '12+ years in structured and project finance credit',
    bio: 'Has underwritten over ₹3,000 crore in structured transactions. Identity disclosed to confirmed attendees.',
  })

  const practitionerDealRoom = JSON.stringify({
    title: 'Director',
    company: 'Leading Indian PE Fund',
    experience: '10+ years buyside experience',
    bio: 'This practitioner has participated in investment committees for significant capital deployments across multiple market cycles and deal structures. Identity disclosed to confirmed attendees.',
  })

  const practitionerMerger = JSON.stringify({
    title: 'Managing Director',
    company: 'Global Advisory Practice',
    experience: '14+ years in cross-border M&A and strategic advisory',
    bio: 'Has advised on transactions exceeding $4bn in aggregate deal value across India, Southeast Asia, and the Middle East. Identity disclosed to confirmed attendees.',
  })

  const practitionerPortfolio = JSON.stringify({
    title: 'Partner',
    company: 'Operationally-Focused Growth Fund',
    experience: '11+ years in private equity with active portfolio management',
    bio: 'Has managed turnarounds across consumer, B2B SaaS, and services portfolio companies. Identity disclosed to confirmed attendees.',
  })

  await upsert('session-00-the-pitch-that-nearly-didnt-happen', {
    id: 'cm0past01tfr0000000000001',
    slug: 'session-00-the-pitch-that-nearly-didnt-happen',
    title: 'The Pitch That Nearly Didn\'t Happen',
    subtitle: 'How a ₹200 Crore Fundraise Was Rebuilt the Night Before the IC',
    description: `₹200 crore fundraises are not won in boardrooms. They are won in the weeks before — when the story keeps breaking and the team has to decide whether to be honest about it or smooth it over.

This is the session about being honest about it.

A founding partner from a mid-market fund walks through a live fundraise — the LP conversation that went quiet for three months, the co-investor who pulled out the night before the investment committee, and the single data point that changed the room.

You will hear what it sounds like when conviction has to speak for itself. No deck. No model. Just judgement and everything it costs.`,
    coverNote: 'The final close announcement is always a lie of omission. This is what they left out.',
    date: new Date('2026-03-20T17:00:00+05:30'),
    format: 'Online',
    duration: 60,
    totalSeats: 30,
    topic: 'PE/VC Investments',
    tracks: 'PE/VC, Strategy & Corporate Finance',
    practitioner: practitionerPitch,
    isPublished: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  await upsert('session-00b-the-credit-call', {
    id: 'cm0past02tfr0000000000002',
    slug: 'session-00b-the-credit-call',
    title: 'The Credit Call',
    subtitle: 'Reading a Borrower When the Numbers Are Telling You What You Want to Hear',
    description: `Credit analysis is easy when the numbers are bad. Everyone says no. The hard calls are the ones where the DSCR is fine, the collateral looks right, and something still feels wrong.

This session is about that feeling — and how to trust it.

A senior credit officer from a large NBFC walks through a structured lending decision that went sideways. Not because of what was in the CMA. Because of what wasn't.

Participants work through the information set in real time — challenged to identify the signals the underwriting model couldn't capture. The debrief covers what the credit committee saw, what they missed, and how the situation eventually resolved.`,
    coverNote: 'The model said yes. The room said something else. Here\'s what the room knew.',
    date: new Date('2026-04-24T17:00:00+05:30'),
    format: 'Online',
    duration: 75,
    totalSeats: 30,
    topic: 'Credit & Fixed Income',
    tracks: 'Credit & Lending, Banking & Treasury, Risk & Compliance',
    practitioner: practitionerCredit,
    isPublished: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  await upsert('session-01-inside-the-deal-room', {
    id: 'cm0session01tfr000000000',
    slug: 'session-01-inside-the-deal-room',
    title: 'Inside the Deal Room',
    subtitle: 'What Happens Before a PE Fund Puts ₹500 Crore on the Table',
    description: `₹500 crore does not move because a model said so. It moves because someone — with years of pattern recognition and instinct built from failure and success across cycles — decided it should.

This session is not about the model. It is about the person running it.

A director-level professional from a leading Indian PE fund walks you through a real investment decision. Not the version in the annual report. The actual version — the conversations with the management team, the moment they nearly walked away, the thing they noticed in the data room that nobody else picked up on.

You will be asked what you would do. You will be challenged on it. You will see where your reasoning holds and where it doesn't.

You don't leave with notes. You leave seeing your work differently.`,
    coverNote: '₹500 crore does not move because a model said so. It moves because someone decided it should.',
    date: new Date('2026-05-22T16:00:00+05:30'),
    format: 'Online',
    duration: 60,
    totalSeats: 30,
    topic: 'PE/VC Investments',
    tracks: 'PE/VC, Wealth & Investments, Strategy & Corporate Finance',
    practitioner: practitionerDealRoom,
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  await upsert('session-02-the-merger-table', {
    id: 'cm0future01tfr000000000003',
    slug: 'session-02-the-merger-table',
    title: 'The Merger Table',
    subtitle: 'What the Bankers Don\'t Tell the Board — and What the Board Doesn\'t Ask',
    description: `Every M&A announcement comes with a fairness opinion and a press release. Neither of them explains why the deal happened.

The real conversation happens before the bankers are even formally mandated — in a room where the strategic logic is still rough, the price hasn't been anchored, and the outcome is genuinely uncertain.

A managing director from a bulge-bracket advisory practice walks through a cross-border acquisition they ran. The target management that didn't want to sell. The competing bid that appeared on day eleven. The valuation argument the board accepted and the one they quietly rejected.

You will be asked to advise the board. Your recommendation will be challenged. You will see how the room actually works.`,
    coverNote: 'Every merger has a moment before the process starts. This session takes you there.',
    date: new Date('2026-06-19T17:00:00+05:30'),
    format: 'Online',
    duration: 60,
    totalSeats: 30,
    topic: 'Investment Banking & M&A',
    tracks: 'Investment Banking, Strategy & Corporate Finance, PE/VC',
    practitioner: practitionerMerger,
    isPublished: true,
    isFeatured: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  await upsert('session-03-the-portfolio-company', {
    id: 'cm0future02tfr000000000004',
    slug: 'session-03-the-portfolio-company',
    title: 'The Portfolio Company',
    subtitle: 'When the Business You Backed Stops Performing — and What You Actually Do',
    description: `The investment memo said the management team was the asset. Two years in, the management team is the problem.

This is the conversation most PE case studies skip — the board call where the numbers are off plan, the founder is defensive, and everyone in the room knows the options are bad.

A partner from an operationally-focused growth fund walks through a real portfolio intervention. The metrics that triggered concern. The conversation they had with the founder. The decision to bring in an operating advisor, and everything that went wrong before it went right.

Participants work through the information as it was available at each stage — advising the investment team in real time. The debrief covers what was knowable, what was a judgment call, and what changed the outcome.`,
    coverNote: 'Every fund has a portfolio company like this. Most GPs won\'t talk about it. This one will.',
    date: new Date('2026-07-17T17:00:00+05:30'),
    format: 'Online',
    duration: 60,
    totalSeats: 30,
    topic: 'PE/VC Investments',
    tracks: 'PE/VC, Strategy & Corporate Finance',
    practitioner: practitionerPortfolio,
    isPublished: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

main()
  .then(() => { console.log('\nAll events seeded to Neon ✓') })
  .catch(e => { console.error(e); process.exit(1) })
