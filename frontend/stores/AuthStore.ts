import { computed, makeObservable, observable } from 'mobx'
import RootStore from './RootStore'

export class AuthStore {
  private rootStore: RootStore
  @observable
  user: any

  constructor(rootStore: RootStore) {
    makeObservable(this)
    this.user = null
    this.rootStore = rootStore
  }

  @computed
  get userInfo() {
    return this.user
  }

  @computed
  get isLoggedIn(): boolean {
    return this.user !== null
  }
}

export default AuthStore
