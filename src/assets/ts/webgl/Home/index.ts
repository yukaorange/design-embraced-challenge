import map from 'lodash/map'
import GSAP from 'gsap'
import Logger from '@ts/common/utility/Logger'

import * as THREE from 'three'

import Plane, { TOption } from '@ts/webgl/Home/Plane'

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

  private plane: Plane | null = null

  private x: {
    current: number
    target: number
    lerp: number
  }

  private y: {
    current: number
    target: number
    lerp: number
  }

  private scrollCurrent: {
    x: number
    y: number
  }

  private scroll: {
    x: number
    y: number
  }

  private speed: {
    current: number
    target: number
    lerp: number
  }

  constructor({ scene, sizes, device }: TPage) {
    this.scene = scene

    this.sizes = sizes

    this.device = device

    this.x = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    //scrollCurrent is necessary to memolize touchstart position.
    this.scrollCurrent = {
      x: 0,
      y: 0
    }

    this.scroll = {
      x: 0,
      y: 0
    }

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.createPlane()

    if (this.plane) {
      this.scene.add(this.plane.getMesh())
    }

    this.show()

    Logger.log(`from Webgl Home.ts create ${this.plane?.getMesh()}`)
  }

  private createPlane() {
    this.plane = new Plane({
      sizes: this.sizes,
      device: this.device
    })
  }

  /**
   * animate
   */

  public show() {
    this.plane?.show()
  }

  public hide() {
    this.plane?.hide()
  }

  /**
   * events
   */
  public onResize(values: TOption) {
    this.plane?.onResize(values)
  }

  /**
   * update
   */
  public update(params: any) {
    this.plane?.update()
  }

  /**
   * destroy
   */
  public destroy() {
    this.plane && this.scene.remove(this.plane.getMesh())
  }
}
