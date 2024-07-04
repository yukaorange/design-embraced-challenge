import Component from '@ts/abstract/Component'
// import { each } from 'lodash'
import GSAP from 'gsap'

import Logger from '@ts/common/utility/Logger'

export default class Header {
  private scrollObserver: THeaderScrollObserver
  private heightCalculator: THeaderHeightCalculator

  constructor(scrollObserver: THeaderScrollObserver, heightCalculator: THeaderHeightCalculator) {
    this.heightCalculator = heightCalculator

    this.scrollObserver = scrollObserver

    const height = this.heightCalculator.getHeaderHeight()

    this.scrollObserver.setQuantity(height)
  }

  onScroll(event: Event) {
    this.scrollObserver.onScroll(event)
  }

  onResize() {
    this.heightCalculator.onResize()

    const height = this.heightCalculator.getHeaderHeight()

    this.scrollObserver.onResize(height)
  }
}

/**
 * scroll observer
 */
type THeaderScrollObserver = {
  onScroll: (event: Event) => void
  onResize: (height: number) => void
  setQuantity: (quantity: number) => void
}

export class HeaderScrollObserver extends Component {
  private monitoredQuantity: number

  constructor() {
    super({
      element: '[data-ui="header"]',
      elements: {
        logo: '[data-ui="header-Logo"]',
        nav: '[data-ui="global-nav"]',
        link: '[data-ui="global-nav-item-link"]',
      },
    })

    this.monitoredQuantity = 100
  }

  onScroll(event: Event) {
    const scrollPosition = window.scrollY

    this.monitoredQuantity < scrollPosition
      ? this.element.classList.add('scrolled')
      : this.element.classList.remove('scrolled')
  }

  onResize(quantity: number) {
    this.setQuantity(quantity)
  }

  setQuantity(quantity: number) {
    this.monitoredQuantity = quantity
  }
}

/**
 * header height calculator
 */

type THeaderHeightCalculator = {
  onResize: () => void
  getHeaderHeight: () => number
}

export class HeaderHeightCalculator extends Component {
  private headerHeight: number

  constructor() {
    super({
      element: '[data-ui="header"]',
      elements: {},
    })

    this.headerHeight = this.element.offsetHeight
  }

  private calcHeaderHeight() {
    this.headerHeight = this.element.offsetHeight
  }

  private setHeaderHeight() {
    document.documentElement.style.setProperty('--header-height', `${this.headerHeight}px`)
  }

  public onResize() {
    this.calcHeaderHeight()

    this.setHeaderHeight()
  }

  public getHeaderHeight() {
    return this.headerHeight
  }
}
