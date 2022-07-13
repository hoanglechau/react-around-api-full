import React from 'react';

export default function ImagePopup({ card, onClose }) {
    return (
        <div className={`modal modal_type_preview ${card ? 'modal_open' : ''}`}>
            <div className='modal__content modal__content_type_preview'>
                <button
                    type='button'
                    className='modal__close'
                    onClick={onClose}
                />
                <img
                    alt={card ? card.name : ''}
                    src={card ? card.link : ''}
                    className='modal__preview-image'
                />
                <p className='modal__card-title'>{card ? card.name : ''}</p>
            </div>
        </div>
    );
}
