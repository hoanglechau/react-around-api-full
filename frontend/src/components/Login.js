import React from 'react';

import { Link } from 'react-router-dom';

export default function Login({ onLogin }) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    React.useEffect(() => {
        setEmail('');
        setPassword('');
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        const userData = {
            email,
            password,
        };
        onLogin(userData);
    }
    return (
        <div className='login-form'>
            <form className='login-form__form' onSubmit={handleSubmit}>
                <div className='login-form__content'>
                    <h3 className='login-form__title'>Log in</h3>
                    <input
                        className='login-form__input'
                        name='name'
                        placeholder='Email'
                        id='email'
                        type='text'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className='login-form__input'
                        name='password'
                        placeholder='Password'
                        id='password'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className='login-form__content'>
                    <button className='login-form__button' type='submit'>
                        Log in
                    </button>
                    <p className='login-form__text'>
                        Not a member yet?{' '}
                        <Link className='login-form__link' to='/signup'>
                            Sign up here!
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
}
