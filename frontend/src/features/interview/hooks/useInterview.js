import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf, regenerateInterviewReport } from "../services/interview.api"
import { useContext, useEffect, useState, useCallback } from "react"
import { InterviewContext } from "../interview.context.js"
import { useParams } from "react-router"


export const useInterview = () => {

    const context = useContext(InterviewContext)
    const { interviewId } = useParams()
    const [error, setError] = useState("")
    const [needsRegeneration, setNeedsRegeneration] = useState(false)
    const [evaluating, setEvaluating] = useState(false)
    const [downloading, setDownloading] = useState(null)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setError("")
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.interviewReport)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }

        return response?.interviewReport
    }

    const getReportById = useCallback(async (interviewId) => {
        setError("")
        setReport(null)
        setLoading(true)
        let response = null
        try {
            response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
            setNeedsRegeneration(Boolean(response.needsRegeneration))
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
        return response?.interviewReport
    }, [setLoading, setReport])

    const getReports = useCallback(async () => {
        setError("")
        setLoading(true)
        let response = null
        try {
            response = await getAllInterviewReports()
            setReports(response.interviewReports)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }

        return response?.interviewReports
    }, [setLoading, setReports])

    const getResumePdf = async (interviewReportId, highlighted = false) => {
        setError("")
        setLoading(true)
        setDownloading(highlighted ? 'highlighted' : 'normal')
        try {
            const response = await generateResumePdf(interviewReportId, highlighted)
            const url = window.URL.createObjectURL(response)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}${highlighted ? '_highlighted' : ''}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            // Keep the blob alive until the browser has started the download.
            window.setTimeout(() => window.URL.revokeObjectURL(url), 60000)
        }
        catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
            setDownloading(null)
        }
    }

    const reevaluate = async () => {
        setError('')
        setEvaluating(true)
        try {
            const data = await regenerateInterviewReport(interviewId)
            setReport(data.interviewReport)
            setNeedsRegeneration(false)
        } catch (error) {
            setError(error.message)
        } finally {
            setEvaluating(false)
        }
    }

    useEffect(() => {
        // These async requests also set the loading indicator before fetching.
        /* eslint-disable react-hooks/set-state-in-effect */
        if (interviewId) {
            getReportById(interviewId)
        } else {
            getReports()
        }
        /* eslint-enable react-hooks/set-state-in-effect */
    }, [interviewId, getReportById, getReports])

    return { loading, error, report, reports, generateReport, getReportById, getReports, getResumePdf, needsRegeneration, evaluating, downloading, reevaluate }

}
