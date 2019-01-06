export interface ZeldaErrorLabels {
  registerError: string,
  confirmRegisterError: string,
  registerRequest: string,
  confirmRegisterRequest: string,
  confirmHide: string,
  hideButtonPrefix: string,
  hideButtonSuffix: string,
  issueWaitingPatch: string,
  issueFixed: string,
  formPlaceholder: string,
}

export const ZeldaErrorDefaultLabels: { [locale: string]: ZeldaErrorLabels } = {
  ja: {
    registerError: '不具合を投稿',
    confirmRegisterError: '不具合を投稿しますか？',
    registerRequest: '改善点を投稿',
    confirmRegisterRequest: '改善点を投稿しますか？',
    confirmHide: 'リロードするまでZELDA_ERRORを隠します',
    hideButtonPrefix: '',
    hideButtonSuffix: 'を隠す',
    issueWaitingPatch: '配信待ち',
    issueFixed: 'Fixed!',
    formPlaceholder: '気づいたこと (具体的に)',
  },
  en: {
    registerError: 'Add an Error',
    confirmRegisterError: 'Add Error?',
    registerRequest: 'Add a Request',
    confirmRegisterRequest: 'Add Request?',
    confirmHide: 'Hiding ZELDA_ERROR until reload this page',
    hideButtonPrefix: 'Hide ',
    hideButtonSuffix: '',
    issueWaitingPatch: 'Next',
    issueFixed: 'Fixed!',
    formPlaceholder: 'Description of Error/Request',
  },
};