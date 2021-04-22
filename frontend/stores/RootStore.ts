import AuthStore from './AuthStore'
import SystemStore from './systemStore'

export type RootStoreHydration = any

export class RootStore {
  authStore: AuthStore
  systemStore: SystemStore
  constructor() {
    this.authStore = new AuthStore(this)
    this.systemStore = new SystemStore(this)
  }
  // eslint-disable-next-line
  hydrate(initialData: RootStoreHydration) {
    console.log(initialData)
  }
}

export default RootStore
