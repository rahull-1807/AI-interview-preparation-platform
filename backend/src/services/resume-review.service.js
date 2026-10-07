const { z } = require('zod')

const field = z.string()
const entry = z.object({ organization: field, dates: field, role: field, location: field, bullets: z.array(field) })
const draftSchema = z.object({
    name: field, email: field, phone: field, location: field, linkedin: field, github: field,
    education: z.array(entry), experience: z.array(entry),
    projects: z.array(z.object({ name: field, technologies: field, url: field, dates: field, bullets: z.array(field) })),
    skills: z.array(z.object({ category: field, items: field })), achievements: z.array(field),
    suggestedAdditions: z.array(z.object({ skill: z.string().trim().min(2).max(100), recommendation: z.string().trim().min(1).max(500) })).max(6)
})

function normalize(value) {
    return String(value).normalize('NFKC').toLowerCase()
        .replace(/react\.?js\b/g, 'react').replace(/node\.?js\b/g, 'node')
        .replace(/\bjs\b/g, 'javascript').replace(/\bts\b/g, 'typescript')
        .replace(/\bk8s\b/g, 'kubernetes').replace(/amazon web services/g, 'aws')
        .replace(/structured query language/g, 'sql')
        .replace(/[^\p{L}\p{N}+#]+/gu, ' ').replace(/\s+/g, ' ').trim()
}

function filterNewSuggestions(suggestions, original, draft) {
    // The job description is deliberately excluded: it is not evidence of skills.
    const { suggestedAdditions: ignored, ...existing } = draft
    const known = ` ${normalize(`${original} ${JSON.stringify(existing)}`)} `
    const seen = new Set()
    return suggestions.filter(item => {
        const skill = normalize(item.skill)
        if (!skill || known.includes(` ${skill} `) || seen.has(skill)) return false
        seen.add(skill)
        return true
    })
}

function validateResumeDraft(value, original) {
    const draft = draftSchema.parse(value)
    draft.suggestedAdditions = filterNewSuggestions(draft.suggestedAdditions, original, draft)
    return draft
}

module.exports = { validateResumeDraft, filterNewSuggestions }
