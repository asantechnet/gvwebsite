import assert from 'node:assert/strict'
import test from 'node:test'

import { formatScholarshipDeadline } from '../src/website/utils/scholarshipDate.js'

test('formats an ISO scholarship deadline for every public language', () => {
  assert.equal(formatScholarshipDeadline('2026-11-02', 'dr'), '11 عقرب 1405')
  assert.equal(formatScholarshipDeadline('2026-11-02', 'ps'), '11 لړم 1405')
  assert.equal(formatScholarshipDeadline('2026-11-02', 'en'), 'November 2, 2026')
})

test('uses the same Dari format for the CMS prs locale', () => {
  assert.equal(formatScholarshipDeadline('2026-11-24', 'prs'), '3 قوس 1405')
})

test('converts Persian calendar boundaries without timezone drift', () => {
  assert.equal(formatScholarshipDeadline('2027-03-21', 'dr'), '1 حمل 1406')
  assert.equal(formatScholarshipDeadline('2027-03-21', 'ps'), '1 وری 1406')
  assert.equal(formatScholarshipDeadline('2027-03-21', 'en'), 'March 21, 2027')
})

test('uses Pashto names for all Solar Hijri months', () => {
  const expectedMonths = ['وری', 'غویی', 'غبرګولی', 'چنګاښ', 'زمری', 'وږی', 'تله', 'لړم', 'لیندۍ', 'مرغومی', 'سلواغه', 'کب']
  const representativeDates = ['2027-03-21', '2027-04-21', '2027-05-22', '2027-06-22', '2027-07-23', '2027-08-23', '2027-09-23', '2027-10-23', '2027-11-22', '2027-12-22', '2028-01-21', '2028-02-20']
  representativeDates.forEach((date, index) => assert.match(formatScholarshipDeadline(date, 'ps'), new RegExp(` ${expectedMonths[index]} `)))
})

test('does not roll invalid ISO dates into a different day', () => {
  assert.equal(formatScholarshipDeadline('2026-02-31', 'en'), '2026-02-31')
})

test('preserves legacy authored deadline text', () => {
  assert.equal(formatScholarshipDeadline('مطابق اعلان رسمی', 'dr'), 'مطابق اعلان رسمی')
})

test('normalizes every localized legacy value by scholarship identity', () => {
  assert.equal(formatScholarshipDeadline('25 عقرب 1405', 'en', 'daad-graduate-scholarships'), 'November 16, 2026')
  assert.equal(formatScholarshipDeadline('د رسمي غوښتنلیک دورې مطابق', 'ps', 'chevening-scholarship'), '3 لیندۍ 1405')
  assert.equal(formatScholarshipDeadline('24 Nov 2026', 'dr', 'chevening-scholarship'), '3 قوس 1405')
})
