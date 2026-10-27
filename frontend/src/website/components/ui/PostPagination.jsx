import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'

function getPageItems(totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  return [1, 2, 3, 4, 5, 'ellipsis', totalPages - 1, totalPages]
}

function getMobilePageItems(totalPages) {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  return [1, 2, 'ellipsis', totalPages - 1, totalPages]
}

function PostPagination({ currentPage, totalPages, onPageChange, labels, className = '', compact = false }) {
  if (totalPages <= 1) return null
  const buttonClass = `flex ${compact ? 'size-7 text-xs sm:size-8 sm:rounded-lg' : 'size-8 text-sm sm:size-9 sm:rounded-xl'} shrink-0 items-center justify-center rounded-lg border border-[#e8cdbb] bg-background font-semibold text-foreground-muted transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary focus:outline-none focus-visible:border-primary focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-[#222d3b] dark:text-gray-200 dark:hover:border-primary dark:hover:bg-primary/20 dark:hover:text-primary`
  const pageItems = getPageItems(totalPages)
  const mobilePageItems = getMobilePageItems(totalPages)

  const renderPageItems = (items) => items.map((page, index) => typeof page === 'number' ? <button key={page} type="button" onClick={() => onPageChange(page)} className={`${buttonClass} ${currentPage === page ? '!border-primary !bg-primary !text-[#fff8f3]' : ''}`} aria-label={`${labels.page} ${page}`} aria-current={currentPage === page ? 'page' : undefined}>{page}</button> : <span key={`${page}-${index}`} className="flex size-8 shrink-0 items-center justify-center text-sm text-foreground-muted sm:size-9" aria-hidden="true">…</span>)

  return <nav className={`mt-8 flex max-w-full flex-wrap items-center justify-center gap-1 px-1 sm:gap-2 sm:px-0 ${className}`.trim()} aria-label={labels.navigation}>
    <button className={buttonClass} type="button" onClick={() => onPageChange(1)} disabled={currentPage === 1} aria-label={labels.first}><ChevronsRight className="size-4 md:size-[17px]" /></button>
    <button className={buttonClass} type="button" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label={labels.previous}><ChevronRight className="size-4 md:size-[17px]" /></button>
    <span className="contents md:hidden">{renderPageItems(mobilePageItems)}</span>
    <span className="hidden md:contents">{renderPageItems(pageItems)}</span>
    <button className={buttonClass} type="button" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label={labels.next}><ChevronLeft className="size-4 md:size-[17px]" /></button>
    <button className={buttonClass} type="button" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} aria-label={labels.last}><ChevronsLeft className="size-4 md:size-[17px]" /></button>
  </nav>
}

export default PostPagination
