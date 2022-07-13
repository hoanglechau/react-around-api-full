import React from 'react';
import {Route, Switch, Redirect, useHistory} from 'react-router-dom';
import {CurrentUserContext} from '../contexts/CurrentUserContext';
import ProtectedRoute from './ProtectedRoute';
import api from '../utils/api';
import auth from '../utils/auth';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';

export default function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
        React.useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
        React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);
    const [cards, setCards] = React.useState([]);

    const [currentUser, setCurrentUser] = React.useState({});

    const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
    const [toolTipStatus, setToolTipStatus] = React.useState('');
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [email, setEmail] = React.useState('');

    const history = useHistory();

    React.useEffect(() => {
        api.getInitialCards()
            .then(([cardData, userData]) => {
                setCurrentUser(userData);
                setCards(cardData);
            })
            .catch((err) => console.log(err));
    }, []);

    React.useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            auth.checkToken(token)
                .then((res) => {
                    if (res) {
                        setEmail(res.data.email);
                        setIsLoggedIn(true);
                        history.push('/');
                    } else {
                        localStorage.removeItem('jwt');
                    }
                })
                .catch((err) => console.log(err));
        }
    }, []);

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setSelectedCard(null);
        setIsInfoToolTipOpen(false);
    }

    React.useEffect(() => {
        const closeByEscape = (e) => {
            if (e.key === 'Escape') {
                closeAllPopups();
            }
        };

        document.addEventListener('keydown', closeByEscape);

        return () => document.removeEventListener('keydown', closeByEscape);
    }, []);

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function handleUpdateUser({ name, about }) {
        api
            .setUserInfo({ name, about }, localStorage.getItem('jwt'))
            .then((newUserData) => {
                setCurrentUser(newUserData.data);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleUpdateAvatar({ avatar }) {
        api.setUserAvatar({ avatar }, localStorage.getItem('jwt'))
            .then((newUserData) => {
                setCurrentUser(newUserData.data);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some((i) => i._id === currentUser._id);
        api
            .changeLikeStatus(card._id, !isLiked, localStorage.getItem('jwt'))
            .then((newCard) => {
                setCards((cards) =>
                    cards.map((c) => (c._id === card._id ? newCard : c))
                );
            })
            .catch((err) => console.log(err));
    }

    function handleCardDelete(card) {
        api
            .removeCard(card._id, localStorage.getItem('jwt'))
            .then(() => {
                setCards((cards) => cards.filter((c) => c._id !== card._id));
            })
            .catch((err) => console.log(err));
    }

    function handleAddPlaceSubmit(newCard) {
        api.addCard(newCard)
            .then((newCardFull) => {
                setCards([newCardFull, ...cards]);
                closeAllPopups();
            })
            .catch((err) => console.log(err));
    }

    function onRegister({email, password}) {
        auth.register({email, password})
            .then((res) => {
                if (res.data._id) {
                    setToolTipStatus('success');
                    history.push('/signin');
                } else {
                    setToolTipStatus('fail');
                }
            })
            .catch((err) => {
                setToolTipStatus('fail');
            })
            .finally(() => {
                setIsInfoToolTipOpen(true);
            });
    }

    function onLogin({email, password}) {
        auth.login({email, password})
            .then((res) => {
                if (res.token) {
                    setIsLoggedIn(true);
                    setEmail(email);
                    localStorage.setItem('jwt', res.token);
                    history.push('/');
                } else {
                    setToolTipStatus('fail');
                    setIsInfoToolTipOpen(true);
                }
            })
            .catch((err) => {
                setToolTipStatus('fail');
                setIsInfoToolTipOpen(true);
            });
    }

    function onSignOut() {
        localStorage.removeItem('jwt');
        setIsLoggedIn(false);
        history.push('/signin');
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className='page'>
                <Header email={email} onSignOut={onSignOut}/>
                <Switch>
                    <ProtectedRoute exact path='/' loggedIn={isLoggedIn}>
                        <Main
                            cards={cards}
                            onEditProfileClick={handleEditProfileClick}
                            onAddPlaceClick={handleAddPlaceClick}
                            onEditAvatarClick={handleEditAvatarClick}
                            onCardClick={handleCardClick}
                            onCardLike={handleCardLike}
                            onCardDelete={handleCardDelete}
                        />
                    </ProtectedRoute>
                    <Route path='/signup'>
                        <Register onRegister={onRegister}/>
                    </Route>
                    <Route path='/signin'>
                        <Login onLogin={onLogin}/>
                    </Route>
                    <Route>
                        {isLoggedIn ? (
                            <Redirect to='/'/>
                        ) : (
                            <Redirect to='/signin'/>
                        )}
                    </Route>
                </Switch>
                <Footer/>

                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onUpdateUser={handleUpdateUser}
                    onClose={closeAllPopups}
                />

                <AddPlacePopup
                    isOpen={isAddPlacePopupOpen}
                    onAddPlace={handleAddPlaceSubmit}
                    onClose={closeAllPopups}
                />

                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onUpdateAvatar={handleUpdateAvatar}
                    onClose={closeAllPopups}
                />

                <PopupWithForm
                    title='Are you sure?'
                    name='remove-card'
                    buttonText='Yes'
                />

                <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

                <InfoTooltip
                    isOpen={isInfoToolTipOpen}
                    onClose={closeAllPopups}
                    status={toolTipStatus}
                />
            </div>
        </CurrentUserContext.Provider>
    );
}
