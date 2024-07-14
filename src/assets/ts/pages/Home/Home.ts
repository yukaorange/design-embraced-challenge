import Page from '@ts/abstract/Page'
import Logger from '@ts/common/utility/Logger'
import GSAP from 'gsap'
import { GalleryManager } from '@ts/pages/Home/component/Garelly/Garelly'
import { IndicatorManager } from '@ts/pages/Home/component/indicator/Indicator'
import InteractionState from '@ts/common/singleton/InteractionState'

type TOptions = {
  device: string
}

export default class Home extends Page {
  private garellyManager: GalleryManager | null = null
  private indicatorManager: IndicatorManager | null = null

  constructor(params: TOptions) {
    super({
      id: 'home',
      element: '[data-template="home"]',
      elements: {},
      device: params.device
    })
  }

  public create() {
    super.create()

    this.garellyManager = new GalleryManager()

    this.indicatorManager = new IndicatorManager()
  }

  /**
   * animation
   */
  public set() {
    super.set()
  }

  public show() {
    super.show()
  }

  public async hide() {
    await super.hide()
  }

  public onResize(params: { device: string }) {
    super.onResize(params)

    this.garellyManager?.onResize()
  }

  public destroy() {
    super.destroy()
  }

  public update() {
    super.update()

    this.garellyManager?.update()

    this.indicatorManager?.update()
  }
}
