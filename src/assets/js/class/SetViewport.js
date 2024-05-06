export default class ViewPortSetter {
  constructor() {
    this.vw = window.innerWidth;
    this.documentWidth = document.documentElement.clientWidth;
    this.scrollBarWidth = this.vw - this.documentWidth;
    this.ajustWidth = this.vw - this.scrollBarWidth;

    this.updateViewPort();
    this.bindEvents();
  }

  updateViewPort() {
    console.log(this.scrollBarWidth, this.ajustWidth);
    document.documentElement.style.setProperty('--vw', `${this.ajustWidth}px`);
  }

  onResize() {
    this.vw = window.innerWidth;
    this.documentWidth = document.documentElement.clientWidth;
    this.scrollBarWidth = this.vw - this.documentWidth;
    this.ajustWidth = this.vw - this.scrollBarWidth;

    this.updateViewPort();
  }

  bindEvents() {
    window.addEventListener('resize', this.onResize.bind(this));
  }
}
