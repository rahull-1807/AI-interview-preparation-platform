const fs = require('node:fs')
const path = require('node:path')

const template = fs.readFileSync(path.join(__dirname, '../templates/resume.tex'), 'utf8')

// Candidate text must remain text, even when it contains LaTeX commands.
function escapeLatex(value = '') {
    const escapes = {
        '\\': '\\textbackslash{}', '{': '\\{', '}': '\\}',
        '$': '\\$', '&': '\\&', '#': '\\#', '%': '\\%',
        '_': '\\_', '~': '\\textasciitilde{}', '^': '\\textasciicircum{}'
    }
    return String(value).replace(/[\\{}$&#%_~^]/g, character => escapes[character])
        .replace(/[\r\n]+/g, ' ')
}

function renderResumeLatex(data, { highlighted = false } = {}) {
    const text = escapeLatex
    const section = (title, body) => `\\section{\\textbf{${title}}}\n${body}`
    const list = items => `\\resumeSubHeadingListStart\n${items.join('\n')}\n\\resumeSubHeadingListEnd`
    const bullets = items => items?.length
        ? `\\resumeItemListStart\n${items.map(item => `\\resumeItem{${text(item)}}`).join('\n')}\n\\resumeItemListEnd`
        : ''
    const subheading = item => `\\resumeSubheading{${text(item.organization)}}{${text(item.dates)}}{${text(item.role)}}{${text(item.location)}}\n${bullets(item.bullets)}`
    const contactLine = values => values.filter(Boolean).map(value => `\\textcolor{RoyalBlue}{${text(value)}}`).join(' $|$ ')
    const parts = [
        `\\begin{center}\n\\textbf{\\Huge \\scshape ${text(data.name)}}\n\n\\vspace{3pt}\n\\small ${contactLine([data.email, data.phone, data.location])}\n\n\\vspace{2pt}\n${contactLine([data.linkedin, data.github])}\n\\end{center}\n\\vspace{-7pt}`
    ]
    if (data.education?.length) parts.push(section('Education', list(data.education.map(subheading))))
    if (data.experience?.length) parts.push(section('Experience', list(data.experience.map(subheading))))
    if (data.projects?.length) parts.push(section('Projects', list(data.projects.map(project => {
        const details = [`\\textbf{${text(project.name)}}`]
        if (project.technologies) details.push(`\\emph{${text(project.technologies)}}`)
        if (project.url) details.push(`\\textcolor{RoyalBlue}{${text(project.url)}}`)
        return `\\resumeProjectHeading{${details.join(' $|$ ')}}{${text(project.dates)}}\n${bullets(project.bullets)}`
    }))))
    if (data.skills?.length) parts.push(section('Skills', `\\small{\n${data.skills.map(skill => `\\textbf{${text(skill.category)}:} ${text(skill.items)}`).join(' \\\\\n')}\n}`))
    if (data.achievements?.length) parts.push(section('Achievements', bullets(data.achievements)))
    if (highlighted) {
        const suggestions = data.suggestedAdditions || []
        parts.push(section('AI suggestions to review', '\\small{Yellow marks only new suggested skills absent from your supplied profile. These are development suggestions, not claimed qualifications. Existing resume content is unchanged.}'))
        if (suggestions.length) {
            parts.push('\\resumeItemListStart\n' + suggestions.map(item =>
                `\\resumeItem{\\colorbox{AIHighlight}{\\strut ${text(item.skill)}}\\enspace ${text(item.recommendation)}}`
            ).join('\n') + '\n\\resumeItemListEnd')
        } else {
            parts.push('\\small{No new skills were suggested. Existing skills are left unhighlighted.}')
        }
    }
    return template.replace('%RESUME_CONTENT%', () => parts.join('\n\n'))
}

module.exports = { renderResumeLatex, escapeLatex }
