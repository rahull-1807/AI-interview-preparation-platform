export const getAllApplications = async () => {
    const response = await fetch('/api/applications', {
        method: 'GET'
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to get applications');
    }
    return result.applications || [];
};

export const createApplication = async (data) => {
    const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to save application');
    }
    return result.application;
};

export const updateApplication = async (id, data) => {
    const response = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to update application');
    }
    return result.application;
};

export const deleteApplication = async (id) => {
    const response = await fetch(`/api/applications/${id}`, {
        method: 'DELETE'
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to delete application');
    }
    return result;
};

export const getApplicationStats = async () => {
    const response = await fetch('/api/applications/stats', {
        method: 'GET'
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to get application stats');
    }
    return result.counts || null;
};
