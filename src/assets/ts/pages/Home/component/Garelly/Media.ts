type T_Media = {
  totalLegth: number
  element: HTMLElement
  id: number
}

export class Media {
  private totalLength: number = 0
  private element: HTMLElement
  private id: number

  constructor(params: T_Media) {
    const { element, id, totalLegth } = params

    this.element = element
    this.id = id
    this.totalLength = totalLegth

    this.element.style.zIndex = `${this.totalLength - this.id}`
  }

  private updatePosition(y: number) {
    this.element.style.transform = `translateY(${y}px)`
  }

  private updateDataProgress(progress: number) {
    this.element.style.setProperty('--rotate-progress', `${progress}`)

    this.element.style.setProperty(
      '--translate-progress',
      `${Math.abs(progress)}`
    )
  }

  public update(parameter: { y: number; progress: number }) {
    const { y, progress } = parameter

    this.updatePosition(y)

    this.updateDataProgress(progress)
  }
}
