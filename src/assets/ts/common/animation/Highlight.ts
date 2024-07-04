import Animation from '@ts/abstract/Animation'
import GSAP from 'gsap'
// import each from "lodash/each";

export default class Highlight extends Animation {
  private timelineIn: any
  private timelineOut: any

  constructor({ element, elements }: { element: HTMLElement; elements: any }) {
    super({ element, elements })

    this.timelineIn = null

    this.timelineOut = null
  }

  set() {
    super.set()
  }

  animateIn() {
    this.timelineIn = GSAP.timeline({ delay: 0.5 })

    this.timelineIn.fromTo(
      this.element,
      {
        autoAlpha: 0,
        delay: 0.5,
      },
      {
        autoAlpha: 1,
      },
      '0'
    )
  }

  animateOut() {
    this.timelineOut = GSAP.timeline({ delay: 0.5 })

    this.timelineOut.fromTo(this.element, { autoAlpha: 1 }, { autoAlpha: 0 })
  }

  onResize() {}
}
