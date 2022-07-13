import React from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function Main({
    cards,
    onEditProfileClick,
    onAddPlaceClick,
    onEditAvatarClick,
    onCardClick,
    onCardLike,
    onCardDelete,
}) {
    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main className='content'>
            <section className='profile page__section'>
                <div
                    className='profile__avatar-overlay'
                    onClick={onEditAvatarClick}
                >
                    <img
                        src={currentUser.avatar}
                        alt='Avatar'
                        className='profile__avatar'
                    />
                </div>

                <div className='profile__info'>
                    <h1 className='profile__name'>{currentUser.name}</h1>
                    <button
                        className='profile__btn-edit'
                        type='button'
                        onClick={onEditProfileClick}
                    />
                    <p className='profile__about'>{currentUser.about}</p>
                </div>
                <button
                    className='profile__btn-add'
                    type='button'
                    onClick={onAddPlaceClick}
                />
            </section>
            <section className='page__section'>
                <ul className='gallery'>
                    {cards.map((card) => (
                        <Card
                            key={card._id}
                            card={card}
                            onCardClick={onCardClick}
                            onCardLike={onCardLike}
                            onCardDelete={onCardDelete}
                        />
                    ))}
                </ul>
            </section>
        </main>
    );
}
