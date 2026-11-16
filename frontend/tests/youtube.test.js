import assert from 'node:assert/strict'
import test from 'node:test'

import { getYouTubeThumbnail, normalizeYouTubeId } from '../src/shared/utils/youtube.js'

const videoId = 'dQw4w9WgXcQ'

test('normalizes supported YouTube video links', () => {
  for (const url of [
    `https://www.youtube.com/watch?v=${videoId}&feature=share`,
    `https://youtu.be/${videoId}?t=12`,
    `https://youtube.com/shorts/${videoId}`,
    `https://www.youtube.com/embed/${videoId}`,
    `https://youtube.com/live/${videoId}`,
  ]) assert.equal(normalizeYouTubeId(url), videoId)
})

test('rejects non-YouTube and malformed links', () => {
  assert.equal(normalizeYouTubeId('https://example.com/watch?v=dQw4w9WgXcQ'), '')
  assert.equal(normalizeYouTubeId('https://youtube.com/watch?v=short'), '')
})

test('creates a YouTube preview image only for valid IDs', () => {
  assert.equal(getYouTubeThumbnail(videoId), `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)
  assert.equal(getYouTubeThumbnail('invalid'), '')
})
