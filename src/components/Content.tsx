import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { IonContent } from '@ionic/react'

import { MapCanvas } from './MapCanvas'
import { MapOverlay } from './MapOverlay'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

export const Content: React.FC = observer(() => {
    const { map } = useStores()

    console.log(map.version)

    return (
        <IonContent id="main">
            <MapOverlay />
            <MapCanvas />
        </IonContent>
    )
})