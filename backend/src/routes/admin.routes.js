const router = require('express').Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const adminCtrl = require('../controllers/admin.controller');

// All routes here require ADMIN
router.use(auth, role('ADMIN'));

router.post('/users', adminCtrl.createUser);
router.post('/stores', adminCtrl.createStore);
router.get('/dashboard', adminCtrl.getDashboardStats);
router.get('/users', adminCtrl.getUsers);
router.get('/stores', adminCtrl.getStores);
router.get('/users/:id', adminCtrl.getUserDetails);

module.exports = router;
