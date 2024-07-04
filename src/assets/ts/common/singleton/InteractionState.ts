import normalizeWheel from 'normalize-wheel'

export default class InteractionState {
  private static instance: InteractionState

  private isTouchDown: boolean = false

  public scrollAmount: number = 0
  public mousePosition: { x: number; y: number } = { x: 0, y: 0 }
  public touchCoordinates: { x: number; y: number } = { x: 0, y: 0 }
  public wheelDelta: number = 0

  private constructor() {
    this.addEventListeners()
  }

  public static getInstance(): InteractionState {
    if (!InteractionState.instance) {
      InteractionState.instance = new InteractionState()
    }
    return InteractionState.instance
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
      this.touchCoordinates = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
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
    const normalizedWheel = normalizeWheel(event)

    this.wheelDelta = normalizedWheel.pixelY
  }

  public getScrollAmount(): number {
    return this.scrollAmount
  }

  public getWheelDelta(): number {
    return this.wheelDelta
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
