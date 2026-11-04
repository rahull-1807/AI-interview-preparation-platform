const { test } = require('node:test');
const assert = require('node:assert/strict');
const Application = require('../src/models/application.model');

test('validates application status enums and required fields', () => {
    const validStatuses = ['Applied', 'Reviewing', 'Interviewing', 'Offer', 'Accepted', 'Rejected', 'Declined', 'No Response'];
    
    // Check required fields
    const emptyApp = new Application({});
    const err = emptyApp.validateSync();
    assert(err.errors.user);
    assert(err.errors.company);
    assert(err.errors.role);

    // Check valid status
    for (const status of validStatuses) {
        const app = new Application({
            user: '507f1f77bcf86cd799439011',
            company: 'Google',
            role: 'Software Engineer',
            status
        });
        assert.equal(app.status, status);
    }

    // Check invalid status
    const invalidApp = new Application({
        user: '507f1f77bcf86cd799439011',
        company: 'Google',
        role: 'Software Engineer',
        status: 'UnknownStatus'
    });
    const invalidErr = invalidApp.validateSync();
    assert(invalidErr.errors.status);
});
