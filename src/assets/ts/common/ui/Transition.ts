import Barba from '@barba/core'
import barbaPrefetch from '@barba/prefetch'

import Logger from '@ts/common/utility/Logger'
import MetaManager from '@ts/common/utility/MetaManager'

export default class Transition {
  private pages: { [key: string]: any }
  private page: any

  constructor(pages: { [key: string]: any }, currentPage: any) {
    this.pages = pages
    this.page = currentPage
  }

  public init() {
    Barba.use(barbaPrefetch)

    Barba.init({
      transitions: [
        {
          name: 'default-transition',
          once: () => {},
          beforeLeave: () => {
            Logger.log(`from Transition.ts / page hide`)

            return this.page.hide()
          },
          leave: () => {
            Logger.log(`from Transition.ts / page destroy`)

            return this.page.destroy()
          },
          enter: data => {
            Logger.log(`from Transition.ts / page enter`)

            const parser = new DOMParser()

            const doc = parser.parseFromString(data.next.html, 'text/html')

            const metaManager = new MetaManager(doc)

            const template = data.next.container.getAttribute('data-template')

            this.page = this.pages[template ?? '']

            this.page.create()

            console.log(this.page)

            metaManager.updateMetaTags()

            return this.page.set()
          },
          afterEnter: () => {
            return this.page.show()
          }
        }
      ],
      views: [],
      debug: true
    })

    Barba.hooks.after(() => {
      this.trackPageView(location.pathname)
    })
  }

  private trackPageView(url: string) {
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: location.href,
        page_path: location.pathname
      })
    } else if (typeof ga === 'function') {
      ga('send', 'pageview', url)
    } else {
      Logger.log(`from Transition.ts / Google Analytics not initialized`)
    }
  }
}
