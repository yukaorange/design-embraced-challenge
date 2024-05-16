import * as THREE from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

export default class Composer {
  constructor({ renderer, scene, camera }) {
    this.renderer = renderer

    this.scene = scene

    this.camera = camera

    this.composer = new EffectComposer(this.renderer)

    this.renderPass = new RenderPass(this.scene, this.camera)

    const bloomParam = {
      exposure: 1.25,
      bloomStrength: 1,
      bloomThreshold: 0.75,
      bloomRadius: 1.25
    }

    this.unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      bloomParam.exposure,
      bloomParam.bloomStrength,
      bloomParam.bloomThreshold,
      bloomParam.bloomRadius
    )

    this.createPass()
  }

  resize({ sizes, device }) {
    this.composer.setSize(window.innerWidth, window.innerHeight)

    this.unrealBloomPass.setSize(window.innerWidth, window.innerHeight)
  }

  createPass() {
    this.composer.addPass(this.renderPass)
    // this.composer.addPass(this.unrealBloomPass)
  }
}
