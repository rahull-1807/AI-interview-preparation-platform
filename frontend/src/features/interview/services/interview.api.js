import { validatePdfBlob } from './pdf-download.js';

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    if (resumeFile) {
        formData.append("resume", resumeFile);
    }
    const response = await fetch('/api/interview', {
        method: 'POST',
        body: formData
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to generate interview report');
    }
    return result;
}

export const getInterviewReportById = async (interviewId) => {
    const response = await fetch(`/api/interview/report/${interviewId}`, {
        method: 'GET'
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to get interview report');
    }
    return result;
}

export const getAllInterviewReports = async () => {
    const response = await fetch('/api/interview', {
        method: 'GET'
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to get interview reports');
    }
    return result;
}

export const generateResumePdf = async (interviewReportId, highlighted = false) => {
    const response = await fetch(`/api/interview/resume/pdf/${interviewReportId}?highlighted=${highlighted}`, {
        method: 'POST'
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to generate resume PDF');
    }
    if (!response.headers.get('content-type')?.toLowerCase().startsWith('application/pdf')) {
        throw new Error('The server did not return a PDF. Please try again.');
    }
    const pdf = await response.blob();
    await validatePdfBlob(pdf);
    const declaredLength = response.headers.get('content-length');
    if (declaredLength && !response.headers.get('content-encoding') && Number(declaredLength) !== pdf.size) {
        throw new Error('The PDF download was interrupted. Please try again.');
    }
    return pdf;
}

export const regenerateInterviewReport = async (interviewId) => {
    const response = await fetch(`/api/interview/report/${interviewId}/regenerate`, { method: 'POST' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Could not reevaluate your report. Please retry.');
    return result;
}
