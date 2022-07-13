import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function EditProfilePopup({ isOpen, onUpdateUser, onClose }) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    const currentUser = React.useContext(CurrentUserContext);

    React.useEffect(() => {
        if (currentUser) {
            setName(currentUser.name);
            setDescription(currentUser.about);
        }
    }, [currentUser, isOpen]);

    function handleSubmit(e) {
        e.preventDefault();

        onUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm
            isOpen={isOpen}
            onSubmit={handleSubmit}
            onClose={onClose}
            title='Edit Profile'
            name='edit'
        >
            <label className='modal__field'>
                <input
                    type='text'
                    name='name'
                    id='name-input'
                    className='modal__input modal__input_type_name'
                    placeholder='Name'
                    required
                    minLength='2'
                    maxLength='40'
                    value={name || ''}
                    onChange={handleNameChange}
                />
                <span className='modal__error' id='name-input-error' />
            </label>
            <label className='modal__field'>
                <input
                    type='text'
                    name='about'
                    id='about-input'
                    className='modal__input modal__input_type_description'
                    placeholder='About Me'
                    required
                    minLength='2'
                    maxLength='200'
                    value={description || ''}
                    onChange={handleDescriptionChange}
                />
                <span className='modal__error' id='about-input-error' />
            </label>
        </PopupWithForm>
    );
}
