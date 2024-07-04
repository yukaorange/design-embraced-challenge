import Page from '@ts/abstract/Page'

type TOptions = {
  device: string
}

export default class About extends Page {
  constructor(params: TOptions) {
    super({
      id: 'about',
      element: '[data-template="about"]',
      elements: {},
      device: params.device,
    })
  }

  create() {
    super.create()
  }

  set() {
    super.set()
  }

  show() {
    super.show()
  }

  async hide() {
    await super.hide()
  }

  onResize(params: { device: string }) {
    super.onResize(params)
  }

  destroy() {
    super.destroy()
  }
}
