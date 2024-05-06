export default class MetaManager {
  constructor(doc) {
    this.doc = doc;
  }

  updateMetaTags() {
    const description = this.doc.querySelector('meta[name="description"]')?.getAttribute('content');

    const ogTitle = this.doc.querySelector('meta[property="og:title"]')?.getAttribute('content');

    const ogDescription = this.doc
      .querySelector('meta[property="og:description"]')
      ?.getAttribute('content');

    const ogImage = this.doc.querySelector('meta[property="og:image"]')?.getAttribute('content');

    this.updateMetaDescription(description);

    this.updateOGPMetaTags({ title: ogTitle, description: ogDescription, image: ogImage });
  }

  updateMetaDescription(metaDescriptionContent) {
    let currentMetaDescription = document.querySelector('meta[name="description"]');

    if (currentMetaDescription) {
      currentMetaDescription.setAttribute('content', metaDescriptionContent);
    } else {
      currentMetaDescription = document.createElement('meta');

      currentMetaDescription.setAttribute('name', 'description');

      currentMetaDescription.setAttribute('content', metaDescriptionContent);

      document.head.appendChild(currentMetaDescription);
    }
  }

  updateOGPMetaTags({ title, description, image }) {
    this.updateOrCreateMetaTag('og:title', title);

    this.updateOrCreateMetaTag('og:description', description);

    this.updateOrCreateMetaTag('og:image', image);
  }

  updateOrCreateMetaTag(property, content) {
    let metaTag = document.querySelector(`meta[property="${property}"]`);

    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('property', property);

      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', content);
  }
}
