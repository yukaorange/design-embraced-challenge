// import each from 'lodash/each';
import normalizeWheel from 'normalize-wheel'

import Logger from '@ts/common/utility/Logger'

import Assets from '@ts/common/singleton/Assets'
import InteractionState from '@ts/common/singleton/InteractionState'
import MetaManager from '@ts/common/utility/MetaManager'
import BreakpointsObserver from '@ts/common/utility/BreakpointsObserver'
import UserAgent from '@ts/common/utility/UserAgent'
import Preloader, { Loader, Animator } from '@ts/common/layout/Preloader'
import ViewportCalculator from '@ts/common/utility/ViewportCalculator'
import DrawerNavigation, {
  DrawerMenu,
  DrawerButton
} from '@ts/common/layout/DrawerNavigation'
import Header, {
  HeaderScrollObserver,
  HeaderHeightCalculator
} from '@ts/common/layout/Header'
import Transition from '@ts/common/ui/Transition'
import Canvas, { TCanvas } from '@ts/webgl/index'

import Home from '@ts/pages/Home/Home'
// import About from '@ts/pages/about/About'
// import Page3 from './pages/Page3/Page3';

class App {
  //information
  private device: string
  private content: HTMLElement
  private template: string | null
  private userAgent: UserAgent | null

  //observer
  private viewportCalculator: ViewportCalculator | null
  private breakpointsObserver: BreakpointsObserver | null

  //singleton
  private interactionState: InteractionState
  private assets: Assets

  //webgl experience
  private canvas: Canvas | null

  //UI layout
  private preloader: Preloader | null
  private drawerNavigation: DrawerNavigation | null
  private header: Header | null
  private pages: { [key: string]: any }
  private page: any
  private transition: Transition | null

  //loop
  private frame: any | null = null

  constructor() {
    Logger.enable() //enable or disable

    //information
    this.content = document.querySelector('[data-ui="content"]') as HTMLElement
    this.device = ''
    this.template = ''
    this.userAgent = null

    //observer
    this.breakpointsObserver = null
    this.viewportCalculator = null

    //layout
    this.preloader = null
    this.drawerNavigation = null
    this.header = null
    this.pages = {}
    this.page = null
    this.transition = null

    //singleton
    this.assets = Assets.getInstance()
    this.interactionState = InteractionState.getInstance()

    //webgl experience
    this.canvas = null

    //information provider
    this.identifyTemplate()
    this.createUserAgentInformer()
    this.createBreakPointObserver()
    this.createViewportCalculator()

    //init layout parts
    this.createPreloader()
    this.createDrawerNavigation()
    this.createHeader()
    this.createPages()

    //webgl experience
    this.createCanvas()

    //page transition
    this.createTransition()

    //add listeners
    this.addEventListeners()

    //app start
    this.start()
  }

  private identifyTemplate() {
    this.template = this.content.getAttribute('data-template') as string

    Logger.log(
      `from App.ts / template: ${this.template} | content: ${this.content}`
    )
  }

  private createUserAgentInformer() {
    this.userAgent = new UserAgent({
      body: document.body
    })

    Logger.log(`from App.ts / this.userAgent: ${this.userAgent}`)
  }

  private createBreakPointObserver() {
    const indicator = document.querySelector(
      '[data-ui="indicator"]'
    ) as HTMLElement

    const breakpoints = {
      sp: 868
    }

    this.breakpointsObserver = new BreakpointsObserver(breakpoints, indicator)

    this.device = this.breakpointsObserver.getCurrentDevice() as string
  }

  private createPreloader() {
    const loader = new Loader()
    const animator = new Animator()

    this.preloader = new Preloader(loader, animator)
  }

  private createDrawerNavigation() {
    const button = new DrawerButton()
    const menu = new DrawerMenu()

    this.drawerNavigation = new DrawerNavigation(button, menu)
  }

  private createHeader() {
    const headerScrollObserver = new HeaderScrollObserver()
    const headerHeightCalculator = new HeaderHeightCalculator()

    this.header = new Header(headerScrollObserver, headerHeightCalculator)

    this.header.onResize()
  }

  private createCanvas() {
    this.canvas = new Canvas({
      template: this.template,
      dom: document.querySelector('#webgl'),
      device: this.device
    } as TCanvas)
  }

  private createViewportCalculator() {
    this.viewportCalculator = new ViewportCalculator()

    this.viewportCalculator.onResize()
  }

  private createPages() {
    this.pages = {
      home: new Home({ device: this.device })
    }

    this.page = this.pages[this.template ?? '']

    this.page.create()
  }

  // Listeners
  private addEventListeners() {
    window.addEventListener('resize', () => {
      this.onResize()
    })
  }

  /**
   * events
   */

  private onResize() {
    this.breakpointsObserver?.resize()

    this.device = this.breakpointsObserver?.getCurrentDevice() as string

    this.viewportCalculator?.onResize()

    this.page.onResize({ device: this.device })

    this.canvas?.onResize({ device: this.device })

    Logger.log(`from App.ts / resized`)
  }

  /**
   * page transition
   */
  private createTransition() {
    this.transition = new Transition(this.pages, this.page)
  }

  /**
   * init
   */
  private start() {
    this.transition?.init()

    this.preloader?.startLoading()

    this.page.set()

    this.preloader?.once('loaded', async () => {
      await this.preloader?.hideAnimation()

      this.update()

      this.page.show()

      this.preloader?.destroy()

      this.onResize()

      Logger.log('from App.ts / page started')
    })
  }

  /**
   * update
   */
  private update() {
    this.canvas?.update({})

    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }
}

window.addEventListener('load', () => {
  new App()
})
