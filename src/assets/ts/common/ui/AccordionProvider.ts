export type TAccordionElements = {
  button: HTMLElement
  content: HTMLElement
}

export default class AccordionProvider {
  private button: HTMLElement | null = null
  private content: HTMLElement | null = null

  initialize(elements: TAccordionElements) {
    this.button = elements.button
    this.content = elements.content
  }

  generate() {
    this.button?.addEventListener('click', this.toggleAccordion)

    this.content?.setAttribute('aria-hidden', 'true')
  }

  toggleAccordion = () => {
    const expanded = this.button.getAttribute('aria-expanded') === 'true' ? true : false

    this.button.setAttribute('aria-expanded', !expanded ? 'true' : 'false')

    this.button.setAttribute('aria-controls', this.content.getAttribute('data-ui') as string)

    if (expanded) {
      this.content.setAttribute('aria-hidden', 'true')
    } else {
      this.content.setAttribute('aria-hidden', 'false')
    }
  }

  destroy() {
    this.button.removeEventListener('click', this.toggleAccordion)
  }
}
