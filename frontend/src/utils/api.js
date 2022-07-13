class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  getCardList(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._checkResponse);
  }

  getUserInfo(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._checkResponse);
  }

  getInitialCards(token) {
    return Promise.all([this.getCardList(token), this.getUserInfo(token)]);
  }

  addCard({ name, link }, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
      body: JSON.stringify({ name, link }),
    }).then(this._checkResponse);
  }

  removeCard(cardID, token) {
    return fetch(`${this._baseUrl}/cards/${cardID}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._checkResponse);
  }

  changeLikeStatus(cardID, like, token) {
    return fetch(`${this._baseUrl}/cards/likes/${cardID}`, {
      method: like ? 'PUT' : 'DELETE',
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
    }).then(this._checkResponse);
  }

  setUserInfo({ name, about }, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
      body: JSON.stringify({ name, about }),
    }).then(this._checkResponse);
  }

  setUserAvatar({ avatar }, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        ...this._headers,
      },
      body: JSON.stringify({ avatar }),
    }).then(this._checkResponse);
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error ${res.status}`);
  }
}

const api = new Api({
  baseUrl: 'http://localhost:3000',
  headers: {
    authorization: '1789319c-7844-4c96-ac53-65a440060c1a',
    'Content-Type': 'application/json',
  },
});

export default api;
