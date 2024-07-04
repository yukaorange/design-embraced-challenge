import GSAP from 'gsap'

import * as THREE from 'three'

import Assets from '@ts/common/singleton/Assets'

import vertexShader from '@ts/webgl/shaders/vertex.glsl'
import fragmentShader from '@ts/webgl/shaders/fragment.glsl'

export type TOption = {
  sizes: {
    width: number
    height: number
  }
  device: string
}

export default class Plane {
  private sizes: {
    width: number
    height: number
  }

  private device: string

  private geometry: THREE.PlaneGeometry | null = null

  private material: THREE.ShaderMaterial | null = null

  private mesh: THREE.Mesh | null = null

  private assets = Assets.getInstance()

  private textures: {} | null = null

  constructor({ sizes, device }: TOption) {
    this.sizes = sizes

    this.device = device

    this.createTexture()

    this.createGeometry()

    this.createMaterial()

    this.createMesh()

    this.calculateBounds({
      sizes: this.sizes,
      device: this.device
    })
  }

  private createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
  }

  private createTexture() {
    this.textures = this.assets.getTextures()
  }

  private createMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        // uTexture: { value: this.texture },
        uAlpha: { value: 0 }
      }
    })
  }

  private createMesh() {
    this.mesh = new THREE.Mesh(
      this.geometry as THREE.PlaneGeometry,
      this.material as THREE.ShaderMaterial
    )
  }

  public getMesh() {
    return this.mesh as THREE.Mesh
  }

  private calculateBounds(values: TOption) {
    const { sizes, device } = values

    this.sizes = sizes

    this.device = device

    this.updateScale()

    this.updateX()

    this.updateY()
  }

  /**
   * Animations
   */
  public show() {
    GSAP.fromTo(
      (this.mesh?.material as THREE.ShaderMaterial).uniforms.uAlpha,
      {
        value: 0
      },
      {
        value: 1
      }
    )
  }

  public hide() {
    GSAP.to((this.mesh?.material as THREE.ShaderMaterial).uniforms.uAlpha, {
      value: 0
    })
  }
  /**
   * events
   */
  onResize(values: TOption) {
    this.calculateBounds(values)
  }

  /**
   * update
   */

  updateScale() {}

  updateX(x = 0) {}

  updateY(y = 0) {}

  update() {}
}
