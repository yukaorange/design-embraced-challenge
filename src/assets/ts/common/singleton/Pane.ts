import { Pane } from 'tweakpane'

export default class DebugPane {
  private static instance: DebugPane
  private pane: Pane
  public params: { [key: string]: any }

  private constructor() {
    this.pane = new Pane({
      expanded: false
    })

    this.params = {
      alpha: 1,
      planeSize: 1,
      curlSize: 1.8,
      bulge: 0.5,
      bulgeRadius: 0.3
    }

    this.addBindings()
  }

  public static getInstance(): DebugPane {
    if (!DebugPane.instance) {
      DebugPane.instance = new DebugPane()
    }

    return DebugPane.instance
  }

  private addBindings() {
    this.pane.addBinding(this.params, 'alpha', {
      min: 0,
      max: 1,
      step: 0.01
    })

    this.pane.addBinding(this.params, 'planeSize', {
      min: 0,
      max: 3,
      step: 0.1
    })

    this.pane.addBinding(this.params, 'curlSize', {
      min: 0,
      max: 10,
      step: 0.1
    })

    this.pane.addBinding(this.params, 'bulge', {
      min: 0,
      max: 1,
      step: 0.1
    })

    this.pane.addBinding(this.params, 'bulgeRadius', {
      min: 0,
      max: 1,
      step: 0.1
    })
  }

  public getParams() {
    return this.params
  }
}
