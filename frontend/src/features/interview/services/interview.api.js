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
    return response.blob();
}

export const regenerateInterviewReport = async (interviewId) => {
    const response = await fetch(`/api/interview/report/${interviewId}/regenerate`, { method: 'POST' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Could not reevaluate your report. Please retry.');
    return result;
}
