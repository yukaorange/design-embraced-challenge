import * as THREE from 'three'
import normalizeWheel from 'normalize-wheel'

export default class ScrollAnimator {
  private static instance: ScrollAnimator

  private speed: number = 0
  private accumulatedPosition: number = 0

  private clock: THREE.Clock
  private lastUpdateTime: number = 0

  private decay: number = 0.957
  private decayCoefficient: number = 60
  private sensitivity: number = 0.000026

  private touchStartY: number | null = null
  private touchSensitivity: number = 0.12

  private constructor() {
    this.clock = new THREE.Clock()
    this.lastUpdateTime = this.clock.getElapsedTime()
    this.addEventListeners()
  }

  public static getInstance(): ScrollAnimator {
    if (!ScrollAnimator.instance) {
      ScrollAnimator.instance = new ScrollAnimator()
    }

    return ScrollAnimator.instance
  }

  private addEventListeners(): void {
    window.addEventListener('wheel', this.handleWheel.bind(this))

    window.addEventListener('touchstart', this.handleTouchStart.bind(this))

    window.addEventListener('touchmove', this.handleTouchMove.bind(this))

    window.addEventListener('touchend', this.handleTouchEnd.bind(this))
  }

  private handleWheel(event: WheelEvent): void {
    const normalizedWheel = normalizeWheel(event)
    this.addDelta(normalizedWheel.pixelY)
  }

  private handleTouchStart(event: TouchEvent): void {
    if (event.touches.length > 0) {
      this.touchStartY = event.touches[0].clientY
    }
  }

  private handleTouchMove(event: TouchEvent): void {
    if (event.touches.length > 0 && this.touchStartY !== null) {
      const currentTouchY = event.touches[0].clientY

      const touchDeltaY = this.touchStartY - currentTouchY

      this.touchStartY = currentTouchY

      this.addDelta(touchDeltaY * this.touchSensitivity)
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    this.touchStartY = null
  }

  public addDelta(delta: number): void {
    this.speed += delta * this.sensitivity
  }

  public update(): void {
    const currentTime = this.clock.getElapsedTime()

    const deltaTime = currentTime - this.lastUpdateTime

    this.lastUpdateTime = currentTime

    const decayFactor = Math.pow(this.decay, deltaTime * this.decayCoefficient)

    this.speed *= decayFactor
    this.accumulatedPosition += this.speed
    this.accumulatedPosition *= decayFactor
  }

  public getSpeed(): number {
    return this.speed
  }

  public getAccumulatedPosition(): number {
    return this.accumulatedPosition
  }

  public setDecay(decay: number): void {
    this.decay = decay
  }

  public setDecayCoefficient(coefficient: number): void {
    this.decayCoefficient = coefficient
  }

  public setSensitivity(sensitivity: number): void {
    this.sensitivity = sensitivity
  }

  public setTouchSensitivity(sensitivity: number): void {
    this.touchSensitivity = sensitivity
  }
}
