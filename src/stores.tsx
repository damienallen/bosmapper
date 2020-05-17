import { observable } from "mobx"

export class UIStore {

    @observable showLoginPopover: boolean = false
    @observable showLicenseModal: boolean = false
    @observable showFilterModal: boolean = false
    @observable showSettingsModal: boolean = false

    setShowLoginPopover(value: boolean) {
        this.showLoginPopover = value
    }

    setShowLicenseModal(value: boolean) {
        this.showLicenseModal = value
    }

    setShowFilterModal(value: boolean) {
        this.showFilterModal = value
    }

    setShowSettingsModal(value: boolean) {
        this.showSettingsModal = value
    }

}

export class FilterStore {

    @observable query: string = ''
    @observable minHeight: number = 0
    @observable maxHeight: number = 30
    @observable minWidth: number = 0
    @observable maxWidth: number = 20

    setQuery(value: string) {
        this.query = value
    }

    setHeightRange(minValue: number, maxValue: number) {
        this.minHeight = minValue
        this.maxHeight = maxValue
    }

    setWidthRange(minValue: number, maxValue: number) {
        this.maxWidth = minValue
        this.maxWidth = maxValue
    }
}

export class MapStore {

    @observable version: string = 'current'
    @observable filteredFeatures: any

    setVersion(value: string) {
        this.version = value
    }

    setFilteredFeatures(value: any) {
        this.filteredFeatures = value
    }

}

export class SettingStore {

    @observable language: string = 'nl'

    setLanguage(value: string) {
        this.language = value
    }

}