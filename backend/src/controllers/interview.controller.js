const { compileResumePdf } = require("../services/latex-pdf.service")
const { PDFParse } = require("pdf-parse")
const { generateInterviewReport, generateResumeData } = require("../services/ai.service")
const { renderResumeLatex } = require("../services/resume-latex.service")
const { isReportComplete } = require("../services/report-validation.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        let resumeText = "";

        if (req.file) {
            const parser = new PDFParse({ data: req.file.buffer });
            try {
                const pdfData = await parser.getText();
                resumeText = pdfData.text;
            } finally {
                await parser.destroy();
            }
        }

        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription?.trim()) {
            return res.status(400).json({ message: "A job description is required." });
        }

        if (!resumeText.trim() && !selfDescription?.trim()) {
            return res.status(400).json({ message: "Either resume or self description is required." });
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });
    } catch (err) {
        console.error("Error generating report:", err);
        res.status(500).json({ message: "Failed to generate interview report", error: err.message });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport,
        needsRegeneration: !isReportComplete(interviewReport.toObject())
    })
}


/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Generate and compile a LaTeX resume, then return the PDF download.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id }).select('+resumeDraft')

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        const { resume, jobDescription, selfDescription, skillGaps } = interviewReport
        let draft = interviewReport.resumeDraft
        if (!draft) {
            const generated = await generateResumeData({ resume, jobDescription, selfDescription, skillGaps })
            // Both downloads must use the same content, including concurrent requests.
            const updated = await interviewReportModel.findOneAndUpdate(
                { _id: interviewReportId, user: req.user.id, resumeDraft: null },
                { $set: { resumeDraft: generated } }, { returnDocument: 'after' }
            ).select('+resumeDraft')
            draft = updated?.resumeDraft || (await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id }).select('+resumeDraft'))?.resumeDraft
            if (!draft) throw new Error('Resume report is no longer available.')
        }
        const highlighted = req.query?.highlighted === 'true'
        const latex = renderResumeLatex(draft, { highlighted })
        const pdf = await compileResumePdf(latex)

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}${highlighted ? '_highlighted' : ''}.pdf`
        })

        res.send(pdf)
    } catch (error) {
        console.error("Resume generation failed:", error.message)
        res.status(502).json({ message: "Could not generate the resume PDF. Please try again." })
    }
}

async function regenerateInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params
        const report = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })
        if (!report) return res.status(404).json({ message: 'Interview report not found.' })
        const evaluation = await generateInterviewReport({ resume: report.resume, selfDescription: report.selfDescription, jobDescription: report.jobDescription })
        const interviewReport = await interviewReportModel.findOneAndUpdate(
            { _id: interviewId, user: req.user.id },
            { $set: evaluation, $unset: { resumeDraft: 1 } }, { returnDocument: 'after', runValidators: true }
        )
        res.json({ interviewReport, needsRegeneration: false })
    } catch (error) {
        console.error('Interview evaluation failed:', error.message)
        res.status(502).json({ message: 'Could not complete the evaluation. Your existing report is unchanged. Please retry.' })
    }
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController, regenerateInterviewReportController }
