import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function Card({ card, onCardClick, onCardLike, onCardDelete }) {
    function handleClick() {
        onCardClick(card);
    }

    function handleLikeClick() {
        onCardLike(card);
    }

    function handleDeleteClick() {
        onCardDelete(card);
    }

    const currentUser = React.useContext(CurrentUserContext);

    const isLiked = card.likes.some((cardId) => cardId === currentUser._id);
    const cardLikeButtonClassName = `card__btn-like ${
        isLiked && 'card__btn-like_active'
    }`;

    const isOwn = card.owner._id === currentUser._id;
    const cardDeleteButtonClassName = isOwn
			? 'card__delete'
			: 'card__delete_hidden';

    return (
        <li className='places__item card'>
            <img
                src={card.link}
                alt={card.name}
                onClick={handleClick}
                className='card__image'
            />
            <button
                type='button'
                className={cardDeleteButtonClassName}
                onClick={handleDeleteClick}
            />
            <div className='card__place'>
                <h2 className='card__title'>{card.name}</h2>
                <div className='card__like-container'>
                    <button
                        type='button'
                        className={cardLikeButtonClassName}
                        onClick={handleLikeClick}
                    />
                    <p className='card__like-counter'>{card.likes.length}</p>
                </div>
            </div>
        </li>
    );
}
