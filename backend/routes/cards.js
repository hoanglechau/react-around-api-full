const router = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const {
  validateRequestAuth,
  validateCard,
  validateCardId,
} = require('../middleware/validation');

router.get('/', validateRequestAuth, getCards);
router.post('/', validateRequestAuth, validateCard, createCard);
router.delete('/:id', validateRequestAuth, validateCardId, deleteCard);
router.put('/:id/likes', validateRequestAuth, validateCardId, likeCard);
router.delete('/:id/likes', validateRequestAuth, validateCardId, dislikeCard);

module.exports = router;
