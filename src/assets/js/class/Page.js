import each from 'lodash/each'
import map from 'lodash/map'
import GSAP from 'gsap'
import Prefix from 'prefix'
import AsyncLoad from './AsyncLoad'

export default class Page {
  constructor({ id, element, elements }) {
    this.id = id

    this.selector = element

    this.selectorChildren = {
      ...elements
      // asyncImages: '[data-src]'
    }
  }

  create() {
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 1000 //this amount is gonna be changed the height of the page
    }

    this.element = document.querySelector(this.selector)

    this.elements = {}

    each(this.selectorChildren, (entry, key) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList
      ) {
        this.elements[key] = entry
      } else {
        this.elements[key] = this.element.querySelectorAll(entry)

        if (this.elements[key].length === 0) {
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(entry)
        }
      }
    })

    // this.createAsyncLoaders()
  }

  createAsyncLoaders() {
    this.asyncImages = map(this.elements.asyncImages, element => {
      return new AsyncLoad({
        element
      })
    })
  }

  /**
   * animations
   */
  show(animation) {
    return new Promise(resolve => {
      if (animation) {
        this.animationIn = animation
      } else {
        this.animationIn = GSAP.timeline()

        this.animationIn.to(this.element, {
          autoAlpha: 1,
          duration: 1
        })
      }

      this.animationIn.call(_ => {
        this.addEventListeners()
        resolve() //I think this line is not necessary.
      })
    })
  }

  hide() {
    return new Promise(resolve => {
      this.destroy()

      this.animationOut = GSAP.timeline()

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }

  /**
   * destroy
   */
  destroy() {
    this.removeEventListeners()
  }

  /**
   * events
   */
  onWheel({ pixelY }) {}

  onResize() {}

  /**
   * loop
   */
  update() {}

  /**
   * listeners
   */
  addEventListeners() {}

  removeEventListeners() {}
}
