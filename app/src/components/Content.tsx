import { IonContent } from '@ionic/react'
import { observer } from 'mobx-react'
import React from 'react'
import { useStores } from '../stores'
import { AboutModal } from './AboutModal'

import { LoadingScreen } from './LoadingScreen'
import { LoginPopover } from './LoginPopover'
import { MapCanvas } from './MapCanvas'
import { MapOverlay } from './MapOverlay'
import { SpeciesSelector } from './SpeciesSelector'

export const Content: React.FC = observer(() => {
    const { species } = useStores()
    return species.count > 0 ? (
        <IonContent id="main">
            <AboutModal />
            <SpeciesSelector />
            <LoginPopover />

            <MapOverlay />
            <MapCanvas />
        </IonContent>
    ) : (
        <LoadingScreen />
    )
})
