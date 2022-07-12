const User = require('../models/user');
const {
  CAST_ERROR_ERROR_CODE,
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../utils/errors');

const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR_CODE)
      .send({ message: 'An error has occurred on the server' }));
};

const getUser = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail(() => {
      const error = new Error('User Id not found');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((users) => res.send({ data: users }))
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

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Error' }));
};

const updateUserInfo = (req, res) => {
  const currentUser = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    currentUser,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: ' User not found' });
      } else if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else if (err.name === 'CastError') {
        res.status(CAST_ERROR_ERROR_CODE).send({
          message: 'Invalid User ID',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: 'An error has occurred on the server',
        });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const currentUser = req.user._id;
  const { avatar } = req.body;

  User.findOneAndUpdate(
    currentUser,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'User not found' });
      } else if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({
          message: `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        });
      } else if (err.name === 'CastError') {
        res.status(CAST_ERROR_ERROR_CODE).send({
          message: 'Invalid avatar URL',
        });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({
          message: 'An error has occurred on the server',
        });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
};
