/**
 * @param {HTMLElement} element
 * @param {() => void} operation
 */

export default class ScrollObserver {
  target: HTMLElement
  operation: () => void

  constructor(element: HTMLElement, operation: () => void) {
    this.target = element

    this.operation = operation

    this.init()
  }

  callback(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.operation()

        observer.unobserve(entry.target)
      }
    })
  }

  init() {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries, observer) => {
      this.callback(entries, observer)
    }, options)

    observer.observe(this.target)
  }
}
