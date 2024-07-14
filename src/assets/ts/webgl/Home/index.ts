import map from 'lodash/map'
import GSAP from 'gsap'
import Logger from '@ts/common/utility/Logger'

import * as THREE from 'three'

import {
  GarellyManager,
  T_Option,
  T_GarellyManager
} from '@ts/webgl/Home/garelly/Garelly'

import { TSizes } from '@ts/webgl'

export type TPage = {
  scene: THREE.Scene
  sizes: TSizes
  device: string
}

export default class Home {
  private scene: THREE.Scene
  private sizes: TSizes
  private device: string

  private garellyManager: GarellyManager | null = null

  constructor({ scene, sizes, device }: TPage) {
    this.scene = scene

    this.sizes = sizes

    this.device = device

    this.createGarelly()

    this.show()
  }

  private createGarelly() {
    this.garellyManager = new GarellyManager({
      sizes: this.sizes,
      device: this.device,
      scene: this.scene
    })
  }

  /**
   * animate
   */

  public show() {
    this.garellyManager?.show()
  }

  public hide() {}

  /**
   * events
   */
  public onResize(params: T_Option) {
    this.garellyManager?.onResize(params)
  }

  /**
   * update
   */
  public update() {
    this.garellyManager?.update()
  }

  /**
   * destroy
   */
  public destroy() {}
}
