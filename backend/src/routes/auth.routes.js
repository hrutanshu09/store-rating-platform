const router = require('express').Router();
const { signup, login, updatePassword } = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');

router.post('/signup', signup);          // Normal user signup
router.post('/login', login);            // All roles login
router.put('/password', auth, updatePassword); // Update own password

module.exports = router;
