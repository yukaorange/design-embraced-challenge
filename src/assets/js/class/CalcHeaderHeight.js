export default class HeaderHeightSetter {
  constructor(headerSelector) {
    this.headerSelector = headerSelector;
    this.header = document.querySelector(headerSelector);
    this.init();
  }

  setHeaderHeight() {
    const headerHeight = this.header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
  }

  init() {
    this.setHeaderHeight();
    window.addEventListener('resize', () => this.setHeaderHeight());
  }
}

// Usage
// new HeaderHeightSetter('.header-selector');