import { observable } from "mobx"

export class UIStore {

    @observable showLoginPopover: boolean = false
    @observable showLicenseModal: boolean = false
    @observable showSettingsModal: boolean = false

    setShowLoginPopover(value: boolean) {
        this.showLoginPopover = value
    }

    setShowLicenseModal(value: boolean) {
        this.showLicenseModal = value
    }

    setShowSettingsModal(value: boolean) {
        this.showSettingsModal = value
    }

}

export class MapStore {

    @observable version: string = 'current'

    setVersion(value: string) {
        this.version = value
    }

}

export class SettingStore {

    @observable language: string = 'nl'

    setLanguage(value: string) {
        this.language = value
    }

}