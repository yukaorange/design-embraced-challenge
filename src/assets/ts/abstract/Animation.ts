import Component from '@ts/abstract/Component'
import GSAP from 'gsap'

export default class Animation extends Component {
  observer: IntersectionObserver | null

  constructor({ element, elements }: { element: Element; elements: { [key: string]: string } }) {
    super({
      element,
      elements,
    })

    this.observer = null

    this.createObserver()

    this.animateOut() //in advance hidden Animation elements.(Call GSAP.set in Super class)
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateIn()
        } else {
          this.animateOut()
        }
      })
    })

    this.observer.observe(this.element)
  }

  set() {
    GSAP.set(this.element, {
      autoAlpha: 0,
    })
  }

  animateIn() {}

  animateOut() {}
}
