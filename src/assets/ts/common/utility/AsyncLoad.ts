import Component, { TElement, TElements } from '@ts/abstract/Component'

export default class AsyncLoad extends Component {
  private observer: IntersectionObserver | null = null

  constructor({ element, elements = null }: { element: TElement; elements?: any }) {
    super({
      element,
      elements,
    })

    this.createObserver()
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!this.element.src) {
            this.element.src = this.element.getAttribute('data-src')

            this.element.onload = () => {
              this.element.classList.add('loaded')
            }
          }
        }
      })
    })

    this.observer.observe(this.element)
  }
}
