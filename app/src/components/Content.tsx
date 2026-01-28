import React from 'react'
import { observer } from 'mobx-react'
import { IonContent } from '@ionic/react'

import { MapCanvas } from './MapCanvas'
import { MapOverlay } from './MapOverlay'

import { LoadingScreen } from './LoadingScreen'
import { LoginPopover } from './LoginPopover'
import { AboutModal } from './AboutModal'
import { SpeciesSelector } from './SpeciesSelector'


import { useStores } from '../stores'


export const Content: React.FC = observer(() => {
    const { species } = useStores()
    return species.count > 0 ? (
        <IonContent id='main'>
            <AboutModal />
            <SpeciesSelector />
            <LoginPopover />

            <MapOverlay />
            <MapCanvas />
        </IonContent>
    ) : <LoadingScreen />
})
