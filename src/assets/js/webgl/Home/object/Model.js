import GSAP from 'gsap'

import * as THREE from 'three'

import vertex from '@js/shaders/vertex.glsl'
import fragment from '@js/shaders/fragment.glsl'

export default class Model {
  constructor({ sizes, device, assets }) {
    this.sizes = sizes

    this.device = device

    this.assets = assets

    this.createTexture()

    this.cretateGeometry()

    this.createMaterial()

    this.addMaterialToModel()

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
    this.model = this.assets.models.model.scene.children[0]

    const size = 0.075

    this.model.scale.set(size, size, size)

    const rotate = -Math.PI / 2

    this.model.rotateZ(rotate)

    this.box = new THREE.Box3().setFromObject(this.model)

    this.boundingSize = new THREE.Vector3()

    this.box.getSize(this.boundingSize)

    console.log(this.boundingSize)

    this.model.position.set(0, -this.boundingSize.y / 2, 0)
  }

  createMaterial() {
    this.material = new THREE.ShaderMaterial({
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

  addMaterialToModel() {
    // this.model.traverse(object => {
    //   if (object.isMesh) {
    //     object.material = this.material
    //   }
    // })
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
  }

  updateX(x = 0) {}

  updateY(y = 0) {}

  update({ scroll, time }) {
    this.updateX(scroll.x)

    this.updateY(scroll.y)

    this.material.uniforms.uTime.value = time.current
  }
}
