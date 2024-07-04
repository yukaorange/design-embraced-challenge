export default class Assets {
  private static instance: Assets
  private textures: {}
  private envTextures: {}
  private models: {}

  private constructor() {
    this.textures = {}
    this.envTextures = {}
    this.models = {}
  }

  public static getInstance(): Assets {
    if (!Assets.instance) {
      Assets.instance = new Assets()
    }
    return Assets.instance
  }

  public getTextures() {
    return this.textures
  }

  public getEnvTextures() {
    return this.envTextures
  }

  public getModels() {
    return this.models
  }

  public setTextures(textures: {}) {
    this.textures = textures
  }

  public setEnvTextures(envTextures: {}) {
    this.envTextures = envTextures
  }

  public setModels(models: {}) {
    this.models = models
  }
}
