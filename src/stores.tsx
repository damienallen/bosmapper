import { autorun, observable, computed } from "mobx"
import { cloneDeep } from "lodash"

import { getSpeciesData } from './utilities/FeatureHelpers'

export class RootStore {
    public ui: UIStore
    public filter: FilterStore
    public map: MapStore
    public settings: SettingStore

    constructor() {
        this.ui = new UIStore(this)
        this.filter = new FilterStore(this)
        this.map = new MapStore(this)
        this.settings = new SettingStore(this)
    }
}

export class UIStore {

    @observable showLoginPopover: boolean = false

    @observable showLicenseModal: boolean = false
    @observable showFilterModal: boolean = false
    @observable showSettingsModal: boolean = false
    @observable showSpeciesModal: boolean = false

    @observable showTreeDetails: boolean = false

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

    setShowSpeciesModal(value: boolean) {
        this.showSpeciesModal = value
    }

    setShowTreeDetails(value: boolean) {
        this.showTreeDetails = value
    }

    constructor(public root: RootStore) { }
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

    constructor(public root: RootStore) { }
}

export class MapStore {

    @observable version: string = 'current'
    @observable baseMap: string = 'drone'

    @observable features: any
    @observable filteredFeatures: any
    @observable selectedFeature: any

    setVersion(value: string) {
        this.version = value
    }

    setBaseMap(value: string) {
        this.baseMap = value
    }

    setFeatures(value: any) {
        this.features = value
        this.filteredFeatures = value
    }

    setSelectedFeature(value: any) {
        this.selectedFeature = value
    }

    @computed get overlayBackground() {
        return this.baseMap === 'drone' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(230, 230, 230, 0.95)'
    }

    @computed get mapBackground() {
        return this.baseMap === 'drone' ? '#333' : '#fff'
    }

    constructor(public root: RootStore) {
        autorun(() => {
            const query = this.root.filter.query.toLowerCase()
            const minHeight = this.root.filter.minHeight
            const maxHeight = this.root.filter.maxHeight

            const minWidth = this.root.filter.minWidth
            const maxWidth = this.root.filter.maxWidth

            const featureFilter = (feature: any) => {
                const speciesData = getSpeciesData(feature.properties.species)

                if (speciesData.height < minHeight || speciesData.height > maxHeight) return false
                if (speciesData.width < minWidth || speciesData.width > maxWidth) return false

                if (query.length < 3) {
                    return true
                } else if (
                    speciesData.species.toLowerCase().includes(query)
                    || (speciesData.name_nl && speciesData.name_nl.toLowerCase().includes(query))
                    || (speciesData.name_en && speciesData.name_en.toLowerCase().includes(query))
                ) {
                    return true
                } else {
                    return false
                }
            }

            if (this.features) {
                const filteredGeoJson = cloneDeep(this.features)
                filteredGeoJson.features = filteredGeoJson.features.filter(featureFilter)
                this.filteredFeatures = filteredGeoJson
            }
        })
    }

}

export class SettingStore {

    @observable language: string = 'nl'

    setLanguage(value: string) {
        this.language = value
    }

    constructor(public root: RootStore) { }
}