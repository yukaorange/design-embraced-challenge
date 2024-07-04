import each from 'lodash/each'
import map from 'lodash/map'
import GSAP from 'gsap'
import AsyncLoad from '@ts/common/utility/AsyncLoad'

import Logger from '@ts/common/utility/Logger'

export type TElement = string | HTMLElement | any
export type TSelector = string | HTMLElement | any
export type TElements = {
  [key: string]: any
}

export type TPage = {
  id: string
  element: TElement
  elements: TElements
  device: string
}

/**
 * @param {TElement} element
 * @param {TElements} elements
 * @param {string} device
 * this is the base class for all pages
 * this can access the parent page
 * this can access the children pages
 * this can emit events
 */
export default abstract class Page {
  id: string
  protected selector: TElement
  protected selectorChildren: TElements
  public element: TElement
  public elements: TElements
  device: string
  private scroll: { [key: string]: number | null }
  private asyncImages: any[]
  private animationIn: any
  private animationOut: any

  constructor(params: TPage) {
    this.id = params.id

    this.selector = params.element

    this.selectorChildren = {
      ...params.elements,
      asyncImages: '[data-src]',
      animationText: '[data-animation="text"]'
    }

    this.device = params.device

    this.element = null

    this.elements = {}

    this.asyncImages = []

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: null
    }

    this.animationIn = null
    this.animationOut = null

    this.createAsyncLoaders()

    this.createAnimations()
  }

  public create() {
    this.element = document.querySelector(this.selector)

    this.elements = {}

    each(this.selectorChildren, (entry: any, key: string) => {
      if (
        entry instanceof window.HTMLElement ||
        entry instanceof window.NodeList
      ) {
        this.elements[key] = entry
      } else {
        // If more than one element is found, the NodeList remains assigned.
        this.elements[key] = this.element.querySelectorAll(entry)

        // Handle the number of elements found:
        if (this.elements[key].length === 0) {
          // If no elements are found, set to null.
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          // If only one element is found, use querySelector to assign it directly.
          this.elements[key] = this.element.querySelector(entry)
        }
      }
    })

    this.createAsyncLoaders()
  }

  private createAsyncLoaders() {
    if (!this.elements.asyncImages) {
      Logger.log('from page.ts / no async images')
      return
    }

    this.asyncImages = map(this.elements.asyncImages, element => {
      return new AsyncLoad({
        element
      })
    })
  }

  private createAnimations() {}

  /**
   * animations
   */
  public set() {
    GSAP.set(this.element, {
      autoAlpha: 0,
      onComplete: () => {
        Logger.log(`from Page.ts@${this.id} / page base set animation end`)
      }
    })

    GSAP.set(this.elements.animationText, {
      autoAlpha: 0
    })
  }

  public show() {
    this.animationIn = GSAP.timeline({
      onComplete: () => {
        Logger.log(`from Page.ts@${this.id} / page base show animation end`)

        this.addEventListeners()
      }
    })

    this.animationIn.to(this.element, {
      autoAlpha: 1,
      duration: 0.2,
      ease: 'power2.out',
      onStart: () => {
        Logger.log(`from Page.ts@${this.id} / page base show animation start`)
      }
    })

    this.animationIn.to(this.elements.animationText, {
      autoAlpha: 1,
      delay: 0.2,
      duration: 0.5,
      ease: 'power2.out',
      onStart: () => {}
    })
  }

  public hide(): Promise<void> {
    return new Promise(resolve => {
      window.scrollTo({
        top: 0
        // behavior: 'smooth',
      })

      this.animationOut = GSAP.timeline({
        onComplete: () => {
          Logger.log(`from Page.ts@${this.id} / page base hide animation end`)

          this.removeEventListeners()

          resolve()
        }
      })

      this.animationOut.to(this.elements.animationText, {
        autoAlpha: 0,
        duration: 0.5,
        ease: 'power2.out'
      })

      this.animationOut.to(this.element, {
        autoAlpha: 0,
        delay: 0.2,
        duration: 0.2,
        ease: 'power2.out'
      })
    })
  }

  /**
   * destroy
   */
  public destroy() {
    this.removeEventListeners()
  }

  /**
   * events
   */
  public onWheel() {}

  public onScroll() {}

  public onResize(params: { device: string }) {
    this.device = params.device
  }

  /**
   * loop
   */
  public update() {}

  /**
   * listeners
   */
  private addEventListeners() {}

  private removeEventListeners() {}
}
