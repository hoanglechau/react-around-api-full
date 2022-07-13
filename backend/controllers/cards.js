const Card = require('../models/card');
const { HTTP_SUCCESS_OK } = require('../utils/errors');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

// GET
const getCards = (req, res, next) => {
  Card.find({})
    .orFail(new NotFoundError('Cards are not found'))
    .then((cards) => res.status(HTTP_SUCCESS_OK).send(cards))
    .catch(next);
};

// POST
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(HTTP_SUCCESS_OK).send(card))
    .catch((err) => {
      if (err.name === 'ValidatorError') {
        next(new BadRequestError('Missing or Invalid name or link'));
      } else {
        next(err);
      }
    });
};

// DELETE
const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findById({ _id: id })
    .orFail(() => new NotFoundError('Card ID not found'))
    .then((card) => {
      if (!(card.owner.toString() === req.user._id)) {
        throw new Error("Don't have permission to delete");
      }
      Card.findByIdAndRemove({ _id: id })
        .orFail(new NotFoundError('Card ID not found'))
        .then(() => res.status(HTTP_SUCCESS_OK).send(card))
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const currentUser = req.user._id;
  const { id } = req.params;

  Card.findByIdAndUpdate(
    { _id: id },
    { $addToSet: { likes: currentUser } },
    { new: true },
  )
    .orFail(new NotFoundError('Card ID not found'))
    .then((card) => res.status(HTTP_SUCCESS_OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid Card ID'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const currentUser = req.user._id;
  const { id } = req.params;

  Card.findByIdAndUpdate(id, { $pull: { likes: currentUser } }, { new: true })
    .orFail(new NotFoundError('Card ID not found'))
    .then((card) => res.status(HTTP_SUCCESS_OK).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Invalid Card ID'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
