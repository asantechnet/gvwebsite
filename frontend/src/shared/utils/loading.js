export const SKELETON_PREVIEW_DELAY_MS = 1000

export function waitForSkeletonPreview() {
  return new Promise((resolve) => window.setTimeout(resolve, SKELETON_PREVIEW_DELAY_MS))
}

export function lazyWithSkeletonPreview(importer) {
  return Promise.all([importer(), waitForSkeletonPreview()]).then(([module]) => module)
}

export async function withSkeletonPreview(promise) {
  const [value] = await Promise.all([promise, waitForSkeletonPreview()])
  return value
}
