interface BreakPoints {
  sp: number
}

export default class BreakpointsObserver {
  private currentDevice: string = ''
  private breakpoints: BreakPoints
  private body: HTMLElement
  private indicator: HTMLElement | null = null

  constructor(breakpoints: BreakPoints, indicator: HTMLElement) {
    this.breakpoints = breakpoints

    this.body = document.querySelector('body') as HTMLElement

    this.init()
  }

  private detectViewport(viewPortWidth: number) {
    this.body.dataset.viewport = this.determineDeviceType(viewPortWidth)

    this.currentDevice = this.determineDeviceType(viewPortWidth)
  }

  private determineDeviceType(width: number) {
    if (width <= this.breakpoints.sp) {
      return 'sp'
    } else {
      return 'pc'
    }
  }

  private init() {
    const viewPortWidth = window.innerWidth

    this.detectViewport(viewPortWidth)
  }

  public resize() {
    const viewPortWidth = window.innerWidth

    this.detectViewport(viewPortWidth)
  }

  public getCurrentDevice() {
    return this.currentDevice
  }
}

/** usage

// Import the Breakpoints class
import Breakpoints from './path/to/Breakpoints';

// Create an instance of the Breakpoints class
const breakpoints = new Breakpoints();

// Define device-specific actions
const spActions = {
  add: () => console.log("Activating smartphone actions"),
  remove: () => console.log("Deactivating smartphone actions")
};

const tabletActions = {
  add: () => console.log("Activating tablet actions"),
  remove: () => console.log("Deactivating tablet actions")
};

const pcActions = {
  add: () => console.log("Activating PC actions"),
  remove: () => console.log("Deactivating PC actions")
};

// Define a devices object with the actions for each device type
const devices = {
  sp: spActions,
  tablet: tabletActions,
  pc: pcActions
};

// Start observing for device changes and execute the corresponding actions
breakpoints.observerStartBody(devices);
*/
