import Component from '@ts/abstract/Component'
import ScrollAnimator from '@ts/common/singleton/ScrollAnimator'
import Logger from '@ts/common/utility/Logger'

import GSAP from 'gsap'

export class IndicatorElement extends Component {
  constructor() {
    super({
      element: '[data-ui="indicator"]',
      elements: {
        speed: '[data-ui="indicator-speed"]'
      }
    })
  }
}

export class Indicator {
  private element: IndicatorElement | null = null
  private elements: { [key: string]: HTMLElement } = {}
  private scrollAnimator: ScrollAnimator | null = null
  private accumulateSpeed: number = 0

  public create(indicator: IndicatorElement) {
    this.scrollAnimator = ScrollAnimator.getInstance()
    this.element = indicator.element
    this.elements = indicator.elements

    this.initialize()

    this.update()
  }

  private initialize() {}

  public onResize() {}

  public update() {
    this.accumulateSpeed = this.scrollAnimator?.getAccumulatedPosition() || 0

    this.elements.speed.style.setProperty('--speed', `${this.accumulateSpeed}`)
  }
}

export class IndicatorManager {
  private element: IndicatorElement
  private indicator: Indicator

  constructor() {
    this.element = new IndicatorElement()
    this.indicator = new Indicator()

    this.indicator.create(this.element)
  }

  public update() {
    this.indicator.update()
  }

  public onResize() {
    this.indicator.onResize()
  }
}
