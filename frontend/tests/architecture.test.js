import assert from 'node:assert/strict'
import test from 'node:test'

import englishDashboard from '../src/cms/locales/en/dashboard.json' with { type: 'json' }
import englishSettings from '../src/cms/locales/en/settings.json' with { type: 'json' }
import dariDashboard from '../src/cms/locales/prs/dashboard.json' with { type: 'json' }
import dariSettings from '../src/cms/locales/prs/settings.json' with { type: 'json' }
import pashtoDashboard from '../src/cms/locales/ps/dashboard.json' with { type: 'json' }
import pashtoSettings from '../src/cms/locales/ps/settings.json' with { type: 'json' }
import { CMS_PATHS, getCmsHref, getCmsRouteKey, isCmsPath } from '../src/cms/routes.js'

test('CMS paths resolve from one canonical route table', () => {
  assert.equal(isCmsPath('/dashboard'), true)
  assert.equal(isCmsPath('/dashboard/opportunities/example'), true)
  assert.equal(isCmsPath('/dr/dashboard'), false)
  assert.equal(getCmsRouteKey('/dashboard'), 'overview')
  assert.equal(getCmsRouteKey('/dashboard/tourism/world'), 'tourism')
  assert.equal(getCmsRouteKey('/dashboard/unknown'), 'placeholder')
  assert.equal(getCmsHref('messages'), CMS_PATHS.messages)
})

test('new CMS collection and branding labels have locale parity', () => {
  const dashboardKeys = Object.keys(dariDashboard.opportunities.collection).sort()
  const settingsKeys = Object.keys(dariSettings.branding).sort()

  for (const locale of [pashtoDashboard, englishDashboard]) {
    assert.deepEqual(Object.keys(locale.opportunities.collection).sort(), dashboardKeys)
  }
  for (const locale of [pashtoSettings, englishSettings]) {
    assert.deepEqual(Object.keys(locale.branding).sort(), settingsKeys)
  }
})
