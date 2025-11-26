const router = require('express').Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const storeCtrl = require('../controllers/store.controller');

// All logged-in roles can view stores list (normal/user use-case)
router.get('/', auth, role('USER', 'ADMIN', 'OWNER'), storeCtrl.getStoresForUser);

// Store owner dashboard
router.get('/owner/dashboard', auth, role('OWNER'), storeCtrl.getOwnerDashboard);

module.exports = router;
