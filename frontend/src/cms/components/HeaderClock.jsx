import { useEffect, useMemo, useState } from 'react'
import toEnglishDigits from '@cms/utils/toEnglishDigits.js'

const pashtoMonths = ['وری', 'غویی', 'غبرګولی', 'چنګاښ', 'زمری', 'وږی', 'تله', 'لړم', 'لیندۍ', 'مرغومی', 'سلواغه', 'کب']

function HeaderClock({ language }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const update = () => setNow(new Date()); const timeout = window.setInterval(update, 60_000); return () => window.clearInterval(timeout) }, [])
  const clock = useMemo(() => {
    const timeParts = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kabul' }).formatToParts(now)
    const getPart = (type) => timeParts.find((part) => part.type === type)?.value || ''
    const day = toEnglishDigits(new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'Asia/Kabul' }).format(now))
    const month = Number(new Intl.DateTimeFormat('en-US', { month: 'numeric', timeZone: 'Asia/Kabul' }).format(now))
    return {
      date: language === 'ps' ? `${day} ${pashtoMonths[month - 1]}` : toEnglishDigits(new Intl.DateTimeFormat('fa-AF', { month: 'short', day: 'numeric', timeZone: 'Asia/Kabul' }).format(now)),
      hour: toEnglishDigits(getPart('hour')),
      minute: toEnglishDigits(getPart('minute')),
      period: getPart('dayPeriod') === 'AM' ? (language === 'ps' ? 'سهار' : 'صبح') : (language === 'ps' ? 'مازیګر' : 'عصر'),
    }
  }, [language, now])
  return <time dateTime={now.toISOString()} title="AFG · Asia/Kabul" className="relative hidden h-10 shrink-0 items-center overflow-hidden rounded-xl border border-(--header-control-border) bg-(--header-control) px-3 shadow-[inset_0_1px_0_rgb(255_255_255/.05)] min-[1024px]:flex min-[1280px]:px-3.5"><span className="text-[.6875rem] font-semibold tracking-[.01em] text-admin-muted">{clock.date}</span><span aria-hidden="true" className="mx-2.5 h-4 w-px bg-admin-border min-[1280px]:mx-3" /><span dir="ltr" className="text-[.8125rem] font-bold tabular-nums tracking-[.025em] text-admin-heading">{clock.hour}<span aria-hidden="true" className="cms-clock-separator inline-block text-center">:</span>{clock.minute}</span><span className="mr-1 text-[.6875rem] font-bold tracking-[.04em] text-admin-brand-text">{clock.period}</span></time>
}

export default HeaderClock
