const express = require('express');
const { authUser } = require('../middlewares/auth.middleware');
const {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    getApplicationStats
} = require('../controllers/application.controller');

const router = express.Router();

router.use(authUser);

router.get('/', getApplications);
router.post('/', createApplication);
router.get('/stats', getApplicationStats);
router.patch('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
