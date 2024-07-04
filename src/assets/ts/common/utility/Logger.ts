

export default class Logger {
  private static isEnabled: boolean = true

  public static enable() {
    Logger.isEnabled = true
  }

  public static disable() {
    Logger.isEnabled = false
  }

  public static log(...args: any[]) {
    if (Logger.isEnabled) {
      console.log(...args)
    }
  }

  public static warn(...args: any[]) {
    if (Logger.isEnabled) {
      console.warn(...args)
    }
  }

  public static error(...args: any[]) {
    if (Logger.isEnabled) {
      console.error(...args)
    }
  }
}
