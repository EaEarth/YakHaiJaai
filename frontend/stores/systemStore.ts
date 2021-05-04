import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import RootStore from './RootStore'
import axios from 'axios'

export class SystemStore {
  private rootStore: RootStore
  @observable
  id: number | null

  constructor(rootStore: RootStore) {
    makeObservable(this)
    this.rootStore = rootStore
  }

  @action
  async uploadFile(file): Promise<void> {
    let formData = new FormData()
    formData.append('file', file, file.name)
    try {
      const response = await axios.post(
        'https://yakhaijaai-av4aghecuq-as.a.run.app/api/file-item/upload',
        formData
      )
      runInAction(() => {
        if (response.status === 201) {
          this.id = response.data.id
        }
      })
    } catch (err) {
      runInAction(() => {
        console.log(err)
      })
    }
  }
}

export default SystemStore
