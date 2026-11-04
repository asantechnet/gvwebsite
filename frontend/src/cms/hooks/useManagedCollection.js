import { useMemo } from 'react'

import useCmsDraftState from '@cms/hooks/useCmsDraftState.js'
import { normalizeContentRecord } from '@/shared/models/content.js'

const opportunityKeys = ['study', 'migration', 'work', 'investment', 'exams']

function removeSavedStatus(item) {
  const committed = { ...item }
  delete committed.savedStatus
  return committed
}

function createInitialDraft({ isServices, isTourism, services, tourism }) {
  if (isServices) return services || []
  if (isTourism) {
    return Object.entries(tourism || {}).flatMap(([type, section]) => section.cards.map((card) => ({
      ...card,
      id: `${type}:${card.slug}`,
      type,
      title: card.name,
      category: section.cardsTitle,
      href: `/tourism/${type}/${card.slug}`,
      status: 'published',
    })))
  }
  return {}
}

function commitDraft(draft) {
  return Array.isArray(draft)
    ? draft.map(removeSavedStatus)
    : Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, { status: value.status }]))
}

function useManagedCollection({ pageKey, label, services, tourism, opportunities, exams }) {
  const isServices = Array.isArray(services)
  const isTourism = Boolean(tourism)
  const [draft, setDraft] = useCmsDraftState(
    `collection:${pageKey}`,
    () => createInitialDraft({ isServices, isTourism, services, tourism }),
    { commit: commitDraft },
  )

  const cards = useMemo(() => {
    if (isServices) {
      return draft.map((service) => normalizeContentRecord({
        ...service,
        id: service.slug,
        href: `/services/${service.slug}`,
        status: service.status || 'published',
        category: label,
      }))
    }
    if (isTourism) return draft.map(normalizeContentRecord)

    const opportunityCards = opportunityKeys.flatMap((key) => opportunities?.[key]?.post ? [{
      ...opportunities[key].post,
      id: key,
      href: `/opportunities/${key}`,
      status: draft[key]?.status || 'published',
      savedStatus: draft[key]?.savedStatus,
    }] : [])
    const ielts = exams?.find((exam) => exam.slug === 'ielts')
    if (ielts) {
      opportunityCards.push({
        title: ielts.name,
        description: ielts.summary,
        category: ielts.category,
        image: ielts.image || '/assets/images/destinations/france.webp',
        href: '/opportunities/exams/ielts',
        id: 'ielts',
        status: draft.ielts?.status || 'published',
        savedStatus: draft.ielts?.savedStatus,
      })
    }
    return opportunityCards.map(normalizeContentRecord)
  }, [draft, exams, isServices, isTourism, label, opportunities])

  const toggleStatus = (card) => {
    setDraft((current) => {
      if (Array.isArray(current)) {
        const identityKey = isServices ? 'slug' : 'id'
        const identity = isServices ? card.slug : card.id
        return current.map((item) => item[identityKey] === identity ? {
          ...item,
          status: item.status === 'draft' ? 'published' : 'draft',
          savedStatus: item.savedStatus ?? item.status,
        } : item)
      }
      return {
        ...current,
        [card.id]: {
          status: card.status === 'draft' ? 'published' : 'draft',
          savedStatus: current[card.id]?.savedStatus ?? card.status,
        },
      }
    })
  }

  const savePost = (savedPost, activeType) => {
    if (!isServices && !isTourism) return
    setDraft((current) => {
      if (isServices) {
        return current.some((service) => service.slug === savedPost.slug)
          ? current.map((service) => service.slug === savedPost.slug ? { ...service, ...savedPost } : service)
          : [...current, savedPost]
      }
      return current.some((item) => item.id === savedPost.id)
        ? current.map((item) => item.id === savedPost.id ? { ...item, ...savedPost, title: savedPost.title || item.title } : item)
        : [...current, { ...savedPost, id: `${activeType}:${savedPost.slug}`, type: activeType, title: savedPost.title, href: `/tourism/${activeType}/${savedPost.slug}` }]
    })
  }

  return { cards, isServices, isTourism, savePost, toggleStatus }
}

export default useManagedCollection
