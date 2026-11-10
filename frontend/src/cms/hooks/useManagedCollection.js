import { useMemo } from 'react'

import useCmsDraftState from '@cms/hooks/useCmsDraftState.js'
import { normalizeContentRecord } from '@/shared/models/content.js'

const opportunityKeys = ['study', 'migration', 'work', 'investment', 'exams']

function removeSavedStatus(item) {
  const committed = { ...item }
  delete committed.savedStatus
  return committed
}

function createInitialDraft({ isServices, isTourism, services, tourism, opportunities, exams }) {
  if (isServices) return (services || []).map((service) => ({
    ...service,
    status: service.status === 'draft' ? 'draft' : 'published',
  }))
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
  const records = opportunityKeys.flatMap((key) => opportunities?.[key]?.post ? [{
    ...opportunities[key].post,
    id: key,
    slug: opportunities[key].post.slug || key,
    type: key,
    href: `/opportunities/${key}`,
    status: 'published',
  }] : [])
  const ielts = exams?.find((exam) => exam.slug === 'ielts')
  if (ielts) records.push({ ...ielts, id: 'ielts', type: 'exams', title: ielts.name, description: ielts.summary, href: '/opportunities/exams/ielts', status: 'published' })
  return records
}

function normalizeCollectionDraft(value) {
  return (Array.isArray(value) ? value : []).flat(Infinity).filter((record) => record && typeof record === 'object' && !Array.isArray(record))
}

function commitDraft(draft) {
  return Array.isArray(draft)
    ? normalizeCollectionDraft(draft).map(removeSavedStatus)
    : Object.fromEntries(Object.entries(draft).map(([key, value]) => [key, { status: value.status }]))
}

function useManagedCollection({ pageKey, label, services, tourism, opportunities, exams }) {
  const isServices = Array.isArray(services)
  const isTourism = Boolean(tourism)
  const [draft, setDraft] = useCmsDraftState(
    `collection:${pageKey}`,
    () => createInitialDraft({ isServices, isTourism, services, tourism, opportunities, exams }),
    { commit: commitDraft },
  )

  const cards = useMemo(() => {
    const records = normalizeCollectionDraft(draft)
    if (isServices) {
      return records.map((service) => normalizeContentRecord({
        ...service,
        id: service.slug,
        href: `/services/${service.slug}`,
        status: service.status || 'published',
        category: label,
      }))
    }
    if (isTourism) return records.map(normalizeContentRecord)

    return records.map(normalizeContentRecord)
  }, [draft, isServices, isTourism, label])

  const toggleStatus = (card) => {
    setDraft((current) => {
      if (Array.isArray(current)) {
        return current.map((item) => {
          if (item.id !== card.id && item.slug !== card.slug) return item
          const currentStatus = item.status === 'draft' ? 'draft' : 'published'
          return {
            ...item,
            status: currentStatus === 'draft' ? 'published' : 'draft',
            savedStatus: item.savedStatus ?? currentStatus,
          }
        })
      }
      return current
    })
  }

  const savePost = (savedPost, activeType) => {
    setDraft((current) => {
      if (isServices) {
        return current.some((service) => service.slug === savedPost.slug)
          ? current.map((service) => service.slug === savedPost.slug ? { ...service, ...savedPost } : service)
          : [...current, savedPost]
      }
      if (isTourism) return current.some((item) => item.id === savedPost.id)
        ? current.map((item) => item.id === savedPost.id ? { ...item, ...savedPost, title: savedPost.title || item.title } : item)
        : [...current, { ...savedPost, id: `${activeType}:${savedPost.slug}`, type: activeType, title: savedPost.title, href: `/tourism/${activeType}/${savedPost.slug}` }]
      const category = opportunities?.[activeType]?.post?.category || activeType
      const identity = savedPost.id || activeType
      return current.some((item) => item.id === identity)
        ? current.map((item) => item.id === identity ? { ...item, ...savedPost, id: identity, type: activeType, category, href: `/opportunities/${activeType}` } : item)
        : [...current, { ...savedPost, id: identity, type: activeType, category, href: `/opportunities/${activeType}/${savedPost.slug}` }]
    })
  }

  const removePost = (card) => setDraft((current) => current.filter((item) => item.id !== card.id && item.slug !== card.slug))

  return { cards, isServices, isTourism, removePost, savePost, toggleStatus }
}

export default useManagedCollection
