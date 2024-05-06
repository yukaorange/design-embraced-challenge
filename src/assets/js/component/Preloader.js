import Component from '@js/class/Component'
import each from 'lodash/each'
import GSAP from 'gsap'

import { TextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const modelPass =
  '/model/free_tesla_tequila/scene.gltf'
const envPass = '/textures/hologram-map.webp'

const dracoPass = '/draco/'

export default class Preloader extends Component {
  constructor({ assets }) {
    super({
      element: '.preloader',
      elements: {
        loading: '.preloader__loading',
        text: '.preloader__text',
        assets: '.preloader__assets'
      }
    })

    this.assets = assets

    this.length = 0

    this.createLoader()
  }

  createLoader() {
    this.images = [...this.elements.assets.querySelectorAll('img')]

    this.totalAssetsLength = this.images.length

    this.textureLoader = new TextureLoader()

    this.dracoLoader = new DRACOLoader()

    this.dracoLoader.setDecoderPath(dracoPass)

    this.gltfLoader = new GLTFLoader()

    this.gltfLoader.setDRACOLoader(this.dracoLoader)

    const modelPromise = new Promise((resolve, reject) => {
      this.gltfLoader.load(
        modelPass,
        model => {
          this.assets.models['model'] = model
          resolve()
        },
        undefined,
        error => {
          reject(error)
        }
      )
    })

    const envPromise = new Promise((resolve, reject) => {
      this.textureLoader.load(
        envPass,
        texture => {
          this.assets.envTextures['env'] = texture
          resolve()
        },
        undefined,
        error => {
          reject(error)
        }
      )
    })

    const imagePromises = this.images.map(imageDOM => {
      return new Promise((resolve, reject) => {
        const image = new Image()

        const id = imageDOM.getAttribute('data-id')

        image.crossOrigin = 'anonymous'

        image.src = imageDOM.getAttribute('data-src')

        image.onload = () => {
          const texture = this.textureLoader.load(image.src)

          texture.needsUpdate = true

          this.assets.textures[id] = texture

          this.onAssetLoaded()

          resolve()
        }

        image.onerror = error => {
          reject(error)
        }
      })
    })

    Promise.all([modelPromise, ...imagePromises, envPromise]).then(() => {
      this.onLoaded()
    })
  }

  onAssetLoaded() {
    this.length += 1

    const percent = this.length / this.totalAssetsLength

    this.elements.text.innerHTML = `${Math.round(percent * 100)}%`
  }

  onLoaded() {
    this.emit('completed')
  }

  async hide() {
    return new Promise(resolve => {
      GSAP.to(this.element, {
        autoAlpha: 0,
        duration: 1,
        ease: 'expo.out',
        onComplete: () => {
          resolve()
        }
      })
    })
  }

  /**
   * destroy
   */

  destroy() {
    this.element.parentNode.removeChild(this.element)
  }
}
