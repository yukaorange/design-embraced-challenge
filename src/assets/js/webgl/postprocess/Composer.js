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

    this.createPass()
  }

  createPass() {
    this.composer.addPass(this.renderPass)
  }
}
