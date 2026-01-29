import { cloneDeep } from 'lodash'
import { autorun, computed, makeObservable, observable } from 'mobx'
import { Coordinate } from 'ol/coordinate'
import Feature from 'ol/Feature'
import React, { createContext, useContext } from 'react'
import Cookies from 'universal-cookie'

const cookies = new Cookies()
export const showUpdatedTimeout = 1000

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
    toastText: string = ''
    showToast: boolean = false
    showConnectionError: boolean = false

    showLoginPopover: boolean = false
    showLicenseModal: boolean = false
    showAboutModal: boolean = false

    showTreeDetails: boolean = false
    showLocationUpdated: boolean = false
    showMetaUpdated: boolean = false
    showSpeciesUpdated: boolean = false

    showLocationSelector: boolean = false
    showSpeciesSelector: boolean = false

    locationSelectorAction: string = 'new'
    speciesSelectorAction: string = 'new'

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

    get showDetailsUpdated() {
        return this.showLocationUpdated || this.showMetaUpdated || this.showSpeciesUpdated
    }

    constructor(public root: RootStore) {
        makeObservable(this, {
            toastText: observable,
            showToast: observable,
            showConnectionError: observable,
            showLoginPopover: observable,
            showLicenseModal: observable,
            showAboutModal: observable,
            showTreeDetails: observable,
            showLocationUpdated: observable,
            showMetaUpdated: observable,
            showSpeciesUpdated: observable,
            showLocationSelector: observable,
            showSpeciesSelector: observable,
            locationSelectorAction: observable,
            speciesSelectorAction: observable,
            showDetailsUpdated: computed,
        })
    }
}

export interface Species {
    species: string
    name_la: string
    name_nl?: string
    name_en?: string
    height?: number
    width?: number
}

export class SpeciesStore {
    query: string = ''
    selectedTags: string[] = []

    list: Species[] = []
    minHeight: number = 0
    maxHeight: number = 30
    minWidth: number = 0
    maxWidth: number = 20

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

    get count() {
        return this.list.length
    }

    constructor(public root: RootStore) {
        makeObservable(this, {
            query: observable,
            selectedTags: observable,
            list: observable,
            minHeight: observable,
            maxHeight: observable,
            minWidth: observable,
            maxWidth: observable,
            count: computed,
        })
    }
}

export class MapStore {
    version: string = 'current'
    baseMap: string = 'drone'

    featuresGeoJson: any
    filteredFeatures: any[] = []
    selectedFeature?: Feature
    numUnknown: number = 0
    numDead: number = 0

    firstLoad: boolean = true

    featuresHash: string = ''
    needsUpdate: boolean = false
    needsRefresh: boolean = false
    centerOnSelected: boolean = false

    center: Coordinate = [0, 0]
    newFeatureSpecies: string | null = null

    setVersion(value: string) {
        this.version = value
    }

    setBaseMap(value: string) {
        this.baseMap = value
        cookies.set('drone', value === 'drone')
    }

    get isDrone() {
        return this.baseMap === 'drone'
    }

    setFeaturesGeoJson(value: any) {
        this.featuresGeoJson = value
        this.numUnknown = value.features.filter(
            (species: any) => species.properties.name_nl === 'Onbekend'
        ).length
        this.numDead = value.features.filter((species: any) => species.properties.dead).length
    }

    setSelectedFeature(value: Feature | undefined) {
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

    setCenter(value: Coordinate) {
        this.center = value
    }

    setNewFeatureSpecies(value: string | null) {
        this.newFeatureSpecies = value
    }

    get selectedId() {
        return this.selectedFeature?.get('oid')
    }

    get overlayBackground() {
        return this.baseMap === 'drone' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(230, 230, 230, 0.95)'
    }

    get mapBackground() {
        return this.baseMap === 'drone' ? '#333' : '#fff'
    }

    get searchBorder() {
        return this.baseMap === 'drone' ? '2px solid transparent' : '2px solid #999'
    }

    filterFeatures = () => {
        const query = this.root.species.query.toLowerCase()
        const featureFilter = (feature: any) => {
            const speciesData = feature.properties

            if (
                speciesData.dead &&
                (!this.root.settings.showDead || !this.root.settings.authenticated)
            ) {
                return false
            } else if (
                this.root.species.selectedTags.length > 0 &&
                !this.root.species.selectedTags.every((tag) => speciesData.tags.includes(tag))
            ) {
                return false
            } else if (query.length < 1) {
                return true
            } else if (
                speciesData.name_la?.toLowerCase().includes(query) ||
                speciesData.name_nl?.toLowerCase().includes(query)
            ) {
                return true
            } else {
                return false
            }
        }

        if (this.featuresGeoJson?.features) {
            const filteredGeoJson = cloneDeep(this.featuresGeoJson)
            filteredGeoJson.features = filteredGeoJson.features.filter(featureFilter)
            this.filteredFeatures = filteredGeoJson
        }
    }

    constructor(public root: RootStore) {
        makeObservable(this, {
            version: observable,
            baseMap: observable,
            featuresGeoJson: observable,
            filteredFeatures: observable,
            selectedFeature: observable,
            numUnknown: observable,
            numDead: observable,
            firstLoad: observable,
            featuresHash: observable,
            needsUpdate: observable,
            needsRefresh: observable,
            centerOnSelected: observable,
            center: observable,
            newFeatureSpecies: observable,
            isDrone: computed,
            selectedId: computed,
            overlayBackground: computed,
            mapBackground: computed,
            searchBorder: computed,
        })

        autorun(() => this.filterFeatures())
    }
}

export class SettingStore {
    showDead: boolean = false
    showNotes: boolean = false

    language: string = 'nl'
    host: string = 'https://bosmapper.dallen.co/api'

    token: string | null = null

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

    get authenticated() {
        return this.token !== null
    }

    get authHeader() {
        return {
            headers: { Authorization: `Bearer ${this.token}` },
        }
    }

    constructor(public root: RootStore) {
        makeObservable(this, {
            showDead: observable,
            showNotes: observable,
            language: observable,
            host: observable,
            token: observable,
            authenticated: computed,
            authHeader: computed,
        })
    }
}

export const rootStore = new RootStore()
export const StoreContext = createContext(rootStore)
export const useStores = () => useContext(StoreContext)

export const StoreProvider: React.FC = ({ children }) => {
    return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
}
