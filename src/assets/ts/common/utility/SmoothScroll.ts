export default class SmoothScroll {
  target: NodeListOf<HTMLAnchorElement>

  constructor() {
    this.target = document.querySelectorAll('a[href^="#"]')

    if (this.target.length === 0) {
      return
    }

    this.create()
  }

  create() {
    if (this.target.length === 0) return

    this.target.forEach((link) => {
      link.addEventListener('click', this.smoothScroll)
    })
  }

  smoothScroll(event: Event) {
    event.preventDefault()

    const targetId = (event.currentTarget as HTMLAnchorElement).getAttribute('href') as string

    const targetElement = document.querySelector(targetId)

    window.scrollTo({
      top: (targetElement as HTMLElement).offsetTop,
      behavior: 'smooth',
    })
  }

  destroy() {
    if (this.target.length === 0) return

    this.target.forEach((link) => {
      link.removeEventListener('click', this.smoothScroll)
    })
  }
}
