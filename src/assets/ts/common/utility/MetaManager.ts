export default class MetaManager {
  private doc: Document

  constructor(doc: Document) {
    this.doc = doc
  }

  updateMetaTags() {
    const description = this.doc.querySelector('meta[name="description"]')?.getAttribute('content')

    const ogTitle = this.doc.querySelector('meta[property="og:title"]')?.getAttribute('content')

    const ogDescription = this.doc
      .querySelector('meta[property="og:description"]')
      ?.getAttribute('content')

    const ogImage = this.doc.querySelector('meta[property="og:image"]')?.getAttribute('content')

    this.updateMetaDescription(description ?? '')

    this.updateOGPMetaTags({
      title: ogTitle ?? '',
      description: ogDescription ?? '',
      image: ogImage ?? '',
    })
  }

  updateMetaDescription(metaDescriptionContent: string) {
    let currentMetaDescription = document.querySelector('meta[name="description"]')

    if (currentMetaDescription) {
      currentMetaDescription.setAttribute('content', metaDescriptionContent)
    } else {
      currentMetaDescription = document.createElement('meta')

      currentMetaDescription.setAttribute('name', 'description')

      currentMetaDescription.setAttribute('content', metaDescriptionContent)

      document.head.appendChild(currentMetaDescription)
    }
  }

  updateOGPMetaTags({
    title,
    description,
    image,
  }: {
    title: string
    description: string
    image: string
  }) {
    this.updateOrCreateMetaTag('og:title', title)

    this.updateOrCreateMetaTag('og:description', description)

    this.updateOrCreateMetaTag('og:image', image)
  }

  updateOrCreateMetaTag(property: string, content: string) {
    let metaTag = document.querySelector(`meta[property="${property}"]`)

    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.setAttribute('property', property)
      document.head.appendChild(metaTag)
    }

    metaTag.setAttribute('content', content)
  }
}
