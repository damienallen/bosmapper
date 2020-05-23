import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { IonContent } from '@ionic/react'

import { MapCanvas } from './MapCanvas'
import { MapOverlay } from './MapOverlay'

import { LoginPopover } from './LoginPopover'
import { SettingsModal } from './SettingsModal'
import { SpeciesSelector } from './SpeciesSelector'


const useStores = () => {
    return React.useContext(MobXProviderContext)
}

export const Content: React.FC = observer(() => {
    const { species } = useStores()
    return (
        <IonContent id="main">
            <SettingsModal />
            {species.count > 0 ? <SpeciesSelector /> : null}
            <LoginPopover />

            <MapOverlay />
            <MapCanvas />
        </IonContent>
    )
})
