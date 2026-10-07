const { test } = require('node:test')
const assert = require('node:assert/strict')
const { renderResumeLatex } = require('../src/services/resume-latex.service')
const { compileResumePdf } = require('../src/services/latex-pdf.service')
const { PDFParse } = require('pdf-parse')

test('LaTeX compiles to a readable PDF and escapes candidate text', { timeout: 130000 }, async () => {
    const source = renderResumeLatex({
        name: 'Test Candidate',
        skills: [{ category: 'Languages', items: 'C++ & C#, SQL_1, 95%' }],
        achievements: ['Built an application.']
    })
    const pdf = await compileResumePdf(source)
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-')
    const parser = new PDFParse({ data: pdf })
    try {
        const result = await parser.getText()
        assert.match(result.text, /Test Candidate/)
        assert.match(result.text, /C\+\+ & C#, SQL_1, 95%/)
        assert.equal(result.total, 1)
    } finally {
        await parser.destroy()
    }
})

test('download returns a PDF attachment for the report owner', async () => {
    const aiPath = require.resolve('../src/services/ai.service')
    require.cache[aiPath] = { id: aiPath, filename: aiPath, loaded: true, exports: {
        generateResumeData: async () => { throw new Error('A cached draft must not trigger another AI request') }
    } }
    const model = require('../src/models/interviewReport.model')
    const original = model.findOne
    const controller = require('../src/controllers/interview.controller')
    const response = () => ({
        statusCode: 200,
        status(code) { this.statusCode = code; return this },
        set(headers) { this.headers = headers },
        send(body) { this.body = body },
        json(body) { this.body = body }
    })
    try {
        model.findOne = query => ({ select: async () => {
            assert.deepEqual(query, { _id: 'report', user: 'owner' })
            return { resume: 'Test profile', resumeDraft: { name: 'Download Test', suggestedAdditions: [{ skill: 'Docker', recommendation: 'Build a containerized demo before listing this skill.' }] } }
        } })
        const result = response()
        await controller.generateResumePdfController({ params: { interviewReportId: 'report' }, user: { id: 'owner' } }, result)
        assert.equal(result.statusCode, 200)
        assert.equal(result.headers['Content-Type'], 'application/pdf')
        assert.match(result.headers['Content-Disposition'], /resume_report\.pdf$/)
        assert.equal(result.body.subarray(0, 5).toString(), '%PDF-')
        const cleanParser = new PDFParse({ data: result.body })
        try {
            const clean = await cleanParser.getText()
            assert.match(clean.text, /Skills\s+Technologies:\s+Docker/)
            assert.doesNotMatch(clean.text, /suggestions|practice|claimed qualifications/)
        } finally { await cleanParser.destroy() }

        const review = response()
        await controller.generateResumePdfController({ params: { interviewReportId: 'report' }, user: { id: 'owner' }, query: { highlighted: 'true' } }, review)
        assert.match(review.headers['Content-Disposition'], /resume_report_highlighted\.pdf$/)
        const parser = new PDFParse({ data: review.body })
        try {
            const result = await parser.getText()
            assert.match(result.text, /Docker/)
            assert.match(result.text, /not claimed\s+qualifications/)
        } finally { await parser.destroy() }

        model.findOne = () => ({ select: async () => null })
        const missing = response()
        await controller.generateResumePdfController({ params: { interviewReportId: 'report' }, user: { id: 'other' } }, missing)
        assert.equal(missing.statusCode, 404)
    } finally {
        model.findOne = original
        delete require.cache[aiPath]
    }
})
