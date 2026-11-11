export const SKELETON_PREVIEW_DELAY_MS = 0

export function waitForSkeletonPreview() {
  return SKELETON_PREVIEW_DELAY_MS > 0
    ? new Promise((resolve) => window.setTimeout(resolve, SKELETON_PREVIEW_DELAY_MS))
    : Promise.resolve()
}

export function lazyWithSkeletonPreview(importer) {
  if (SKELETON_PREVIEW_DELAY_MS <= 0) return importer()
  return Promise.all([importer(), waitForSkeletonPreview()]).then(([module]) => module)
}

export async function withSkeletonPreview(promise) {
  if (SKELETON_PREVIEW_DELAY_MS <= 0) return promise
  const [value] = await Promise.all([promise, waitForSkeletonPreview()])
  return value
}
