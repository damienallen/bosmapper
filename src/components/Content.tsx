import React from 'react'
import { IonContent } from '@ionic/react'

import { MapCanvas } from './MapCanvas'
import { MapOverlay } from './MapOverlay'

import { LoginPopover } from './LoginPopover'
import { SettingsModal } from './SettingsModal'
import { SpeciesModal } from './SpeciesModal'

export const Content: React.FC = () => (
    <IonContent id="main">
        <SettingsModal />
        <SpeciesModal />
        <LoginPopover />

        <MapOverlay />
        <MapCanvas />
    </IonContent>
)