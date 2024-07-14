import Component from '@ts/abstract/Component'
import InteractionState from '@ts/common/singleton/InteractionState'
import Logger from '@ts/common/utility/Logger'

import GSAP from 'gsap'

import { Media } from './Media'

export class GarellyElement extends Component {
  constructor() {
    super({
      element: '[data-ui="garelly"]',
      elements: {
        media: '[data-ui="garelly-media"]'
      }
    })
  }
}

export class Garelly {
  private element: GarellyElement | null = null
  private elements: { [key: string]: HTMLElement } = {}
  private delta: number | undefined
  private accumulateDelta: number = 0
  private offsetRange: number = 2
  private itemLength: number = 0
  private itemHeight: number = 0
  private totalHeight: number = 0
  private snapDuration: number = 0.4
  private lastScrollTime: number = Date.now()
  private snapDelay: number = 500
  private isSnapping: boolean = false

  private interactionState: InteractionState | null = null
  private mediasElements: any
  private medias: Media[] | null = null

  public create(garelly: GarellyElement) {
    this.interactionState = InteractionState.getInstance()
    this.element = garelly.element
    this.elements = garelly.elements
    this.mediasElements = garelly.elements.media

    this.itemLength = this.mediasElements?.length ?? 0

    this.initialize()

    this.update()
  }

  private initialize() {
    this.medias = [...this.mediasElements].map((media, index) => {
      return new Media({
        totalLegth: this.itemLength,
        element: media,
        id: index
      })
    })
  }

  private calculateDimention() {
    this.itemHeight = window.innerHeight

    this.totalHeight = this.itemHeight * this.itemLength
  }

  // resize
  public onResize() {
    const oldTotalHeight = this.totalHeight

    this.calculateDimention()

    if (oldTotalHeight && this.totalHeight) {
      this.accumulateDelta =
        (this.accumulateDelta / oldTotalHeight) * this.totalHeight
    }

    this.update()
  }

  // update
  private updatePositions() {
    const offsetHeight = this.itemHeight * this.offsetRange

    this.medias?.forEach((media, index) => {
      let y = -this.accumulateDelta + index * this.itemHeight

      if (y > this.totalHeight - offsetHeight) {
        y -= this.totalHeight
      } else if (y < -offsetHeight) {
        y += this.totalHeight
      }

      media.update(y)
    })
  }

  private snapToNearestSlide() {
    const currentIndex = this.accumulateDelta / this.itemHeight

    this.isSnapping = true

    const nearestIndex = Math.round(currentIndex)

    const targetDelta = nearestIndex * this.itemHeight

    GSAP.to(this, {
      accumulateDelta: targetDelta,
      duration: this.snapDuration,
      ease: 'power2.in',
      onComplete: () => {
        this.accumulateDelta = targetDelta
        this.lastScrollTime = Date.now()
        this.isSnapping = false
      }
    })
  }

  public update() {
    const currentTime = Date.now()

    this.delta = this.interactionState?.getWheelDelta() ?? 0

    if (this.delta === 0) {
      this.updatePositions()

      return
    }

    if (Math.abs(this.delta) > 1e-10) {
      this.lastScrollTime = currentTime

      if (this.isSnapping) {
        GSAP.killTweensOf(this)
        this.isSnapping = false
      }

      this.accumulateDelta += this.delta
    } else if (!this.isSnapping) {
      const isReadyToSnap = currentTime - this.lastScrollTime > this.snapDelay

      if (isReadyToSnap) {
        this.snapToNearestSlide()
      }
    }

    // Logger.log(`from Garelly.ts(dom) dom:${this.accumulateDelta}`)

    if (this.accumulateDelta < 0) {
      this.accumulateDelta += this.totalHeight
    } else if (this.accumulateDelta > this.totalHeight) {
      this.accumulateDelta -= this.totalHeight
    }

    this.updatePositions()
  }
}

export class GalleryManager {
  private element: GarellyElement
  private garelly: Garelly

  constructor() {
    this.element = new GarellyElement()
    this.garelly = new Garelly()

    this.garelly.create(this.element)
  }

  public update() {
    this.garelly.update()
  }

  public onResize() {
    this.garelly.onResize()
  }
}
