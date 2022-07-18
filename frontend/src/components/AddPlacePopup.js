import React from 'react';
import PopupWithForm from './PopupWithForm';

export default function AddPlacePopup({ isOpen, onAddPlace, onClose }) {
    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');

    React.useEffect(() => {
        setName('');
        setLink('');
    }, [isOpen]);

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleLinkChange(e) {
        setLink(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();

        onAddPlace({ name, link });
    }

    return (
        <PopupWithForm
            isOpen={isOpen}
            onSubmit={handleSubmit}
            onClose={onClose}
            title='New Place'
            name='new-card'
        >
            <label className='modal__field'>
                <input
                    type='text'
                    name='title'
                    id='title-input'
                    className='modal__input modal__input_type_card-name'
                    placeholder='Title'
                    required
                    minLength='1'
                    maxLength='30'
                    value={name}
                    onChange={handleNameChange}
                />
                <span className='modal__error' id='title-input-error' />
            </label>
            <label className='modal__field'>
                <input
                    type='url'
                    name='link'
                    id='link-input'
                    className='modal__input modal__input_type_url'
                    placeholder='Image URL'
                    required
                    value={link}
                    onChange={handleLinkChange}
                />
                <span className='modal__error' id='link-input-error' />
            </label>
        </PopupWithForm>
    );
}
