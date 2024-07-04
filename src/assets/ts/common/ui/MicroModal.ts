import MicroModal from 'micromodal'

export default class MicroModalInit {
  constructor() {
    this.init()
  }

  init() {
    this.modalInstance = new MicroModal.init({
      // onShow: (modal) => console.info(`${modal.id} is shown`),
      // onClose: (modal) => console.info(`${modal.id} is hidden`),
      openTrigger: 'data-custom-open',
      closeTrigger: 'data-custom-close',
      disableScroll: true,
      awaitOpenAnimation: true,
      awaitCloseAnimation: true,
    })

    // console.log('modal is initialized');
  }

  destroy() {
    // console.log('mdoal is blinded');
  }
}
