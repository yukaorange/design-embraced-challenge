import GSAP from 'gsap'
import * as THREE from 'three'

import { Pane } from 'tweakpane'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Home from '@ts/webgl/Home'

export type TCanvas = {
  template: string
  dom: HTMLElement
  device: string
}

export type TSizes = {
  height: number
  width: number
}

export default class Canvas {
  //config
  private template: string
  private device: string

  //container
  private container: HTMLElement

  //parameters
  private sizes: TSizes
  private x: { start: number; end: number }
  private y: { start: number; end: number }
  private isTouchDown: boolean = false

  //pages
  private home: Home | null = null

  //three.js objects
  private renderer: THREE.WebGLRenderer | null
  private scene: THREE.Scene | null
  private camera: THREE.PerspectiveCamera | null
  private controls: OrbitControls | null
  private pane: Pane | null
  private paneParams: { [key: string]: any } | null = null

  constructor({ template, dom, device }: TCanvas) {
    //config
    this.template = template
    this.device = device

    //container
    this.container = dom

    //three.js objects
    this.renderer = null
    this.scene = null
    this.camera = null
    this.controls = null
    this.pane = null

    //parameter
    this.sizes = {
      height: 0,
      width: 0
    }

    this.x = {
      start: 0,
      end: 0
    }

    this.y = {
      start: 0,
      end: 0
    }

    //create objects
    this.createRenderer()

    this.createScene()

    this.createCamera()

    this.createPane()

    this.createControls()

    this.createHome()
  }

  private createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })

    this.renderer.setClearColor(0x000000, 0)

    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.container.appendChild(this.renderer.domElement)
  }

  private createScene() {
    this.scene = new THREE.Scene()
  }

  private createCamera() {
    const fov = 45
    const aspect = window.innerWidth / window.innerHeight
    const near = 0.1
    const far = 1000

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

    this.camera.position.z = 5
  }

  private createPane() {
    this.pane = new Pane()

    this.paneParams = {
      alpha: 1
    }

    this.pane.addBinding(this.paneParams, 'alpha', {
      min: 0,
      max: 1,
      step: 0.01
    })
  }

  private createControls() {
    this.controls = new OrbitControls(
      this.camera as THREE.PerspectiveCamera,
      this.renderer?.domElement as HTMLElement
    )
  }

  /**home */
  private createHome() {
    this.home = new Home({
      scene: this.scene as THREE.Scene,
      sizes: this.sizes as TSizes,
      device: this.device as string
    })
  }

  public destroyHome() {
    this.home?.destroy()
  }

  /**
   * events
   */

  public onPreloaded() {
    this.onChangeEnd(this.template)
  }

  public onChangeStart(template: string) {
    this.template = template
  }

  public onChangeEnd(template: string) {}

  public onResize({ device }: { device: string }) {
    this.device = device

    this.updateScale()

    const params = {
      sizes: this.sizes,
      device: this.device
    }

    this.home?.onResize(params)
  }

  private updateScale() {
    this.renderer?.setSize(window.innerWidth, window.innerHeight) //expand canvas to full screen.

    const aspect: number = window.innerWidth / window.innerHeight

    const fov: number = this.camera ? this.camera?.fov * (Math.PI / 180) : 0 // default camera.fov = 45deg. result fov is in radians. (1/4 PI rad)

    const height: number = this.camera
      ? 2 * Math.tan(fov / 2) * this.camera?.position.z
      : 0 //z = 5 is setted at this.createCamera

    const width: number = height * aspect //viewport size in screen.

    this.sizes = {
      //Calclated viewport space sizes.
      height: height,
      width: width
    }

    if (this.camera) {
      this.camera.aspect = aspect

      this.camera.updateProjectionMatrix()
    }
  }

  public onTouchDown(event: TouchEvent | MouseEvent) {
    this.isTouchDown = true

    this.x.start = 'touches' in event ? event.touches[0].clientX : event.clientX
    this.y.start = 'touches' in event ? event.touches[0].clientY : event.clientY

    const positions = {
      x: this.x,
      y: this.y
    }
  }

  public onTouchMove(event: TouchEvent | MouseEvent) {
    if (!this.isTouchDown) return

    const x = 'touches' in event ? event.touches[0].clientX : event.clientX
    const y = 'touches' in event ? event.touches[0].clientY : event.clientY

    this.x.end = x
    this.y.end = y

    const positions = {
      x: this.x,
      y: this.y
    }
  }

  /**loop */

  public update(params: any) {
    this.home?.update(params)

    this.renderer?.render(
      this.scene as THREE.Scene,
      this.camera as THREE.Camera
    )
  }
}
