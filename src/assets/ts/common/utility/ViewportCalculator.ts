import Logger from '@ts/common/utility/Logger'

export default class ViewPortCalculator {
  private vw: number
  private documentWidth: number
  private scrollBarWidth: number
  private ajustWidth: number

  constructor() {
    this.vw = window.innerWidth
    this.documentWidth = document.documentElement.clientWidth
    this.scrollBarWidth = this.vw - this.documentWidth
    this.ajustWidth = this.vw - this.scrollBarWidth
  }

  public onResize() {
    this.vw = window.innerWidth
    this.documentWidth = document.documentElement.clientWidth
    this.scrollBarWidth = this.vw - this.documentWidth
    this.ajustWidth = this.vw - this.scrollBarWidth

    this.updateViewPortWidth()
  }

  private updateViewPortWidth() {
    document.documentElement.style.setProperty('--vw', `${this.ajustWidth}px`)
  }

  public getAjustedWidth() {
    Logger.log(`from ViewPortCalculator.ts /ajustWidth:${this.ajustWidth}px`)

    return this.ajustWidth
  }
}
