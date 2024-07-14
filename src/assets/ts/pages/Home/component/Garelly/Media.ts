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

  public update(y: number) {
    this.updatePosition(y)
  }
}
