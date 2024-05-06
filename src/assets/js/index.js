import each from 'lodash/each'
import normalizeWheel from 'normalize-wheel'
import Barba from '@barba/core'

import BreakpointsObserver from '@js/class/BreakpointsObserver'
import Assets from '@js/class/Assets'
import viewPortSetter from '@js/class/SetViewport'
import MetaManager from '@js//class/MetaManager'

import Canvas from '@js/webgl'

import Preloader from '@js/component/Preloader'
import DrawerNavigation from '@js/component/DrawerNavigation'

import Home from '@js/pages/Home/Home'

class App {
  constructor() {
    this.createAssets()

    this.createSetViewPort()

    this.createBreakPoint()

    this.createContent()

    this.createPreloader()

    this.createCanvas()

    this.createNavigation()

    this.createPages()

    this.initBarba()

    this.addEventListeners()

    this.update()

    this.onResize()
  }

  createAssets() {
    this.assets = new Assets()
  }

  createSetViewPort() {
    this.viewPortSetter = new viewPortSetter()
  }

  createBreakPoint() {
    this.breakPoint = new BreakpointsObserver()

    this.device = this.breakPoint.currentDevice

    this.currentWidth = window.innerWidth
  }

  createContent() {
    this.content = document.querySelector('.content')

    this.template = this.content.getAttribute('data-template')
  }

  createCanvas() {
    this.canvas = new Canvas({
      template: this.template,
      dom: document.querySelector('#webgl'),
      device: this.device,
      assets: this.assets
    })
  }

  createPreloader() {
    this.preloader = new Preloader({
      assets: this.assets
    })

    this.preloader.once('completed', () => {
      this.onPreloaded()
    })
  }

  /**
   * app starts to create  webgl experience and show page.
   */
  async onPreloaded() {
    this.onResize()

    this.canvas.onPreloaded()

    await this.preloader.hide()

    await this.page.show()

    this.preloader.destroy()
  }

  createNavigation() {
    this.navigation = new DrawerNavigation()
  }

  createPages() {
    this.pages = {
      home: new Home()
    }

    this.page = this.pages[this.template]

    this.page.create()
  }

  // Listeners
  addEventListeners() {
    window.addEventListener('popstate', event => {
      this.onPopState(event)
    })

    window.addEventListener('mousedown', event => {
      this.onTouchDown(event)
    })

    window.addEventListener('mousemove', event => {
      this.onTouchMove(event)
    })

    window.addEventListener('mouseup', event => {
      this.onTouchUp(event)
    })

    window.addEventListener('touchstart', event => {
      this.onTouchDown(event)
    })

    window.addEventListener('touchmove', event => {
      this.onTouchMove(event)
    })

    window.addEventListener('touchend', event => {
      this.onTouchUp(event)
    })

    window.addEventListener('wheel', event => {
      this.onWheel(event)
    })

    window.addEventListener('resize', event => {
      this.onResize(event)
    })
  }

  /**
   * events
   */

  onResize() {
    this.device = this.breakPoint.currentDevice

    if (this.page && this.page.onResize) {
      this.page.onResize()
    }

    setTimeout(() => {
      const newWidth = window.innerWidth

      const widthDifference = Math.abs(this.currentWidth - newWidth)

      if (widthDifference <= 0.1) {
        this.resizeFlag = false
      } else {
        this.resizeFlag = true
        console.log('resize')
      }

      this.currentWidth = newWidth
    }, 10)

    if (this.canvas && this.canvas.onResize && this.resizeFlag === true) {
      this.canvas.onResize(this.device)
    }
  }

  onTouchDown(event) {
    if (this.canvas && this.canvas.onTouchDown) {
      this.canvas.onTouchDown(event)
    }
  }

  onTouchMove(event) {
    if (this.page && this.canvas.onTouchMove) {
      this.canvas.onTouchMove(event)
    }
  }

  onTouchUp(event) {
    if (this.canvas && this.canvas.onTouchUp) {
      this.canvas.onTouchUp(event)
    }
  }

  onWheel(event) {
    const normalizedWheel = normalizeWheel(event)

    if (this.canvas && this.canvas.update) {
      this.canvas.onWheel(normalizedWheel)
    }

    if (this.page && this.page.update) {
      this.page.onWheel(normalizedWheel)
    }
  }

  /**
   * page transition
   */
  initBarba() {
    Barba.init({
      transitions: [
        {
          name: 'default-transition',
          once: () => {
            this.trackPageView(location.pathname)
          },
          leave: async () => {
            await this.page.hide()

            this.canvas.onChangeStart(this.template)
          },
          enter: async data => {
            /**
             * 下記の不備を検知すると、遷移前のページにリダイレクトされます。
             * ・遷移先のページを用意していない。
             * ・遷移先が同じページの場合。
             * ・遷移先のページでJavaScriptエラーが発生した場合。
             * */

            const parser = new DOMParser()

            const doc = parser.parseFromString(data.next.html, 'text/html')

            const metaManager = new MetaManager(doc)

            this.template = data.next.container.getAttribute('data-template')

            this.canvas.onChangeEnd(this.template)

            this.page = this.pages[this.template]

            this.page.create()

            metaManager.updateMetaTags()

            await this.page.show()

            this.trackPageView(location.pathname)
          }
        }
      ],
      views: [],
      prefetch: true
    })
  }

  /**
   * Google Analytics
   */
  trackPageView(url) {
    if (typeof gtag === 'function') {
      gtag('config', 'YOUR_GA_TRACKING_ID', { page_path: url })
    } else if (typeof ga === 'function') {
      ga('send', 'pageview', url)
    } else {
      console.log('Google Analytics not initialized')
    }
  }

  /**
   * update
   */
  update() {
    if (this.page && this.page.update) {
      this.page.update()
    }

    if (this.canvas && this.canvas.update) {
      this.canvas.update(this.page.scroll)
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }
}

new App()
