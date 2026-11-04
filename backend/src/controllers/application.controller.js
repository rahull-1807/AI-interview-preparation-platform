const Application = require('../models/application.model');

/**
 * Get all applications for current authenticated user
 */
async function getApplications(req, res) {
    try {
        const userId = req.user.id || req.user._id;
        const applications = await Application.find({ user: userId })
            .sort({ dateApplied: -1, createdAt: -1 })
            .lean();

        res.status(200).json({ applications });
    } catch (err) {
        console.error('Error in getApplications:', err);
        res.status(500).json({ message: 'Failed to retrieve applications' });
    }
}

/**
 * Create a new job application
 */
async function createApplication(req, res) {
    try {
        const userId = req.user.id || req.user._id;
        const { company, role, dateApplied, status, jobUrl, jobId, notes } = req.body;

        if (!company || !company.trim()) {
            return res.status(400).json({ message: 'Company name is required' });
        }
        if (!role || !role.trim()) {
            return res.status(400).json({ message: 'Role title is required' });
        }

        const validStatuses = ['Applied', 'Reviewing', 'Interviewing', 'Offer', 'Accepted', 'Rejected', 'Declined', 'No Response'];
        const normalizedStatus = validStatuses.includes(status) ? status : 'Applied';

        const application = await Application.create({
            user: userId,
            company: company.trim(),
            role: role.trim(),
            dateApplied: dateApplied ? new Date(dateApplied) : new Date(),
            status: normalizedStatus,
            jobUrl: jobUrl ? jobUrl.trim() : '',
            jobId: jobId ? jobId.trim() : '',
            notes: notes ? notes.trim() : ''
        });

        res.status(201).json({ application });
    } catch (err) {
        console.error('Error in createApplication:', err);
        res.status(500).json({ message: 'Failed to save application' });
    }
}

/**
 * Update an existing application (e.g. status change, notes)
 */
async function updateApplication(req, res) {
    try {
        const userId = req.user.id || req.user._id;
        const { id } = req.params;
        const { company, role, dateApplied, status, jobUrl, jobId, notes } = req.body;

        const updateFields = {};
        if (company !== undefined) updateFields.company = company.trim();
        if (role !== undefined) updateFields.role = role.trim();
        if (dateApplied !== undefined) updateFields.dateApplied = new Date(dateApplied);
        if (status !== undefined) {
            const validStatuses = ['Applied', 'Reviewing', 'Interviewing', 'Offer', 'Accepted', 'Rejected', 'Declined', 'No Response'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid application status' });
            }
            updateFields.status = status;
        }
        if (jobUrl !== undefined) updateFields.jobUrl = jobUrl.trim();
        if (jobId !== undefined) updateFields.jobId = jobId.trim();
        if (notes !== undefined) updateFields.notes = notes.trim();

        const application = await Application.findOneAndUpdate(
            { _id: id, user: userId },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json({ application });
    } catch (err) {
        console.error('Error in updateApplication:', err);
        res.status(500).json({ message: 'Failed to update application' });
    }
}

/**
 * Delete an application
 */
async function deleteApplication(req, res) {
    try {
        const userId = req.user.id || req.user._id;
        const { id } = req.params;

        const deleted = await Application.findOneAndDelete({ _id: id, user: userId });
        if (!deleted) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.status(200).json({ message: 'Application removed successfully', id });
    } catch (err) {
        console.error('Error in deleteApplication:', err);
        res.status(500).json({ message: 'Failed to delete application' });
    }
}

/**
 * Get aggregated application stats for the Tree / Funnel visualization
 */
async function getApplicationStats(req, res) {
    try {
        const userId = req.user.id || req.user._id;
        const applications = await Application.find({ user: userId }).select('status').lean();

        const counts = {
            total: applications.length,
            applied: 0,
            reviewing: 0,
            interviewing: 0,
            offer: 0,
            accepted: 0,
            rejected: 0,
            declined: 0,
            noResponse: 0
        };

        for (const app of applications) {
            switch (app.status) {
                case 'Applied': counts.applied++; break;
                case 'Reviewing': counts.reviewing++; break;
                case 'Interviewing': counts.interviewing++; break;
                case 'Offer': counts.offer++; break;
                case 'Accepted': counts.accepted++; break;
                case 'Rejected': counts.rejected++; break;
                case 'Declined': counts.declined++; break;
                case 'No Response': counts.noResponse++; break;
                default: counts.applied++; break;
            }
        }

        res.status(200).json({ counts });
    } catch (err) {
        console.error('Error in getApplicationStats:', err);
        res.status(500).json({ message: 'Failed to aggregate application statistics' });
    }
}

module.exports = {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    getApplicationStats
};
