import Component, { TElements, TElement } from '@ts/abstract/Component'

import GSAP from 'gsap'
import Logger from '@ts/common/utility/Logger'

export default class DrawerNavigation {
  private button: TDrawerButton
  private menu: TDrawerMenu

  constructor(button: TDrawerButton, menu: TDrawerMenu) {
    this.button = button
    this.menu = menu

    this.addButtonClickListener()
    this.addLinkClickListeners()
    this.addCloseClickListener()
    this.addInnerClickListener()
  }

  private addButtonClickListener() {
    this.button.element.addEventListener('click', () => {
      this.toggleState()
      this.toggleButtonText()
    })
  }

  private addLinkClickListeners() {
    this.menu.elements.link.forEach((link: HTMLLinkElement) => {
      link.addEventListener('click', () => {
        this.toggleState()
        this.toggleButtonText()
      })
    })
  }

  private addCloseClickListener() {
    this.menu.elements.close.addEventListener('click', () => {
      this.toggleState()
      this.toggleButtonText()
    })
  }

  private addInnerClickListener() {
    this.menu.elements.inner.addEventListener('click', (e: Event) => {
      // e.stopPropagation()

      if (e.target === this.menu.elements.inner) {
        this.toggleState()
        this.toggleButtonText()
      }
    })
  }

  private toggleButtonText() {
    this.button.toggleText()
  }

  private toggleState() {
    this.button.toggleState()

    const isExpanded = this.button.getIsExpanded()

    this.menu.toggleState(isExpanded)
  }
}

/**
 * button
 */
type TDrawerButton = {
  toggleText: () => void
  toggleState: () => void
  getInstance: () => DrawerButton
  getIsExpanded: () => boolean
  element: TElement
  elements: TElements
  isExpanded: boolean
}

export class DrawerButton extends Component implements TDrawerButton {
  public isExpanded: boolean

  constructor() {
    super({
      element: '[data-ui="drawer-button"]',
      elements: {
        textMenu: '[data-ui="drawer-button-text-menu"]',
        textClose: '[data-ui="drawer-button-text-close"]'
      }
    })

    this.isExpanded = false

    this.element.setAttribute('aria-expanded', 'false')
  }

  public toggleText() {
    const textMenu = this.elements.textMenu
    const textClose = this.elements.textClose

    const isExpanded = this.element.getAttribute('aria-expanded') === 'true'

    this.isExpanded = isExpanded

    if (isExpanded) {
      textMenu.classList.remove('active')

      textClose.classList.add('active')
    } else {
      textMenu.classList.add('active')

      textClose.classList.remove('active')
    }
  }

  public toggleState() {
    this.isExpanded = !this.isExpanded

    this.element.setAttribute('aria-expanded', this.isExpanded)

    this.element.classList.toggle('active')
  }

  public getIsExpanded() {
    return this.isExpanded
  }
}

/**
 * menu
 */
type TDrawerMenu = {
  toggleState: (isExpanded: boolean) => void
  element: TElement
  elements: TElements
}

export class DrawerMenu extends Component implements TDrawerMenu {
  constructor() {
    super({
      element: '[data-ui="drawer-nav"]',
      elements: {
        inner: '[data-ui="drawer-nav-inner"]',
        list: '[data-ui="list-drawer-nav"]',
        item: '[data-ui="item-drawer-nav"]',
        link: '[data-ui="item-drawer-nav__link"]',
        close: '[data-ui="drawer-close"]'
      }
    })

    this.element.setAttribute('aria-hidden', 'true')
  }

  public toggleState(isExpanded: boolean) {
    this.element.setAttribute('aria-hidden', !isExpanded)

    this.element.classList.toggle('active')
  }
}
