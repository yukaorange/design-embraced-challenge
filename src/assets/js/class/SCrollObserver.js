export class ScrollObserver {
  constructor(selector, event) {
    if (selector instanceof window.HTMLElement || selector instanceof window.NodeList) {
      this.target = selector;
    } else {
      this.target = document.querySelector(selector);
    }
    this.event = event;
    this.init();
  }

  callback(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.event();
        observer.unobserve(entry.target);
      }
    });
  }

  init() {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      this.callback(entries, observer);
    }, options);
    observer.observe(this.target);
  }
}
