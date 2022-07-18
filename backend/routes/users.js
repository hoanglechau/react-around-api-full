const router = require('express').Router();

const {
  getUsers,
  getCurrentUser,
  getUserById,
  updateUserProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  validateRequestAuth,
  validateUserId,
} = require('../middleware/validation');

router.get('/', validateRequestAuth, getUsers);
router.get('/me', validateRequestAuth, getCurrentUser);
router.get('/:userId', validateRequestAuth, validateUserId, getUserById);
router.patch('/me', validateRequestAuth, updateUserProfile);
router.patch('/me/avatar', validateRequestAuth, updateAvatar);

module.exports = router;
