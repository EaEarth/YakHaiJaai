import AuthStore from './AuthStore'
import NotificationStore from './NotificationStore'
import SystemStore from './systemStore'

export type RootStoreHydration = any

export class RootStore {
  authStore: AuthStore
  systemStore: SystemStore
  notificationStore: NotificationStore
  constructor() {
    this.authStore = new AuthStore(this)
    this.systemStore = new SystemStore(this)
    this.notificationStore = new NotificationStore(this)
  }
  // eslint-disable-next-line
  hydrate(initialData: RootStoreHydration) {
    console.log(initialData)
  }
}

export default RootStore
