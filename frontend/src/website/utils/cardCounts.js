export const SCHOLARSHIPS_PER_PAGE = 10
export const STUDY_DIRECTORY_CARD_LIMIT = 3

export function getMagazinePostsPerPage(width = typeof window === 'undefined' ? 0 : window.innerWidth) {
  if (width >= 1536) return 9
  if (width >= 1024) return 8
  if (width >= 768) return 6
  return 4
}

export function getCarouselVisibleCount(width = typeof window === 'undefined' ? 0 : window.innerWidth) {
  if (width >= 1024) return 4
  if (width >= 768) return 2
  return 1
}

export function getVisibleCardCount(total, limit = Number.POSITIVE_INFINITY) {
  const safeTotal = Math.max(0, Number(total) || 0)
  return Math.min(safeTotal, limit)
}
