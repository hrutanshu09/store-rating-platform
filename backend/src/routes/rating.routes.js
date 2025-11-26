const router = require('express').Router();
const auth = require('../middlewares/auth');
const role = require('../middlewares/role');
const ratingCtrl = require('../controllers/rating.controller');

// Normal user can create/update ratings
router.post('/', auth, role('USER'), ratingCtrl.createRating);
router.put('/:storeId', auth, role('USER'), ratingCtrl.updateRating);

module.exports = router;
