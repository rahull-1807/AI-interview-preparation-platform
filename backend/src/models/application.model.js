const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
            index: true
        },
        company: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
            maxlength: [120, 'Company name is too long']
        },
        role: {
            type: String,
            required: [true, 'Role title is required'],
            trim: true,
            maxlength: [120, 'Role title is too long']
        },
        dateApplied: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['Applied', 'Reviewing', 'Interviewing', 'Offer', 'Accepted', 'Rejected', 'Declined', 'No Response'],
            default: 'Applied'
        },
        jobUrl: {
            type: String,
            trim: true,
            maxlength: [1000, 'Job URL is too long']
        },
        jobId: {
            type: String,
            trim: true,
            maxlength: [80, 'Job ID is too long']
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [2000, 'Notes too long']
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index({ user: 1, dateApplied: -1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
