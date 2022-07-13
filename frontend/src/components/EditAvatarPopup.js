import React from 'react';
import PopupWithForm from './PopupWithForm';

export default function EditAvatarPopup({ isOpen, onUpdateAvatar, onClose }) {
    const inputRef = React.useRef();

    React.useEffect(() => {
        inputRef.current.value = '';
    }, [isOpen]);

    function handleSubmit(e) {
        e.preventDefault();

        onUpdateAvatar({
            avatar: inputRef.current.value,
        });
    }

    return (
        <PopupWithForm
            isOpen={isOpen}
            onSubmit={handleSubmit}
            onClose={onClose}
            title='Change profile picture'
            name='edit-avatar'
        >
            <label className='modal__field'>
                <input
                    type='url'
                    name='link'
                    id='avatar-input'
                    className='modal__input modal__input_type_description'
                    placeholder='Image URL'
                    required
                    ref={inputRef}
                />
                <span className='modal__error' id='avatar-input-error' />
            </label>
        </PopupWithForm>
    );
}
