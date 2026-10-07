const { z } = require('zod')
const text = z.string().trim().min(1)
const question = z.object({ question: text, intention: text, answer: text })
const reportSchema = z.object({
    title: text.max(120),
    matchScore: z.number().finite().min(0).max(100),
    matchReason: text.max(1500),
    technicalQuestions: z.array(question).min(3).max(8),
    behavioralQuestions: z.array(question).min(3).max(6),
    skillGaps: z.array(z.object({ skill: text, severity: z.enum(['low', 'medium', 'high']) })),
    preparationPlan: z.array(z.object({ day: z.number().int().positive(), focus: text, tasks: z.array(text).min(1) })).min(1).max(14)
})
function validateReport(value) {
    const result = reportSchema.safeParse(value)
    if (!result.success) throw new Error('AI returned an incomplete interview report. Please try again.')
    return result.data
}
function isReportComplete(value) {
    return reportSchema.safeParse(value).success
}
module.exports = { validateReport, isReportComplete }
