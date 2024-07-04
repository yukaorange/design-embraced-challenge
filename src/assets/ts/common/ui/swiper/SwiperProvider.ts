import Swiper from 'swiper'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import { SwiperOptions } from 'swiper/types'
import 'swiper/css'

export type TSwiperElements = {
  element: HTMLElement
  slide: HTMLElement[]
  buttonPrev: HTMLElement | null
  buttonNext: HTMLElement | null
  indicator: HTMLElement | null
}

export default class SwiperProvider {
  private element: HTMLElement | null = null
  private slide: HTMLElement[] = []
  private buttonPrev: HTMLElement | null = null
  private buttonNext: HTMLElement | null = null
  private indicator: HTMLElement | null = null
  private swiper: Swiper | null = null

  public initialize(elements: TSwiperElements) {
    this.element = elements.element
    this.slide = elements.slide
    this.buttonPrev = elements.buttonPrev
    this.buttonNext = elements.buttonNext
    this.indicator = elements.indicator
  }

  public generate(options: SwiperOptions) {
    if (this.indicator) {
      options.pagination = {
        el: this.indicator,
        type: 'bullets',
        clickable: true,
      }
    }

    if (this.buttonPrev && this.buttonNext) {
      options.navigation = {
        nextEl: this.buttonNext,
        prevEl: this.buttonPrev,
      }
    }

    this.swiper = new Swiper(this.element as HTMLElement, {
      ...options,
      modules: [Navigation, Pagination, Autoplay],
    })
  }

  public destroy() {
    if (this.swiper) {
      this.swiper.destroy()

      this.swiper = null
    }
  }
}
