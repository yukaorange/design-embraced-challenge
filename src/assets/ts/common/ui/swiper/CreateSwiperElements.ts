import Component from '@ts/abstract/Component'

export default class CreateSwiperElements extends Component {
  constructor(element: HTMLElement) {
    super({
      element: element,
      elements: {
        swiperSlide: '[data-ui="swiper-slide"]',

        swiperButtonPrev: '[data-ui="swiper-button-prev"]',

        swiperButtonNext: '[data-ui="swiper-button-next"]',

        swiperIndicator: '[data-ui="swiper-indicator"]',
      },
    })
  }

  public getElement() {
    return this.element
  }

  public getSlides() {
    return this.elements.swiperSlide
  }

  public getButtonPrev() {
    return this.elements.swiperButtonPrev
  }

  public getButtonNext() {
    return this.elements.swiperButtonNext
  }

  public getIndicator() {
    return this.elements.swiperIndicator
  }
}
