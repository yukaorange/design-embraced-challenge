import Component from '@ts/abstract/Component'

import InteractionState from '@ts/common/singleton/InteractionState'

import { Media, T_Media } from '@ts/webgl/Home/garelly/Media'

import GSAP from 'gsap'

import Logger from '@ts/common/utility/Logger'

import * as THREE from 'three'

// types
export type T_Option = {
  sizes: {
    width: number
    height: number
  }
  device: string
}

type T_Garelly = {
  sizes: {
    width: number
    height: number
  }
  device: string
  scene: THREE.Scene
}

export type T_GarellyManager = {
  sizes: {
    width: number
    height: number
  }
  device: string
  scene: THREE.Scene
}

// class
export class Garelly {
  private sizes: {
    width: number
    height: number
  }
  private device: string
  private scene: THREE.Scene
  private element: Component | null = null
  private mediaFrameElements: any
  private mediaFrameGarelly: Media[] = []
  private delta: number | undefined
  private speed: number | undefined
  private accumulateDelta: number = 0
  private offsetRange: number = 2
  private itemLength: number = 0
  private itemHeight: number = 0
  private totalHeight: number = 0
  private lastScrollTime: number = Date.now()
  private snapDuration: number = 0.4
  private snapDelay: number = 500
  private lastSnapTime: number = Date.now()
  private snapCooldown: number = 500
  private isSnapping: boolean = false
  private interactionState: InteractionState | null = null

  private mousePosition: { x: number; y: number } | undefined = { x: 0, y: 0 }

  constructor(params: T_Garelly) {
    const { sizes, device, scene } = params

    this.sizes = sizes
    this.device = device
    this.scene = scene
    this.interactionState = InteractionState.getInstance()
  }

  create(element: Component) {
    this.element = element
    this.mediaFrameElements = element.elements.frame
    this.itemLength = this.mediaFrameElements?.length ?? 0
    this.createGarelly()
    this.calculateDimension()
  }

  private createGarelly() {
    this.mediaFrameGarelly = [...this.mediaFrameElements].map(
      (element, index) => {
        return new Media({
          sizes: this.sizes,
          device: this.device,
          totalLength: this.itemLength,
          scene: this.scene,
          element: element,
          id: index
        })
      }
    )
  }

  private calculateDimension() {
    this.itemHeight = this.sizes.height

    this.totalHeight = this.itemHeight * this.itemLength
  }

  // events
  onResize(params: T_Option) {
    const oldTotalHeight = this.totalHeight

    this.sizes = params.sizes
    this.device = params.device
    this.calculateDimension()

    if (oldTotalHeight && this.totalHeight) {
      this.accumulateDelta =
        (this.accumulateDelta / oldTotalHeight) * this.totalHeight
    }

    this.mediaFrameGarelly.forEach((media: Media) => {
      media.onResize(params)
    })

    this.update()
  }

  // animation
  show() {
    this.mediaFrameGarelly.forEach((garelly: Media) => {
      garelly.show()
    })
  }

  //  update
  private updatePositions() {
    let x: number, y: number
    let optimizedMouseX: number, optimizedMouseY: number

    if (this.mousePosition) {
      x = this.mousePosition.x
      y = this.mousePosition.y

      optimizedMouseX =
        (x / window.innerWidth) * this.sizes.width - this.sizes.width / 2

      optimizedMouseY =
        -(y / window.innerHeight) * this.sizes.height + this.sizes.height / 2
    }

    // Logger.log(
    //   'from Garelly.ts /',
    //   `mouseX:`,
    //   optimizedMouseX,
    //   `mouseY:`,
    //   optimizedMouseY
    // )

    const offsetHeight = this.itemHeight * this.offsetRange

    this.mediaFrameGarelly.forEach((media, index) => {
      let y = this.accumulateDelta - index * this.itemHeight

      if (y > this.totalHeight - offsetHeight) {
        y -= this.totalHeight
      } else if (y < -offsetHeight) {
        y += this.totalHeight
      }

      let progress = (y + this.itemHeight) / this.itemHeight - 1

      progress = Math.max(-1, Math.min(1, progress))

      const parameter = {
        y: y,
        progress: progress,
        mousePosition: { x: optimizedMouseX, y: optimizedMouseY }
      }

      media.update(parameter)
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
      onUpdate: () => {},
      onComplete: () => {
        this.accumulateDelta = targetDelta
        this.lastScrollTime = performance.now()
        this.isSnapping = false
      }
    })
  }

  update() {
    const currentTime = performance.now()

    this.delta = this.interactionState?.getWheelDelta() ?? 0

    this.mousePosition = this.interactionState?.getMousePosition()

    if (this.delta === 0) {
      this.updatePositions()

      return
    }

    if (Math.abs(this.delta) > 1e-8) {
      this.lastScrollTime = currentTime

      if (this.isSnapping) {
        GSAP.killTweensOf(this)
        this.isSnapping = false
      }

      const coefficient = this.sizes.height / window.innerHeight

      this.accumulateDelta += this.delta * coefficient

      if (this.accumulateDelta < 0) {
        this.accumulateDelta += this.totalHeight
      } else if (this.accumulateDelta > this.totalHeight) {
        this.accumulateDelta -= this.totalHeight
      }
    } else if (!this.isSnapping) {
      const isReadyToSnap = currentTime - this.lastScrollTime > this.snapDelay

      if (isReadyToSnap) {
        this.snapToNearestSlide()
      }
    }

    this.updatePositions()
  }
}

export class GarellyElement extends Component {
  constructor() {
    super({
      element: '[data-ui="garelly"]',
      elements: {
        media: '[data-ui="garelly-media"]',
        frame: '[data-ui="garelly-frame"]'
      }
    })
  }
}

export class GarellyManager {
  private garellyElement: GarellyElement
  private sizes: { width: number; height: number }
  private device: string
  private garelly: Garelly | null = null
  private scene: THREE.Scene

  constructor(params: T_GarellyManager) {
    const { sizes, device, scene } = params

    this.sizes = sizes
    this.device = device
    this.scene = scene

    this.garellyElement = new GarellyElement()

    this.garelly = new Garelly({
      sizes: this.sizes,
      device: this.device,
      scene: this.scene
    })

    this.garelly?.create(this.garellyElement)
  }

  public onResize(params: T_Option) {
    this.garelly?.onResize(params)
  }

  public show() {
    this.garelly?.show()
  }

  public update() {
    this.garelly?.update()
  }
}
