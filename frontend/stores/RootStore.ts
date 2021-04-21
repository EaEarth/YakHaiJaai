import AuthStore from './AuthStore'

export type RootStoreHydration = any

export class RootStore {
  authStore: AuthStore
  constructor() {
    this.authStore = new AuthStore(this)
  }
  // eslint-disable-next-line
  hydrate(initialData: RootStoreHydration) {
    console.log(initialData)
  }
}

export default RootStore
