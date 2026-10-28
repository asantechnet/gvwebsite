import { BriefcaseBusiness, CheckSquare, ClipboardCheck, FileText, GraduationCap, Landmark, MessageCircle, PiggyBank, ShieldCheck, UsersRound } from 'lucide-react'

import PostCard from '@ui/PostCard.jsx'
import useBottomStickySidebar from '@website/hooks/useBottomStickySidebar.js'

const quickLinks = [
  [GraduationCap, 'study', '/opportunities/study'],
  [BriefcaseBusiness, 'work', '/opportunities/work'],
  [PiggyBank, 'investment', '/opportunities/investment'],
  [CheckSquare, 'exams', '/opportunities/exams'],
  [UsersRound, 'migration', '/opportunities/migration'],
  [ShieldCheck, 'visa', '/services/visa'],
]

const quickLabels = {
  prs: { study: 'تحصیل', work: 'کار', investment: 'سرمایه گذاری', exams: 'امتحانات', migration: 'مهاجرت', visa: 'ویزه' },
  ps: { study: 'زده‌کړې', work: 'کار', investment: 'پانګونه', exams: 'ازموینې', migration: 'مهاجرت', visa: 'ویزه' },
  en: { study: 'Study', work: 'Work', investment: 'Investment', exams: 'Exams', migration: 'Migration', visa: 'Visa' },
}

const serviceCardLabels = {
  prs: ['مشاوره', 'درخواست', 'پروسس اسناد', 'ویزه/سفارت', 'ثبت نام بورسیه ها', 'هماهنگی'],
  ps: ['مشوره', 'غوښتنلیک', 'د اسنادو پروسه', 'ویزه/سفارت', 'د بورسونو ثبت نام', 'همغږي'],
  en: ['Consultation', 'Application', 'Document process', 'Visa/Embassy', 'Scholarship registration', 'Coordination'],
}
const serviceCardDefinitions = [[MessageCircle, '/services/consultation'], [FileText, '/services/application'], [ClipboardCheck, '/services/document-process'], [Landmark, '/services/visa'], [GraduationCap, '/services/scholarship-registration'], [UsersRound, '/services/coordination']]

function SidebarCardGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-2">
      {items.map(([Icon, label, href]) => (
        <a key={href} href={href} className="flex flex-col items-center gap-1 rounded-xl border border-border px-2 py-3 text-center text-xs text-foreground-muted transition-colors hover:border-primary hover:text-primary dark:border-gray-600">
          <Icon size={20} />
          <span className="font-bold">{label}</span>
        </a>
      ))}
    </div>
  )
}

function ContentSidebar({ content, category, relatedPosts = [], className = '' }) {
  const sidebarRef = useBottomStickySidebar()
  const language = document.documentElement.lang === 'en' ? 'en' : content.quickAccessLabel === 'چټک لاسرسی' ? 'ps' : 'prs'
  const localizedQuickLinks = quickLinks.map(([Icon, key, href]) => [Icon, quickLabels[language][key], href])
  const serviceCards = serviceCardDefinitions.map(([Icon, href], index) => [Icon, serviceCardLabels[language][index], href])

  return (
    <aside ref={sidebarRef} className={`order-2 h-fit self-start text-right text-sm text-foreground-muted lg:sticky lg:top-[calc(100vh-var(--sidebar-height)-1.5rem)] lg:border-r lg:pr-6 ltr:lg:border-r-0 ltr:lg:border-l ltr:lg:pr-0 ltr:lg:pl-6 ${className}`.trim()}>
      <div className="w-full">
        {category && <div className="flex flex-col items-start gap-3"><span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">{category}</span></div>}
        <div className={`${category ? 'mt-5 border-t border-border pt-5 dark:border-gray-600' : ''} w-full text-right`.trim()}>
          <h2 className="mb-4 text-center font-heading text-lg font-extrabold text-foreground lg:text-right">{content.quickAccessLabel}</h2>
          <SidebarCardGrid items={localizedQuickLinks} />
          <div className="mt-4 pt-2">
            <h2 className="mb-4 text-center font-heading text-lg font-extrabold text-foreground lg:text-right">{language === 'en' ? 'Our services' : language === 'ps' ? 'زموږ خدمتونه' : 'خدمات ما'}</h2>
            <SidebarCardGrid items={serviceCards} />
          </div>
        </div>
        {relatedPosts.length > 0 && (
          <div className="mt-5 w-full border-t border-border pt-5 text-right dark:border-gray-600">
            <h2 className="mb-4 text-center font-heading text-lg font-extrabold text-foreground lg:text-right">{content.relatedLabel}</h2>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-1">
              {relatedPosts.slice(0, 3).map((relatedPost) => <PostCard key={relatedPost.title} post={relatedPost} />)}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default ContentSidebar
