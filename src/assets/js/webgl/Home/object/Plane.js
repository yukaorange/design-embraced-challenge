import GSAP from 'gsap'

import { ShaderMaterial, Mesh } from 'three'
import * as THREE from 'three'

import vertex from '@js/shaders/vertex.glsl'
import fragment from '@js/shaders/fragment.glsl'

export default class Plane {
  constructor({ sizes, device, assets }) {
    this.sizes = sizes

    this.device = device

    this.assets = assets

    this.createTexture()

    this.cretateGeometry()

    this.createMaterial()

    this.createMesh()

    this.calculateBounds({
      sizes: this.sizes,
      device: this.device
    })

    this.updateScale(this.device)
  }

  createTexture() {
    // this.texture = this.assets.textures[0]
  }

  cretateGeometry() {
    this.geometry = new THREE.PlaneGeometry(2, 2, 32, 32)
  }

  createMaterial() {
    this.material = new ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      uniforms: {
        // uTexture: { value: this.texture },
        uAlpha: { value: 0 },
        uTime: { value: 0 }
      }
    })
  }

  createMesh() {
    this.mesh = new Mesh(this.geometry, this.material)
  }

  calculateBounds({ sizes, device }) {
    this.sizes = sizes

    this.device = device

    this.updateX()

    this.updateY()
  }

  /**
   * Animations
   */
  show() {
    GSAP.fromTo(
      this.mesh.material.uniforms.uAlpha,
      {
        value: 0
      },
      {
        value: 1
      }
    )
  }

  hide() {
    GSAP.to(this.mesh.material.uniforms.uAlpha, {
      value: 0
    })
  }
  /**
   * events
   */
  onResize(value) {
    this.calculateBounds(value)

    this.updateScale(this.device)
  }

  /**
   * update
   */

  updateScale() {
    // console.log('plane device : ', this.device)
    //  if (this.device === 'sp') {
    //    this.mesh.scale.x = this.sizes.width / 2
    //    this.mesh.scale.y = this.sizes.width / 2
    //   } else {
    //     this.mesh.scale.x = this.sizes.height / 2
    //     this.mesh.scale.y = this.sizes.height / 2
    //   }
  }

  updateX(x = 0) {}

  updateY(y = 0) {}

  update({ scroll, time, params, flag }) {
    this.updateX(scroll.x)

    this.updateY(scroll.y)

    // this.mesh.rotation.y += time.delta

    this.material.uniforms.uTime.value = time.current

    this.mesh.material.uniforms.uAlpha.value = params.alpha
  }
}
