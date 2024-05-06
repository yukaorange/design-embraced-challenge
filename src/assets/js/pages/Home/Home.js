import Page from "@js/class/Page";

export default class Home extends Page {
  constructor() {
    super({
      id: "home",
      element: ".home",
      elements: {
        link: ".home__link",
      },
    });
  }

  create() {
    super.create();
  }

  destroy() {
    super.destroy();
  }
}
