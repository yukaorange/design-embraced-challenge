import Component from '@js/class/Component'
import each from 'lodash/each'
import GSAP from 'gsap'

export default class DrawerNavigation extends Component {
  constructor() {
    super({
      element: '.drawer-nav',
      elements: {
        inner: '.drawer-nav__inner',
        list: '.list-drawer-nav',
        item: '.item-drawer-nav',
        link: '.item-drawer-nav__link',
        button: document.querySelector('.drawer-button'),
        closeButton: document.querySelector('.drawer-nav__close')
      }
    })

    this.createNav()
  }

  createNav() {
    this.drawerNav = new DrawerNavigationGenerator({
      button: this.elements.button,
      drawerNav: this.element,
      drawerInner: this.elements.inner,
      drawerNavButton: this.elements.link,
      closeButton: this.elements.closeButton
    })
  }
}

class DrawerNavigationGenerator {
  constructor({
    button,
    drawerNav,
    drawerInner,
    drawerNavButton,
    closeButton
  }) {
    this.drawerButton = button
    this.nav = drawerNav
    this.navButtons = drawerNavButton
    this.closeButton = closeButton || null
    this.drawerInner = drawerInner

    // Set initial ARIA attributes
    this.drawerButton.setAttribute('aria-expanded', 'false')
    this.nav.setAttribute('aria-hidden', 'true')
    if (this.closeButton) {
      this.closeButton.setAttribute('tabindex', '0')
    }

    this.init()
  }

  init() {
    this.setupDrawerToggleButton()
    this.setupNavButtonActions()
    this.setupCloseOutsideClick()
    // this.preventInnerPropagation()
    this.setupCloseButtonClick()
    // this.setupButtonTextToggle()
  }

  setupDrawerToggleButton() {
    this.drawerButton.addEventListener('click', () => {
      const isExpanded =
        this.drawerButton.getAttribute('aria-expanded') === 'true'

      this.drawerButton.setAttribute('aria-expanded', !isExpanded)

      this.nav.setAttribute('aria-hidden', isExpanded)

      this.drawerButton.classList.toggle('active')

      this.nav.classList.toggle('active')

      this.setupButtonTextToggle()
    })
  }

  setupButtonTextToggle() {
    this.toggleText()

    this.drawerButton.addEventListener('click', () => {
      this.toggleText()
    })
  }

  toggleText() {
    const textMenu = this.drawerButton.querySelector(
      '.drawer-button__text--menu'
    )
    const textClose = this.drawerButton.querySelector(
      '.drawer-button__text--close'
    )
    const isExpanded =
      this.drawerButton.getAttribute('aria-expanded') === 'true'
    if (isExpanded) {
      textMenu.classList.remove('active')
      textClose.classList.add('active')
    } else {
      textMenu.classList.add('active')
      textClose.classList.remove('active')
    }
  }

  setupNavButtonActions() {
    this.navButtons.forEach(el => {
      el.addEventListener('click', () => {
        if (
          this.drawerButton.classList.contains('active') ||
          this.nav.classList.contains('active')
        ) {
          this.closeDrawer()
        }
      })
    })
  }

  setupCloseOutsideClick() {
    this.nav.addEventListener('click', e => {
      if (
        (e.target === this.nav &&
          this.drawerButton.getAttribute('aria-expanded') === 'true') ||
        this.nav.getAttribute('aria-hidden') === 'false'
      ) {
        this.closeDrawer()
      }
    })
  }

  preventInnerPropagation() {
    this.drawerInner.addEventListener('click', e => {
      e.stopPropagation()
    })
  }

  setupCloseButtonClick() {
    if (this.closeButton === null) return

    this.closeButton.addEventListener('click', () => {
      this.closeDrawer()
    })
  }

  closeDrawer() {
    this.drawerButton.classList.remove('active')
    this.nav.classList.remove('active')
    this.drawerButton.setAttribute('aria-expanded', 'false')
    this.nav.setAttribute('aria-hidden', 'true')
  }
}
