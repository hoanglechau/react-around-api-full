const Card = require('../models/card');
const {
  CAST_ERROR_ERROR_CODE,
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../utils/errors');

// GET
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: 'An error has occurred on the server' });
    });
};

// POST
const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

// DELETE
const deleteCard = (req, res) => {
  const { id } = req.params;
  Card.findById(id)
    .orFail(() => {
      const error = new Error('Card ID not found');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((card) => Card.deleteOne(card).then(() => res.send({ data: card })))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CAST_ERROR_ERROR_CODE).send({ message: 'Invalid card ID' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Card not found' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const updateLike = (req, res, method) => {
  const { params: { id } } = req;

  Card.findByIdAndUpdate(id, { [method]: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      const error = new Error('Card ID not found');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CAST_ERROR_ERROR_CODE).send({ message: 'Invalid card ID' });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Card not found' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR_CODE)
          .send({ message: 'An error has occurred on the server' });
      }
    });
};

const likeCard = (req, res) => updateLike(req, res, '$addToSet');

const dislikeCard = (req, res) => updateLike(req, res, '$pull');

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
