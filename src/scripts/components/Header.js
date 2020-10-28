import { BaseComponent } from './BaseComponent';

export class Header extends BaseComponent {
  constructor(domElement, getUserData, config = {}) {
    super(domElement);

    this._mobileIconsContainer = this._domElement.querySelector('.header__icons-wrap');
    this._menu = this._domElement.querySelector('.header__menu');

    this._styleModificator = config.style.modificator;
    this._page = config.page;
    this._menuLinks = config.menuLinks;
    this._menuLinkTemplate = config.menuLinkTemplate;
    this._menuButtonTemplate = config.menuButtonTemplate;
    this._getUserData = getUserData;
    this._handlers = [
      {
        element: this._mobileIconsContainer,
        event: 'click',
        callbacks: [this._mobileMenuToggle]
      }
    ];
    this._init();
  }
  _init = () => {
    this._getAuthProps()
      .then((res) => this.render(res))
      .catch((err) => console.log(err));
  };
  setDependencies = (dependencies = {}) => {
    this._openSigninPopup = dependencies.openSigninPopup;
    this._logout = dependencies.logout;
  };
  _hideUserPages = () => {
    if (this._page === 'savedNews' && !this._userName) { // Если неавторизованный пользователь пробует загрузить страницу
      // сохраненных новостей, то редирректим его на главную.
      document.location.href='./index.html';
    }
  };
  render = (options = {}) => {
    this._isLoggedIn = options.isLoggedIn || false;
    this._userName = options.userName || null;
    this._hideUserPages() // Если в этой функции условие выполнится, то сработает редиррект и дальнейший код не выполнится.
    this._clearContent();
    this._setMenuLinks();
    this._setLoginButton();
    this._domElement.classList.add(this._styleModificator);
    this._initHandlers();
    this._setHandlers(this._handlers);
  };
  _getAuthProps = () => {
    return this._getUserData()
      .then((data) => {
        const res = data ? { isLoggedIn: true, userName: data.username } : { isLoggedIn: false };
        return res;
      })
      .catch((err) => console.log(err))
  };
  _setLoginButton = () => {
    const button = this._menuButtonTemplate.content.cloneNode(true).children[0];
    const icon = button.querySelector('.header__logout-icon');
    const textElement = button.querySelector('.header__button-text');
    if (this._isLoggedIn) {
      textElement.textContent = this._userName;
      icon.classList.add('header__logout-icon_is-visible')
    } else {
      textElement.textContent = 'Авторизоваться';
    }
    this._menu.append(button);
    this._authButton = this._domElement.querySelector('.header__menu-link_type_button');
  };
  _setMenuLinks = () => {
    this._menuLinks.forEach((data) => {
      if (this._isLoggedIn || (this._isLoggedIn === data.isForLoggedIn)) { // Условие для показа ссылок различным типам пользователей
        const element = this._menuLinkTemplate.content.cloneNode(true).children[0];
        element.children[0].textContent = data.title;
        element.children[0].setAttribute('href', data.url);
        if (data.page && (data.page === this._page)) {
          element.children[0].classList.add('header__menu-link_active');
        } else {
          element.children[0].classList.add('header__menu-link_inactive');
        }
        this._menu.append(element);
      }
    })
  };
  _clearContent = () => {
    this._menu.textContent = '';
  };
  _mobileMenuToggle = () => {
    this._mobileIconsContainer.children.forEach((el) => {
      el.classList.toggle('header__nav-icon_is-hidden');
    });
    this._domElement.classList.toggle('header_style_fill');
    this._menu.classList.toggle('header__menu_mobile');
  }
  _signout = () => {
    this._logout()
    .then(() => window.location.reload())
    .catch((err) => console.log(err));
  };
  _initHandlers = () => {
    if (this._isLoggedIn) {
      this._handlers.push({
        element: this._authButton,
        event: 'click',
        callbacks: [this._signout]
      });
    } else {
      this._handlers.push({
        element: this._authButton,
        event: 'click',
        callbacks: [this._openSigninPopup]
      });
    }
  }
}
