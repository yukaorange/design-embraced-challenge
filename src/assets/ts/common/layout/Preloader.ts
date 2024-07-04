import Component from '@ts/abstract/Component'
import GSAP from 'gsap'
import * as THREE from 'three'

import Assets from '@ts/common/singleton/Assets'

import Logger from '@ts/common/utility/Logger'

/**
 * Loader
 */
type TLoader = {
  loadAssets: (assets: HTMLImageElement[], indicator: HTMLElement) => Promise<void>
  // onAssetLoaded: (indicator: HTMLElement) => void
}

export class Loader implements TLoader {
  private textureLoader: THREE.TextureLoader
  private globalAssets: Assets
  private totalLength: number
  private length: number
  private textures: { [key: number]: THREE.Texture }

  constructor() {
    this.globalAssets = Assets.getInstance()

    this.totalLength = 0

    this.length = 0

    this.textures = {}

    this.textureLoader = new THREE.TextureLoader()
  }

  public async loadAssets(assets: any[], indicator: HTMLElement): Promise<void> {
    return new Promise((resolve, reject) => {
      this.totalLength = assets.length

      assets.forEach((imageDom) => {
        const image = new Image()

        const id = imageDom.getAttribute('data-id')

        image.crossOrigin = 'anonymous'

        image.src = imageDom.getAttribute('data-src')

        image.onload = () => {
          const texture = this.textureLoader.load(image.src)

          texture.needsUpdate = true

          this.textures[id] = texture

          Logger.log(`from Preloader.ts / loaded $id:${id} | texture ${texture}`)

          this.onAssetLoaded(indicator, resolve)
        }

        image.onerror = (e) => {
          Logger.error(`from Preloader.ts / failed to load ${image.src}`)

          reject(e)
        }
      })
    })
  }

  private onAssetLoaded(indicator: HTMLElement, resolve: () => void) {
    this.length += 1

    const percent = this.length / this.totalLength

    this.countUp(indicator, percent * 100)

    if (this.length === this.totalLength) {
      this.onLoaded(resolve)
    }
  }

  private countUp(indicator: HTMLElement, percent: number) {
    const hundred = indicator.querySelector(
      '[data-ui="preloader-count-digit-hundred"]'
    ) as HTMLElement

    const ten = indicator.querySelector('[data-ui="preloader-count-digit-ten"]') as HTMLElement

    const one = indicator.querySelector('[data-ui="preloader-count-digit-one"]') as HTMLElement

    let hundreds: number = Math.floor((percent / 100) % 100)

    let tens: number = Math.floor((percent / 10) % 10)

    let ones: number = Math.floor(percent % 10)

    hundred.style.setProperty('--progress', hundreds.toString())

    ten.style.setProperty('--progress', tens.toString())

    one.style.setProperty('--progress', ones.toString())
  }

  private onLoaded(resolve: () => void) {
    this.globalAssets.setTextures(this.textures)

    Logger.log(`from Preloader.ts / assets ${this.totalLength} assets loaded`)

    resolve()
  }
}

/**
 * animatior
 */

type TAnimator = {
  hideAnimation: (elements: any, resolve: () => void) => Promise<void>
}

export class Animator implements TAnimator {
  public async hideAnimation(elements: any, resolve: () => void): Promise<void> {
    GSAP.to(elements, {
      autoAlpha: 0,
      duration: 1,
      ease: 'power2.out',
      onUpdate: function () {
        const progress = this.progress()

        if (progress > 0.8) {
          // this logic makes me can modify animation finally.

          resolve()
        }
      },
      // onComplete: () => {
      //   resolve()
      // },
    })
  }
}

export default class Preloader extends Component {
  private loader: TLoader
  private animator: TAnimator

  constructor(loader: TLoader, animator: TAnimator) {
    super({
      element: '[data-ui="preloader"]',
      elements: {
        count: '[data-ui="preloader-count"]',
        assets: '[data-ui="preloader-assets"]',
      },
    })

    Logger.log(
      `from Preloader.ts / this.element: ${this.element} | this.elements: ${this.elements}`
    )

    this.loader = loader

    this.animator = animator
  }

  public async startLoading() {
    const assets = [...this.elements.assets.querySelectorAll('img')]

    const indicator = this.elements.count as HTMLElement

    await this.loader.loadAssets(assets, indicator)

    this.emit('loaded')
  }

  public async hideAnimation() {
    return new Promise<void>((resolve) => {
      const element = this.element

      this.animator.hideAnimation(element, resolve)
    })
  }

  destroy() {
    this.element.parentNode.removeChild(this.element)

    Logger.log('from Preloader.ts / preloader destroyed')
  }
}
