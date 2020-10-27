import { BaseComponent } from './BaseComponent';

export class Popup extends BaseComponent {
  constructor(template, container) {
    super();
    this._template = template;
    this._container = container;
    this._init = this._init.bind(this);
    this._setupHandlers = this._setupHandlers.bind(this);
  }
  _init() {
    this._setupHandlers()
    this._setHandlers(this._handlersArray);
  }
  open = () => {
    this._setContent();
    this._init();
    this._container.classList.add('popup_is-opened');
    event.preventDefault();
  };
  close = () => {
    this._container.classList.remove('popup_is-opened');
    // this._removeHandlers(this._handlersArray);
    this._clearContent();
  }
  _setContent = () => {
    this._view = this._template.content.cloneNode(true).children[0];
    this._container.append(this._view);
  };
  _clearContent = () => {
    this._view.remove();
  };
  _setupHandlers() {
    return this._handlersArray = [{
      element: this._view.querySelector('.popup__close'),
      event: 'click',
      callbacks: [this.close]
    }];
  };
}