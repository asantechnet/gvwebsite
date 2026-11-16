import { BadgeCheck, BookMarked, BookOpenText, Briefcase, BriefcaseBusiness, Building2, CalendarDays, CircleHelp, ClipboardCheck, Compass, FileCheck2, Flag, Globe2, GraduationCap, Handshake, Heart, House, Languages, Laptop, Landmark, Lightbulb, ListChecks, Mail, MapPinned, MessageCircle, MessagesSquare, Phone, Plane, PlaneTakeoff, School, Search, Settings, ShieldCheck, Star, Stethoscope, UserRound, Users, WalletCards } from 'lucide-react'

// CMS content stores stable names rather than React components. Keeping the
// allowlist here gives editors and public renderers one canonical contract and
// prevents authored snapshot data from being treated as executable UI values.
export const contentIconOptions = [
  ['BriefcaseBusiness', BriefcaseBusiness], ['Briefcase', Briefcase], ['GraduationCap', GraduationCap], ['School', School], ['BookOpenText', BookOpenText], ['BookMarked', BookMarked],
  ['MapPinned', MapPinned], ['Flag', Flag], ['Globe2', Globe2], ['Building2', Building2], ['Landmark', Landmark], ['Plane', Plane], ['PlaneTakeoff', PlaneTakeoff],
  ['Handshake', Handshake], ['Users', Users], ['UserRound', UserRound], ['Heart', Heart], ['Star', Star], ['BadgeCheck', BadgeCheck], ['ShieldCheck', ShieldCheck],
  ['FileCheck2', FileCheck2], ['ClipboardCheck', ClipboardCheck], ['ListChecks', ListChecks], ['Languages', Languages], ['CalendarDays', CalendarDays], ['WalletCards', WalletCards],
  ['Stethoscope', Stethoscope], ['Laptop', Laptop], ['Mail', Mail], ['Phone', Phone], ['MessageCircle', MessageCircle], ['MessagesSquare', MessagesSquare], ['Compass', Compass],
  ['Search', Search], ['Settings', Settings], ['House', House], ['Lightbulb', Lightbulb], ['CircleHelp', CircleHelp],
]

const contentIcons = new Map(contentIconOptions)

export function resolveContentIcon(name, fallbackName = 'CircleHelp') {
  return contentIcons.get(name) || contentIcons.get(fallbackName) || CircleHelp
}
