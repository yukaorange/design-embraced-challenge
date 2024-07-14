import normalizeWheel from 'normalize-wheel'
import GSAP from 'gsap'
import Logger from '@ts/common/utility/Logger'
import * as THREE from 'three'

export default class InteractionState {
  private static instance: InteractionState

  private isTouchDown: boolean = false

  public mousePosition: { x: number; y: number } = { x: 0, y: 0 }
  public touchCoordinates: { x: number; y: number } = { x: 0, y: 0 }

  private touchStartY: number | null = null
  private touchSensitivity: number = 0.15

  public scrollAmount: number = 0
  public wheelDelta: number = 0
  private wheelSensitivity: number = 0.1
  private currentWheelDelta: number = 0
  private wheelDebounceTime: number = 10
  private wheelEvents: WheelEvent[] = []
  private wheelTimeout: number | null = null
  private speed: number = 0
  private accumulatedPosition: number = 0

  private clock: THREE.Clock
  private lastTime: number
  private currentTime: number

  private scroll = {
    start: 0,
    current: 0,
    target: 0,
    lerp: 0.1
  }

  private constructor() {
    this.addEventListeners()

    this.clock = new THREE.Clock()
    this.lastTime = this.clock.getElapsedTime()
    this.currentTime = 0
  }

  public static getInstance(): InteractionState {
    if (!InteractionState.instance) {
      InteractionState.instance = new InteractionState()
    }
    return InteractionState.instance
  }

  public getSpeed(): number {
    return this.speed
  }

  public getAccumulatedPosition(): number {
    return this.accumulatedPosition
  }

  private addEventListeners(): void {
    window.addEventListener('scroll', this.updateScrollAmount.bind(this))

    window.addEventListener('mousedown', this.updateMousePosition.bind(this))

    window.addEventListener('mousemove', this.updateMousePosition.bind(this))

    window.addEventListener('mouseup', this.updateMousePosition.bind(this))

    window.addEventListener(
      'touchstart',
      this.updateTouchCoordinates.bind(this)
    )

    window.addEventListener('touchmove', this.updateTouchCoordinates.bind(this))

    window.addEventListener('touchend', this.updateTouchCoordinates.bind(this))

    window.addEventListener('wheel', this.updateWheel.bind(this))
  }

  private updateScrollAmount(event: Event): void {
    this.scrollAmount = window.scrollY
  }

  private updateMousePosition(event: MouseEvent): void {
    this.mousePosition = { x: event.clientX, y: event.clientY }
  }

  private updateTouchCoordinates(event: TouchEvent): void {
    this.updateTouchState(event.type)

    if (event.touches.length > 0) {
      const touch = event.touches[0]

      this.touchCoordinates = {
        x: touch.clientX,
        y: touch.clientY
      }

      if (event.type === 'touchstart') {
        this.touchStartY = touch.clientY

        this.scroll.start = this.scroll.current
      } else if (event.type === 'touchmove' && this.touchStartY !== null) {
        const distance = this.touchStartY - touch.clientY

        this.scroll.target =
          this.scroll.start + distance * this.touchSensitivity
      }

      if (event.type === 'touchend') {
        this.touchStartY = null
      }
    }
  }

  private updateTouchState(type: string) {
    if (type == 'touchstart') {
      this.isTouchDown = true
    }

    if (type == 'touchend') {
      this.isTouchDown = false
    }
  }

  private updateWheel(event: WheelEvent): void {
    Logger.log(`from InteractionState.ts / updateWheel`)

    this.wheelEvents.push(event)

    if (this.wheelTimeout === null) {
      this.wheelTimeout = window.setTimeout(() => {
        this.processWheelEvents()

        this.wheelTimeout = null
      }, this.wheelDebounceTime)
    }
  }

  private processWheelEvents(): void {
    let totalDelta = 0

    for (const event of this.wheelEvents) {
      const normalizedWheel = normalizeWheel(event)

      totalDelta += normalizedWheel.pixelY
    }

    const adjustedDelta = totalDelta * this.wheelSensitivity

    this.scroll.target += adjustedDelta

    this.wheelEvents = []
  }

  public update(): void {
    let distance = this.scroll.target - this.scroll.current

    this.scroll.current = GSAP.utils.interpolate(
      this.scroll.current,
      this.scroll.target,
      this.scroll.lerp
    )

    this.currentWheelDelta = distance
  }

  public getScrollAmount(): number {
    return this.scrollAmount
  }

  public getWheelDelta(): number {
    return this.currentWheelDelta
  }

  public getMousePosition(): { x: number; y: number } {
    return this.mousePosition
  }

  public getTouchCoordinates(): { x: number; y: number } {
    return this.touchCoordinates
  }

  public get touchDown(): boolean {
    return this.isTouchDown
  }
}
