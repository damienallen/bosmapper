import { autorun, observable, computed } from 'mobx'
import { cloneDeep } from 'lodash'


export const showUpdatedTimeout = 3000

export class RootStore {
    public ui: UIStore
    public map: MapStore
    public settings: SettingStore
    public species: SpeciesStore

    constructor() {
        this.ui = new UIStore(this)
        this.species = new SpeciesStore(this)
        this.map = new MapStore(this)
        this.settings = new SettingStore(this)
    }
}

export class UIStore {

    @observable toastText: string = ''
    @observable showToast: boolean = false

    @observable showLoginPopover: boolean = false
    @observable showLicenseModal: boolean = false
    @observable showFilterModal: boolean = false
    @observable showSettingsModal: boolean = false

    @observable showTreeDetails: boolean = false
    @observable showLocationUpdated: boolean = false
    @observable showNotesUpdated: boolean = false
    @observable showSpeciesUpdated: boolean = false

    @observable showLocationSelector: boolean = false
    @observable showSpeciesSelector: boolean = false

    @observable locationSelectorAction: string = 'new'
    @observable speciesSelectorAction: string = 'new'

    setToastText(value: string) {
        this.toastText = value
        this.showToast = true
    }

    hideToast() {
        this.showToast = false
        this.toastText = ''
    }

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

    setShowTreeDetails(value: boolean) {
        this.showTreeDetails = value
    }

    setShowSpeciesUpdated(value: boolean) {
        this.showSpeciesUpdated = value
        if (value) setTimeout(() => this.setShowSpeciesUpdated(false), showUpdatedTimeout)
    }

    setShowNotesUpdated(value: boolean) {
        this.showNotesUpdated = value
        if (value) setTimeout(() => this.setShowNotesUpdated(false), showUpdatedTimeout)
    }

    setShowLocationUpdated(value: boolean) {
        this.showLocationUpdated = value
        if (value) setTimeout(() => this.setShowLocationUpdated(false), showUpdatedTimeout)
    }

    setShowLocationSelector(value: boolean, action: string = 'new') {
        this.showLocationSelector = value
        this.locationSelectorAction = action
    }

    setShowSpeciesSelector(value: boolean, action: string = 'new') {
        this.showSpeciesSelector = value
        this.speciesSelectorAction = action
    }

    @computed get showDetailsUpdated() {
        return (this.showLocationUpdated || this.showNotesUpdated || this.showSpeciesUpdated)
    }

    constructor(public root: RootStore) { }
}


export interface Species {
    species: string,
    name_la: string,
    name_nl?: string,
    name_en?: string,
    height?: number,
    width?: number
}

export class SpeciesStore {

    @observable list: Species[] = []
    @observable query: string = ''
    @observable minHeight: number = 0
    @observable maxHeight: number = 30
    @observable minWidth: number = 0
    @observable maxWidth: number = 20

    setList(value: Species[]) {
        this.list = value
    }

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

    @computed get count() {
        return this.list.length
    }

    constructor(public root: RootStore) { }
}

export class MapStore {

    @observable version: string = 'current'
    @observable baseMap: string = 'drone'

    @observable featuresGeoJson: any
    @observable filteredFeatures: any
    @observable selectedFeature: any

    @observable featuresHash: string = ''
    @observable needsUpdate: boolean = false
    @observable centerOnSelected: boolean = false

    @observable center: any
    @observable newFeatureSpecies: string | null = null

    setVersion(value: string) {
        this.version = value
    }

    setBaseMap(value: string) {
        this.baseMap = value
    }

    setFeaturesGeoJson(value: any) {
        this.featuresGeoJson = value
        this.filteredFeatures = value
    }

    setSelectedFeature(value: any) {
        this.selectedFeature = value
    }

    setFeaturesHash(value: string) {
        this.featuresHash = value
    }

    setNeedsUpdate(value: boolean) {
        this.needsUpdate = value
    }

    setCenterOnSelected(value: boolean) {
        this.centerOnSelected = value
    }

    setCenter(value: any) {
        this.center = value
    }

    setNewFeatureSpecies(value: string) {
        this.newFeatureSpecies = value
    }

    @computed get overlayBackground() {
        return this.baseMap === 'drone' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(230, 230, 230, 0.95)'
    }

    @computed get mapBackground() {
        return this.baseMap === 'drone' ? '#333' : '#fff'
    }

    constructor(public root: RootStore) {
        autorun(() => {
            const query = this.root.species.query.toLowerCase()
            // const minHeight = this.root.species.minHeight
            // const maxHeight = this.root.species.maxHeight

            // const minWidth = this.root.species.minWidth
            // const maxWidth = this.root.species.maxWidth

            const featureFilter = (feature: any) => {
                const speciesData = feature.properties

                // if (speciesData.height < minHeight || speciesData.height > maxHeight) return false
                // if (speciesData.width < minWidth || speciesData.width > maxWidth) return false

                if (query.length < 1) {
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

            if (this.featuresGeoJson && this.featuresGeoJson.features) {
                const filteredGeoJson = cloneDeep(this.featuresGeoJson)
                filteredGeoJson.features = filteredGeoJson.features.filter(featureFilter)
                this.filteredFeatures = filteredGeoJson
            }
        })
    }

}

export class SettingStore {

    @observable language: string = 'nl'
    @observable host: string = 'https://bos.dallen.co'

    setLanguage(value: string) {
        this.language = value
    }

    setHost(value: string) {
        this.host = value
    }

    constructor(public root: RootStore) { }
}