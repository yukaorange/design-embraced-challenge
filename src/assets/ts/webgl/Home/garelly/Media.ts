import GSAP from 'gsap'

import * as THREE from 'three'

import DebugPane from '@ts/common/singleton/Pane'

import Assets from '@ts/common/singleton/Assets'

import vertexShader from '@ts/webgl/shaders/vertex.glsl'
import fragmentShader from '@ts/webgl/shaders/fragment.glsl'
import InteractionState from '@ts/common/singleton/InteractionState'

export type T_Media = {
  sizes: {
    width: number
    height: number
  }
  element: HTMLElement
  totalLength: number
  scene: THREE.Scene
  device: string
  id: number
}

type T_Option = {
  sizes: {
    width: number
    height: number
  }
  device: string
}

export class Media {
  private element: HTMLElement
  private id: number
  private sizes: {
    width: number
    height: number
  }
  private scene: THREE.Scene
  private device: string
  private pane: DebugPane | null = null
  private geometry: THREE.PlaneGeometry | null = null
  private material: THREE.ShaderMaterial | null = null
  private mesh: THREE.Mesh | null = null
  private assets = Assets.getInstance()
  private textures: { [key: number]: THREE.Texture } | null = null
  private texture: THREE.Texture | null = null
  private textureAspect: number | undefined
  private polygonAspect: number = 0
  private bounds: DOMRect | null = null
  private height: number = 0
  private width: number = 0
  private totalLength: number = 0
  private totalHeight: number = 0
  private offset: number = 2
  private offsetHeight: number = 0
  private x: number = 0
  private y: number = 0

  private mousePosition: { x: number; y: number } = { x: 0, y: 0 }

  constructor(params: T_Media) {
    const { sizes, device, scene, element, id, totalLength } = params

    this.element = element
    this.id = id
    this.totalLength = totalLength
    this.sizes = sizes
    this.device = device
    this.scene = scene

    this.totalHeight = this.sizes.height * this.totalLength

    this.offsetHeight = this.sizes.height * this.offset

    this.createTexture()

    this.createGeometry()

    this.createMaterial()

    this.createMesh()

    this.addMesh()

    this.createPane()

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

    this.texture = this.textures[this.id + 1]

    this.textureAspect = this.texture?.image.width / this.texture?.image.height
  }

  private createMaterial() {
    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTexture: { value: this.texture ? this.texture : null },
        uTextureAspect: {
          value: this.textureAspect
        },
        uPolygonAspect: {
          value: 0
        },
        uResolution: {
          value: {
            x: this.sizes.width,
            y: this.sizes.height
          }
        },
        uAlpha: { value: 0 },
        uOpacity: {
          value: 0
        },
        uSize: {
          value: 0
        },
        uCurlSize: {
          value: 5.0
        },
        uId: {
          value: this.id
        },
        uBulge: {
          value: this.id
        },
        uBulgeRadius: {
          value: this.id
        },
        uProgress: {
          value: 0
        },
        uMouse: {
          value: { x: 0, y: 0 }
        },
        uTest: {
          value: 0
        }
      }
    })
  }

  private createMesh() {
    this.mesh = new THREE.Mesh(
      this.geometry as THREE.PlaneGeometry,
      this.material as THREE.ShaderMaterial
    )
  }

  private addMesh() {
    this.scene.add(this.mesh as THREE.Mesh)
  }

  private createPane() {
    this.pane = DebugPane.getInstance()
  }

  private calculateBounds(values: T_Option) {
    const { sizes, device } = values

    this.bounds = this.element.getBoundingClientRect() ?? 0

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
    const timeline = GSAP.timeline()

    if (this.mesh === null) return

    const material = this.mesh?.material as THREE.ShaderMaterial

    timeline.set(material.uniforms.uAlpha, {
      value: 0
    })

    timeline.to(material.uniforms.uAlpha, {
      delay: 0.8,
      value: 1
    })
  }

  public hide() {
    GSAP.to((this.mesh?.material as THREE.ShaderMaterial).uniforms.uAlpha, {
      value: 0
    })
  }
  /**
   * events
   */
  public onResize(values: T_Option) {
    this.calculateBounds(values)
  }

  /**
   * update
   */

  private updateScale() {
    if (!this.bounds) return

    this.height = this.bounds.height / window.innerHeight
    this.width = this.bounds.width / window.innerWidth

    if (!this.mesh) return

    this.mesh.scale.x = this.sizes.width * this.width ?? 0
    this.mesh.scale.y = this.sizes.height * this.height ?? 0

    this.polygonAspect = this.mesh.scale.x / this.mesh.scale.y

    const material = this.mesh.material as THREE.ShaderMaterial

    material.uniforms.uPolygonAspect.value = this.polygonAspect

    material.uniforms.uResolution.value = {
      x: this.sizes.width,
      y: this.sizes.height
    }
  }

  private updateX(x: number = 0) {}

  private updateY(y: number = 0) {
    this.y = -this.totalHeight + this.id * this.sizes.height

    if (this.mesh) {
      this.mesh.position.y = y
    }
  }

  private updateTransform(progress: number) {
    if (!this.mesh) return

    const coefficient = this.sizes.height / window.innerHeight

    const radius = this.sizes.width

    const angle = (progress * Math.PI) / 6

    const x = radius * (1 - Math.cos(angle))

    const y = (progress * this.sizes.height) / 2

    this.mesh.position.x = -x

    this.mesh.position.y = this.mesh.position.y - y

    this.mesh.rotation.z = angle

    const shaderMaterial = this.mesh.material as THREE.ShaderMaterial

    shaderMaterial.uniforms.uProgress.value = progress
  }

  private updateMaterial() {
    const shaderMaterial = this.mesh?.material as THREE.ShaderMaterial

    shaderMaterial.uniforms.uOpacity.value = this.pane?.getParams().alpha ?? 0

    shaderMaterial.uniforms.uCurlSize.value =
      this.pane?.getParams().curlSize ?? 0

    shaderMaterial.uniforms.uSize.value = this.pane?.getParams().planeSize ?? 0

    shaderMaterial.uniforms.uTest.value = this.pane?.getParams().test ?? 0

    shaderMaterial.uniforms.uBulge.value = this.pane?.getParams().bulge ?? 0

    shaderMaterial.uniforms.uBulgeRadius.value =
      this.pane?.getParams().bulgeRadius ?? 0

    shaderMaterial.uniforms.uMouse.value = this.mousePosition
  }

  public update(params: {
    y: number
    progress: number
    mousePosition: { x: number; y: number }
  }) {
    const { y, progress, mousePosition } = params

    this.mousePosition = mousePosition

    this.updateY(y)

    this.updateTransform(progress)

    this.updateMaterial()
  }
}
