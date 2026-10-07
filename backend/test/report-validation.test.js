const { test } = require('node:test')
const assert = require('node:assert/strict')
const { validateReport, isReportComplete } = require('../src/services/report-validation.service')
const { filterNewSuggestions } = require('../src/services/resume-review.service')
const { renderResumeLatex } = require('../src/services/resume-latex.service')
const question = { question: 'Explain a design choice.', intention: 'Assess reasoning.', answer: 'Describe the tradeoffs.' }
const valid = () => ({ title: 'Software Engineer', matchScore: 0, matchReason: 'No required skills were demonstrated.', technicalQuestions: Array(3).fill(question), behavioralQuestions: Array(3).fill(question), skillGaps: [], preparationPlan: [{ day: 1, focus: 'Practice', tasks: ['Study the role.'] }] })

test('accepts a genuine zero score, rejects missing score, empty questions, bad answers and runaway titles', () => {
    assert.equal(validateReport(valid()).matchScore, 0)
    assert.equal(isReportComplete({ title: 'A title alone' }), false)
    for (const change of [{ matchScore: undefined }, { matchScore: 101 }, { title: 'x'.repeat(121) }, { technicalQuestions: [] }, { behavioralQuestions: [{ ...question, answer: '' }] }, { preparationPlan: [] }]) {
        assert.throws(() => validateReport({ ...valid(), ...change }), /incomplete/)
    }
})

test('adds new skills directly to the normal resume and preserves the highlighted review', () => {
    const draft = { name: 'Example', skills: [{ category: 'Languages', items: 'C++, SQL' }] }
    const suggestions = ['React.js', 'JS', 'C++', 'Docker', 'Docker'].map(skill => ({ skill, recommendation: 'Build a small project to practice this skill.' }))
    draft.suggestedAdditions = filterNewSuggestions(suggestions, 'Built React apps using JavaScript.', draft)
    assert.deepEqual(draft.suggestedAdditions.map(item => item.skill), ['Docker'])
    const before = JSON.stringify(draft)
    const clean = renderResumeLatex(draft)
    const review = renderResumeLatex(draft, { highlighted: true })
    assert(clean.includes('\\textbf{Technologies:} Docker'))
    assert(clean.includes('C++, SQL'))
    assert(!clean.includes('AI suggestions to review'))
    assert(!clean.includes('Build a small project'))
    assert(!clean.includes('\\colorbox{AIHighlight}'))
    assert(!review.includes('\\textbf{Technologies:} Docker'))
    assert(review.includes('\\colorbox{AIHighlight}{\\strut Docker}'))
    assert(!review.includes('\\colorbox{AIHighlight}{\\strut React'))
    assert(!review.includes('\\colorbox{AIHighlight}{\\strut C'))
    assert(review.includes('not claimed qualifications'))
    assert.equal(JSON.stringify(draft), before)
})
