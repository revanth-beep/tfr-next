import { prisma } from './db'

export type HomepageContent = {
  heroLine1: string
  heroLine2: string
  heroLine3: string
  heroTagline: string
  belief1: string
  belief2: string
  belief3: string
  belief4: string
  whoHeadline: string
  whoHeadlineHighlight: string
  whoBody: string
  insiderLine1: string
  insiderLine2: string
  insiderLine3: string
  insiderBody: string
  insiderNote: string
  insiderPanel1Title: string
  insiderPanel1Body: string
  insiderPanel2Title: string
  insiderPanel2Body: string
  insiderPanel3Title: string
  insiderPanel3Body: string
  eventsPageKicker: string
  eventsPageTitle: string
  eventsPageDescription: string
  eventLabelCovers: string
  eventLabelWho: string
  eventLabelAbout: string
  eventLabelExpect: string
  eventLabelPractitioner: string
  eventLabelIdentity: string
}

export const HOMEPAGE_DEFAULTS: HomepageContent = {
  heroLine1:   'Practitioner-led.',
  heroLine2:   'Community-driven.',
  heroLine3:   'Built for serious finance careers.',
  heroTagline: 'The room you were never told about. Now open.',

  belief1: 'Finance is not learned in classrooms.',
  belief2: 'The best network knows more than you.',
  belief3: 'Judgment cannot be modelled.',
  belief4: 'Access is the actual asset.',

  whoHeadline:          'For those who have done the work — and are ready for',
  whoHeadlineHighlight: "what the work doesn't teach.",
  whoBody: 'If you have ever felt the gap between what finance looks like on paper and how it actually moves — you already understand why The Finance Room exists. This is not for those beginning to learn finance. It is for those who know enough to know what they are still missing.',

  insiderLine1: 'One practitioner.',
  insiderLine2: 'One real decision.',
  insiderLine3: 'No version for the classroom.',
  insiderBody: 'Every significant financial decision has a room behind it — where conviction is tested, where deals live or die, and where judgment matters more than any model. The Insider Series is your way in.',
  insiderNote: 'Free to attend · Live sessions · By application only',

  insiderPanel1Title: 'A real decision, not a case study',
  insiderPanel1Body:  'Every detail that gets removed to make something teachable is the detail that matters most. Nothing is sanitised here.',
  insiderPanel2Title: 'The layer above the technical',
  insiderPanel2Body:  'What shifts a room. What the model missed. The judgment that separates those who understand finance from those who practise it.',
  insiderPanel3Title: 'Access that compounds',
  insiderPanel3Body:  'One session is a perspective shift. A year of sessions is a different career trajectory.',

  eventsPageKicker: 'The Insider Series',
  eventsPageTitle: 'Sessions',
  eventsPageDescription: 'One senior practitioner. One real decision. A small, vetted group who can engage at that level. No recordings. No version for the classroom.',

  eventLabelCovers: 'What this session covers',
  eventLabelWho: 'Who should be in the room',
  eventLabelAbout: 'About this session',
  eventLabelExpect: 'What to expect',
  eventLabelPractitioner: 'The Practitioner',
  eventLabelIdentity: 'Identity disclosed to confirmed attendees',
}

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const row = await prisma.homepageContent.findUnique({ where: { id: 'main' } })
    if (!row) return HOMEPAGE_DEFAULTS
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...fields } = row
    return fields
  } catch {
    return HOMEPAGE_DEFAULTS
  }
}
