import GSAP from 'gsap'
import { PerspectiveCamera, WebGLRenderer, Scene, Clock } from 'three'
import * as THREE from 'three'

import { Pane } from 'tweakpane'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Composer from './postprocess/Composer.js'

import Home from './Home'

export default class Canvas {
  constructor({ template, dom, device, assets }) {
    this.template = template

    this.container = dom

    this.bounds = this.container.getBoundingClientRect()

    this.device = device

    this.assets = assets

    this.x = {
      start: 0,
      end: 0
    }

    this.y = {
      start: 0,
      end: 0
    }

    this.time = {
      current: 0,
      previous: 0,
      delta: 0
    }

    this.createRenderer()

    this.createScene()

    this.createLight()

    this.createCamera()

    this.createPane()

    this.createControls()

    this.createClock()

    this.createPostProcess()

    this.onResize(this.device)
  }

  createRenderer() {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: true
    })

    this.renderer.setClearColor(0x000000, 0)

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.renderer.setSize(this.bounds.width, this.bounds.height)

    this.container.appendChild(this.renderer.domElement)
  }

  createScene() {
    this.scene = new Scene()
  }

  createCamera() {
    const fov = 45
    const aspect = this.bounds.width / this.bounds.height
    const near = 0.1
    const far = 1000

    this.camera = new PerspectiveCamera(fov, aspect, near, far)

    this.camera.position.z = 5
  }

  createLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 2, 2)
    this.scene.add(light)
  }

  createPane() {
    this.pane = new Pane()

    this.controledParams = {
      alpha: 1
    }

    this.pane.addBinding(this.controledParams, 'alpha', {
      min: 0,
      max: 1,
      step: 0.01
    })

    //hide pane
    this.pane.containerElem_.style = 'display: none;'
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  createClock() {
    this.clock = new Clock()
  }

  /**home */
  createHome() {
    this.home = new Home({
      scene: this.scene,
      sizes: this.sizes,
      device: this.device,
      assets: this.assets
    })
  }

  destroyHome() {
    this.home.destroy()
  }

  /**
   * events
   */

  onPreloaded() {
    this.onChangeEnd(this.template)
  }

  onChangeStart(template) {
    if (this.template !== template && template !== 'home') {
      this.home.hide()
    }

    this.template = template
  }

  onChangeEnd(template) {
    if (template == 'home') {
      this.createHome()
    } else {
      this.destroyHome()
    }
  }

  onResize(device) {
    this.bounds = this.container.getBoundingClientRect()

    this.renderer.setSize(this.bounds.width, this.bounds.height)

    const aspect = this.bounds.width / this.bounds.height

    const fov = this.camera.fov * (Math.PI / 180) // default camera.fov = 45deg. result fov is in radians. (1/4 PI rad)

    const height = 2 * Math.tan(fov / 2) * this.camera.position.z //z = 5 is setted at this.createCamera

    const width = height * aspect //to fit screen

    // this is viewport size
    this.sizes = {
      height: height,
      width: width
    }

    if (this.home) {
      this.home.onResize({
        sizes: this.sizes,
        device: device
      })
    }

    if (this.postProcessPipeline) {
      this.postProcessPipeline.resize({
        sizes: this.sizes,
        device: device
      })
    }

    this.camera.aspect = aspect

    this.camera.updateProjectionMatrix()
  }

  onTouchDown(event) {
    this.isDown = true

    this.x.start = event.touches ? event.touches[0].clientX : event.clientX
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY

    const values = {
      x: this.x,
      y: this.y
    }

    if (this.home) {
      this.home.onTouchDown(values)
    }
  }

  onTouchMove(event) {
    if (!this.isDown) return

    const x = event.touches ? event.touches[0].clientX : event.clientX
    const y = event.touches ? event.touches[0].clientY : event.clientY

    this.x.end = x
    this.y.end = y

    const values = {
      x: this.x,
      y: this.y
    }

    if (this.about) {
      this.about.onTouchMove(values)
    }

    if (this.collections) {
      this.collections.onTouchMove(values)
    }

    if (this.detail) {
      this.detail.onTouchMove(values)
    }

    if (this.home) {
      this.home.onTouchMove(values)
    }
  }

  onTouchUp(event) {
    this.isDown = false

    const x = event.changedTouches
      ? event.changedTouches[0].clientX
      : event.clientX
    const y = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY

    this.x.end = x
    this.y.end = y

    const values = {
      x: this.x,
      y: this.y
    }

    if (this.about) {
      this.about.onTouchUp(values)
    }

    if (this.collections) {
      this.collections.onTouchUp(values)
    }

    if (this.detail) {
      this.detail.onTouchUp(values)
    }

    if (this.home) {
      this.home.onTouchUp(values)
    }
  }

  onWheel({ pixelX, pixelY }) {
    if (this.collections) {
      // if (this.transition && this.transition.isTransitioning) return;

      this.collections.onWheel({ pixelX, pixelY })
    }

    if (this.home) {
      this.home.onWheel({ pixelX, pixelY })
    }
  }

  /**
   * postprocess
   */
  createPostProcess() {
    this.postProcess = new Composer({
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera
    })
  }

  /**
   * animationFlag
   */
  updateTimeAlongAnimationFlag(time) {
    this.animationInterval = 0.01

    this.lastAnimationTime = this.lastAnimationTime || 0

    let result = time.current - this.lastAnimationTime > this.animationInterval

    if (result == true) {
      this.lastAnimationTime = time.current
    }

    this.flag = result
  }

  /**loop */

  update(scroll) {
    if (this.home) {
      this.home.update({
        scroll: scroll,
        time: this.time,
        params: this.controledParams,
        flag: this.flag
      })
    }

    this.updateTimeAlongAnimationFlag(this.time)

    this.time.delta = this.clock.getDelta()

    this.time.previous = this.time.current

    this.time.current += this.time.delta

    this.postProcess.composer.render()
  }
}
