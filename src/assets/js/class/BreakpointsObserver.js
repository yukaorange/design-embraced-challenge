export default class BreakpointsObserver {
  constructor() {
    this.currentDevice = null;

    this.breakpoints = {
      sp: 868,
    };

    this.body = document.querySelector("body");

    this.init();
  }

  detectViewport(width) {
    if (this.breakpoints.sp >= width) {
      this.body.dataset.viewport = "sp";
    } else {
      this.body.dataset.viewport = "pc";
    }

    this.currentDevice = this.body.dataset.viewport;
  }

  init() {
    const width = window.innerWidth;

    this.detectViewport(width);

    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      this.detectViewport(width);
    });
  }

  observerStartBody(devices = { sp: null, tablet: null, pc: null }) {
    this.deviceFunctionController(this.currentDevice, devices);

    const observer = new MutationObserver((elements) => {
      const target = elements[0].target;

      const viewport = target.dataset.viewport;

      if (this.currentDevice === viewport) {
        return;
      }

      this.currentDevice = viewport;

      this.deviceFunctionController(this.currentDevice, devices);
    });

    observer.observe(this.body, {
      attributes: true,
    });
  }

  deviceFunctionController(currentDevice, devices) {
    if (currentDevice === "sp") {
      devices.pc && typeof devices.pc.remove === "function"
        ? devices.pc.remove()
        : null;

      devices.tablet && typeof devices.tablet.remove === "function"
        ? devices.tablet.remove()
        : null;

      devices.sp && typeof devices.sp.add === "function"
        ? devices.sp.add()
        : null;
    }

    if (currentDevice === "tablet") {
      devices.pc && typeof devices.pc.remove === "function"
        ? devices.pc.remove()
        : null;

      devices.sp && typeof devices.sp.remove === "function"
        ? devices.sp.remove()
        : null;

      devices.tablet && typeof devices.tablet.add === "function"
        ? devices.tablet.add()
        : null;
    }

    if (currentDevice === "pc") {
      devices.sp && typeof devices.sp.remove === "function"
        ? devices.sp.remove()
        : null;

      devices.tablet && typeof devices.tablet.remove === "function"
        ? devices.tablet.remove()
        : null;

      devices.pc && typeof devices.pc.add === "function"
        ? devices.pc.add()
        : null;
    }
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
