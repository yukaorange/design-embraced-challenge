// src/ts/common/utility/UserAgent.ts

interface UserAgentOptions {
  body?: HTMLElement
}

interface UserAgentData {
  browser: string
  os: string
  device: string
  iphone: string
}

export default class UserAgent {
  private body: HTMLElement
  private bodyClassList: DOMTokenList
  private ua: string
  private data: UserAgentData

  constructor({ body = document.body }: UserAgentOptions) {
    this.body = body
    this.bodyClassList = this.body.classList
    this.ua = window.navigator.userAgent.toLowerCase()
    this.data = {
      browser: '',
      os: '',
      device: '',
      iphone: '',
    }

    this.checkBrowser()
    this.checkOs()
    this.checkDevice()
    this.checkiPhone()
  }

  private checkBrowser(): void {
    if (this.ua.includes('edge') || this.ua.includes('edga') || this.ua.includes('edgios')) {
      this.data.browser = 'edge'
    } else if (this.ua.includes('opera') || this.ua.includes('opr')) {
      this.data.browser = 'opera'
    } else if (this.ua.includes('samsungbrowser')) {
      this.data.browser = 'samsung'
    } else if (this.ua.includes('ucbrowser')) {
      this.data.browser = 'uc'
    } else if (this.ua.includes('chrome') || this.ua.includes('crios')) {
      this.data.browser = 'chrome'
    } else if (this.ua.includes('firefox') || this.ua.includes('fxios')) {
      this.data.browser = 'firefox'
    } else if (this.ua.includes('safari')) {
      this.data.browser = 'safari'
    } else if (this.ua.includes('msie') || this.ua.includes('trident')) {
      this.data.browser = 'ie'
      alert('このブラウザは現在サポートされておりません。')
    } else {
      this.data.browser = ''
    }

    if (this.data.browser) this.bodyClassList.add(this.data.browser)
  }

  private checkOs(): void {
    if (this.ua.includes('windows nt')) {
      this.data.os = 'windows'
    } else if (this.ua.includes('android')) {
      this.data.os = 'android'
    } else if (this.ua.includes('iphone') || this.ua.includes('ipad')) {
      this.data.os = 'ios'
    } else if (this.ua.includes('mac os x')) {
      this.data.os = 'macos'
    } else {
      this.data.os = ''
    }

    if (this.data.os) this.bodyClassList.add(this.data.os)
  }

  private checkDevice(): void {
    if (this.ua.includes('iphone') || (this.ua.includes('android') && this.ua.includes('mobile'))) {
      this.data.device = 'mobile'
    } else if (this.ua.includes('ipad') || this.ua.includes('android')) {
      this.data.device = 'tablet'
    } else if (
      this.ua.includes('ipad') ||
      (this.ua.includes('macintosh') && 'ontouchend' in document)
    ) {
      this.data.device = 'tablet'
    } else {
      this.data.device = 'pc'
    }

    if (this.data.device) this.bodyClassList.add(this.data.device)
  }

  private checkiPhone(): void {
    if (this.ua.includes('iphone')) {
      this.data.iphone = 'iphone'
    } else {
      this.data.iphone = ''
    }

    if (this.data.iphone) this.bodyClassList.add(this.data.iphone)
  }

  public getData(): UserAgentData {
    return this.data
  }
}
