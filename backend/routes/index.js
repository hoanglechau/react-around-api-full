const router = require('express').Router();

const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/not-found-error');

const auth = require('../middleware/auth');
const { createUser, login } = require('../controllers/users');
const { validateLogin, validateUser } = require('../middleware/validation');

router.post('/signin', validateLogin, login);
router.post('/signup', validateUser, createUser);

router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;
