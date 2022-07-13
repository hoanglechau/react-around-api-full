import React from 'react';

export default function PopupWithForm({
    title,
    name,
    isOpen,
    buttonText = 'Save',
    onSubmit,
    onClose,
    children,
}) {
    return (
        <div className={`modal modal_type_${name} ${isOpen && 'modal_open'}`}>
            <div className='modal__content'>
                <form className='modal__form' name={name} onSubmit={onSubmit}>
                    <button
                        type='button'
                        className='modal__close'
                        onClick={onClose}
                    />
                    <h3 className='modal__title'>{title}</h3>
                    {children}
                    <button type='submit' className='button modal__button'>
                        {buttonText}
                    </button>
                </form>
            </div>
        </div>
    );
}
