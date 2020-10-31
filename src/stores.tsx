import Cookies from 'universal-cookie'
import { autorun, observable, computed } from 'mobx'
import { cloneDeep } from 'lodash'


const cookies = new Cookies()
export const showUpdatedTimeout = 1000

export const droneUrl = 'drone/v4'
export const vectorUrl = 'vector/v2'

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
    @observable showConnectionError: boolean = false

    @observable showLoginPopover: boolean = false
    @observable showLicenseModal: boolean = false
    @observable showAboutModal: boolean = false

    @observable showTreeDetails: boolean = false
    @observable showLocationUpdated: boolean = false
    @observable showMetaUpdated: boolean = false
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

    setShowConnectionError(value: boolean) {
        this.showConnectionError = value
    }

    setShowLoginPopover(value: boolean) {
        this.showLoginPopover = value
    }

    setShowLicenseModal(value: boolean) {
        this.showLicenseModal = value
    }

    setShowAboutModal(value: boolean) {
        this.showAboutModal = value
    }

    setShowTreeDetails(value: boolean) {
        this.showTreeDetails = value
    }

    setShowSpeciesUpdated(value: boolean) {
        this.showSpeciesUpdated = value
        if (value) setTimeout(() => this.setShowSpeciesUpdated(false), showUpdatedTimeout)
    }

    setShowMetaUpdated(value: boolean) {
        this.showMetaUpdated = value
        if (value) setTimeout(() => this.setShowMetaUpdated(false), showUpdatedTimeout)
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
        return (this.showLocationUpdated || this.showMetaUpdated || this.showSpeciesUpdated)
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

    @observable query: string = ''
    @observable selectedTags: string[] = []

    @observable list: Species[] = []
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

    clearSelectedTags() {
        this.selectedTags = []
    }

    toggleSelectedTag(value: string) {
        const index = this.selectedTags.indexOf(value)
        if (index > -1) {
            this.selectedTags.splice(index, 1)
        } else {
            this.selectedTags.push(value)
        }
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
    @observable numUnknown: number = 0
    @observable numDead: number = 0

    @observable firstLoad: boolean = true

    @observable featuresHash: string = ''
    @observable needsUpdate: boolean = false
    @observable needsRefresh: boolean = false
    @observable centerOnSelected: boolean = false

    @observable center: any
    @observable newFeatureSpecies: string | null = null

    setVersion(value: string) {
        this.version = value
    }

    setBaseMap(value: string) {
        this.baseMap = value
        cookies.set('drone', value === 'drone')
    }

    @computed get isDrone() {
        return this.baseMap === 'drone'
    }

    @computed get bucketUrl() {
        return this.baseMap === 'drone' ? droneUrl : vectorUrl
    }

    setFeaturesGeoJson(value: any) {
        this.featuresGeoJson = value
        this.numUnknown = value.features.filter((species: any) => (species.properties.name_nl === 'Onbekend')).length
        this.numDead = value.features.filter((species: any) => (species.properties.dead)).length
    }

    setSelectedFeature(value: any) {
        this.selectedFeature = value
        this.firstLoad = false
    }

    setFeaturesHash(value: string) {
        this.featuresHash = value
    }

    setNeedsUpdate(value: boolean) {
        this.needsUpdate = value
    }

    setNeedsRefresh(value: boolean) {
        this.needsRefresh = value
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

    @computed get selectedId() {
        return this.selectedFeature.get('oid')
    }

    @computed get overlayBackground() {
        return this.baseMap === 'drone' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(230, 230, 230, 0.95)'
    }

    @computed get mapBackground() {
        return this.baseMap === 'drone' ? '#333' : '#fff'
    }

    @computed get searchBorder() {
        return this.baseMap === 'drone' ? '2px solid transparent' : '2px solid #999'
    }

    filterFeatures = () => {
        const query = this.root.species.query.toLowerCase()
        const featureFilter = (feature: any) => {
            const speciesData = feature.properties

            if (speciesData.dead && (!this.root.settings.showDead || !this.root.settings.authenticated)) {
                return false
            } else if (
                this.root.species.selectedTags.length > 0 &&
                !this.root.species.selectedTags.every(tag => speciesData.tags.includes(tag))
            ) {
                return false
            } else if (query.length < 1) {
                return true
            } else if (
                (speciesData.name_la && speciesData.name_la.toLowerCase().includes(query))
                || (speciesData.name_nl && speciesData.name_nl.toLowerCase().includes(query))
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
    }

    constructor(public root: RootStore) {
        autorun(() => this.filterFeatures())
    }

}

export class SettingStore {

    @observable showDead: boolean = false
    @observable showNotes: boolean = false

    @observable language: string = 'nl'
    @observable host: string = 'https://bosmapper.dallen.co/api'

    @observable token: string | null = null

    setShowDead(value: boolean) {
        this.showDead = value
        cookies.set('showDead', value)
    }

    setShowNotes(value: boolean) {
        this.showNotes = value
        cookies.set('showNotes', value)
    }

    setLanguage(value: string) {
        this.language = value
    }

    setHost(value: string) {
        this.host = value
    }

    setToken(value: string) {
        this.token = value
    }

    clearToken() {
        this.token = null
    }

    @computed get authenticated() {
        return (this.token !== null)
    }

    @computed get authHeader() {
        return {
            headers: { 'Authorization': `Bearer ${this.token}` }
        }
    }

    constructor(public root: RootStore) { }
}