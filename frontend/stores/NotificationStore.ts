import axios from 'axios'
import { action, computed, makeObservable, observable } from 'mobx'
import RootStore from './RootStore'

export class NotificationStore {
  private rootStore: RootStore
  @observable
  notifications: any[]

  @observable
  notificationCount: number

  constructor(rootStore: RootStore) {
    makeObservable(this)
    this.notifications = []
    this.notificationCount = 0
    this.rootStore = rootStore
  }

  @action
  sendNotification(tokens: string[], data) {
    const payload = {
      data: data,
      registrationTokens: tokens,
    }
    console.log(payload)
    axios.post('http://localhost:8000/api/notification/send', payload)
  }

  @action
  setNotifications(notification) {
    this.notifications = notification
  }

  @action
  setNotificationCount(count) {
    this.notificationCount = count
  }

  @computed
  get getNotifications() {
    return this.notifications
  }
}

export default NotificationStore
