export type TTabElements = {
  element: HTMLElement
  buttons: HTMLElement[]
  contents: HTMLElement[]
}

export type TTabElement = {
  button: HTMLElement
  content: HTMLElement
}

export default class TabChangerProvider {
  private element: HTMLElement | null = null
  private buttons: HTMLElement[] = []
  private contents: HTMLElement[] = []

  public initialize(element: HTMLElement, buttons: HTMLElement[], contents: HTMLElement[]) {
    this.element = element
    this.buttons = buttons
    this.contents = contents

    this.element!.setAttribute('role', 'tablist')
  }

  public setupButton(button: HTMLElement, index: number) {
    button.setAttribute('role', 'tab')

    button.setAttribute('tabindex', index === 0 ? '0' : '-1')

    button.setAttribute('aria-controls', `tab-${index + 1}`)

    button.addEventListener('click', this.switchTab)

    button.addEventListener('keydown', this.handleKeydown)
  }

  public setupContent(content: HTMLElement, index: number) {
    content.setAttribute('role', 'tabpanel')

    content.setAttribute('aria-labelledby', `tab-${index + 1}`)

    content.setAttribute('tabindex', '0')
    if (index !== 0) content.classList.add('hidden')
  }

  private switchTab = (event: Event) => {
    const selectedButton = event.target as HTMLElement

    const targetId = selectedButton.getAttribute('data-tab-target')

    this.buttons.forEach((button) => {
      button.classList.remove('active-tab')

      button.setAttribute('aria-selected', 'false')

      button.setAttribute('tabindex', '-1')
    })

    this.contents.forEach((content) => {
      content.classList.remove('active-content')
      content.classList.add('hidden')
      if (content.getAttribute('data-tab-content') === targetId) {
        content.classList.add('active-content')
        content.classList.remove('hidden')
      }
    })

    selectedButton.classList.add('active-tab')

    selectedButton.setAttribute('aria-selected', 'true')

    selectedButton.setAttribute('tabindex', '0')

    selectedButton.focus()
  }

  private handleKeydown = (event: KeyboardEvent) => {
    const key = event.key

    let newSelectedIndex

    const currentIndex = this.buttons.findIndex((button) => button.classList.contains('active-tab'))

    if (key === 'ArrowRight') {
      newSelectedIndex = (currentIndex + 1) % this.buttons.length
    } else if (key === 'ArrowLeft') {
      newSelectedIndex = (currentIndex - 1 + this.buttons.length) % this.buttons.length
    } else {
      return
    }

    event.preventDefault()

    this.buttons[newSelectedIndex].click()
  }

  public destroy() {
    this.buttons.forEach((button) => {
      button.removeEventListener('click', this.switchTab)

      button.removeEventListener('keydown', this.handleKeydown)
    })
  }
}

// sample document
// <div class="tab-basic" data-tab>
//     <div class="tab-basic__toggle">
//       <button class="tab-basic__button" data-tab-target="tab-1">
//        tab_text_1
//       </button>
//       <button class="tab-basic__button" data-tab-target="tab-2">
//         tab_text_2
//       </button>
//     </div>
//     <div class="tab-basic__contents">
//       <div class="tab-basic__content" data-tab-content="tab-1">content-1...</div>
//       <div class="tab-basic__content" data-tab-content="tab-2">content-2...</div>
//     </div>
//   </div>
