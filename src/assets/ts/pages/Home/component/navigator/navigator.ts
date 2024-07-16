import Component from '@ts/abstract/Component'
import ScrollAnimator from '@ts/common/singleton/ScrollAnimator'
import Logger from '@ts/common/utility/Logger'

import GSAP from 'gsap'

export class NavigatorElement extends Component {
  constructor() {
    super({
      element: '[data-ui="navigator"]',
      elements: {}
    })
  }
}

export class Navigator {
  private element: NavigatorElement | null = null
  private elements: { [key: string]: HTMLElement } = {}

  public create(navigator: NavigatorElement) {
    this.element = navigator.element
    this.elements = navigator.elements
  }

  public onResize() {}

  public update(amount: number) {
    if (!this.element) return

    const element = this.element as unknown as HTMLElement

    element.style.setProperty('--progress', `${amount}`)
  }
}

export class NavigatorManager {
  private element: NavigatorElement
  private navigator: Navigator

  constructor() {
    this.element = new NavigatorElement()
    this.navigator = new Navigator()

    this.navigator.create(this.element)
  }

  public update(amount: number) {
    this.navigator.update(amount)
  }

  public onResize() {
    this.navigator.onResize()
  }
}
