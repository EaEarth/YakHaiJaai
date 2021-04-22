import { action, computed, makeObservable, observable } from 'mobx'
import RootStore from './RootStore'

export class AuthStore {
  private rootStore: RootStore
  @observable
  user: any

  @observable
  userInfo: any

  constructor(rootStore: RootStore) {
    makeObservable(this)
    this.user = null
    this.userInfo = null
    this.rootStore = rootStore
  }

  @computed
  get getUser() {
    return this.user
  }

  @computed
  get isLoggedIn(): boolean {
    return this.userInfo !== null
  }

  @action
  setUser(user) {
    this.user = user
  }

  @action
  setUserInfo(userInfo) {
    this.userInfo = userInfo
  }
}

export default AuthStore
