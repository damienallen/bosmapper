import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { IonContent } from '@ionic/react'

import { MapCanvas } from './MapCanvas'
import { MapOverlay } from './MapOverlay'

import * as updatedJson from '../assets/voedselbos_features_updated.json'
import * as originalJson from '../assets/voedselbos_features_original.json'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

export const Content: React.FC = observer(() => {
    const { map } = useStores()

    let features = map.version === 'current' ? updatedJson.data : originalJson.data
    map.setFilteredFeatures(features)

    return (
        <IonContent id="main">
            <MapOverlay />
            <MapCanvas />
        </IonContent>
    )
})