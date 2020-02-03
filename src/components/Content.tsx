import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { IonContent } from '@ionic/react'

import { MapCanvas } from './MapCanvas'
import { MapOverlay } from './MapOverlay'
import { getSpeciesData } from '../utilities/FeatureHelpers'

import * as updatedJson from '../assets/voedselbos_features_updated.json'
import * as originalJson from '../assets/voedselbos_features_original.json'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

export const Content: React.FC = observer(() => {
    console.log('Loading features')
    const { filter, map } = useStores()

    const query = filter.query
    const minHeight = filter.minHeight
    const maxHeight = filter.maxHeight

    const minWidth = filter.minWidth
    const maxWidth = filter.maxWidth

    const featureFilter = (feature: any) => {
        const speciesData = getSpeciesData(feature.properties.species)
        // if (query.length > 2 && !(
        //     speciesData.species.includes(query)
        //     || (speciesData.name_nl && speciesData.name_nl.includes(query))
        //     || (speciesData.name_en && speciesData.name_en.includes(query))
        // )) {
        //     return false
        // }

        if (speciesData.height < minHeight || speciesData.height > maxHeight) return false
        if (speciesData.width < minWidth || speciesData.width > maxWidth) return false
        return true
    }

    // Load appropriate feature set
    let geoData = map.version === 'current'
        ? updatedJson.data
        : originalJson.data

    geoData.features = geoData.features.filter(featureFilter)
    map.setFilteredFeatures(geoData)

    return (
        <IonContent id="main">
            <MapOverlay />
            <MapCanvas />
        </IonContent>
    )
})