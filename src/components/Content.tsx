import React from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import { IonContent, IonSpinner, IonToast } from '@ionic/react'

import { MapCanvas } from './MapCanvas'
import { MapOverlay } from './MapOverlay'

import { LoginPopover } from './LoginPopover'
import { SettingsModal } from './SettingsModal'
import { SpeciesSelector } from './SpeciesSelector'


const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    loading: {
        background: '#333',
        height: '100%',
        width: '100%',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    loadingText: {
        paddingBottom: 5
    }
})

export const Content: React.FC = observer(() => {
    const classes = useStyles()
    const { species, ui } = useStores()

    return species.count > 0 ?
        (
            <IonContent id='main'>
                <SettingsModal />
                <SpeciesSelector />
                <LoginPopover />

                <MapOverlay />
                <MapCanvas />
            </IonContent>
        ) : (
            <IonContent id='main'>
                <div className={classes.loading}>
                    <div className={classes.loadingText}>Aan het laden</div>
                    <IonSpinner name='dots' color='light' />
                </div>
                <IonToast
                    isOpen={ui.showToast}
                    onDidDismiss={() => ui.hideToast()}
                    message={ui.toastText}
                    duration={2000}
                />
            </IonContent>
        )
})
