import axios from 'axios'
import React, { useEffect } from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'
import { IonButton } from '@ionic/react'

import { Crosshair } from './Crosshair'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        width: '100%',
        height: '100%'
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        background: (backgroundColor: string) => backgroundColor,
        color: '#333',
        textAlign: 'center',
        textTransform: 'uppercase',
        padding: '10px 0',
        fontWeight: 'bold',
        zIndex: 150
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        background: (backgroundColor: string) => backgroundColor,
        display: 'flex',
        padding: '10px 0',
        zIndex: 150
    },
    actionButton: {
        flex: 1,
        margin: '0 5px'
    }
})

export const LocationSelector: React.FC = observer(() => {
    const { map, settings, ui } = useStores()
    const classes = useStyles(map.overlayBackground)

    useEffect(() => {
        if (ui.selectorAction === 'move') map.setCenterOnSelected(true)
    })

    const handleCancel = (event: any) => {
        map.setNewFeatureSpecies(null)
        ui.setShowLocationSelector(false)
    }

    const handleConfirm = (event: any) => {

        if (ui.selectorAction === 'move') {
            const featureJson = {
                lon: map.center[0],
                lat: map.center[1]
            }
            axios.post(`${settings.host}/tree/update/${map.selectedFeature.values_.oid}/`, featureJson)
                .then((response) => {
                    console.debug(response)
                    map.setNeedsUpdate(true)
                    ui.setToastText('Geslaagd!')
                })
                .catch((error) => {
                    console.error(error)
                    ui.setToastText('Verzoek mislukt')
                })
        } else {
            const featureJson = {
                species: map.newFeatureSpecies,
                lon: map.center[0],
                lat: map.center[1],
            }
            console.log('Trying to add feature', featureJson)

            axios.post(`${settings.host}/tree/add/`, featureJson)
                .then((response) => {
                    console.debug(response)
                    map.setNeedsUpdate(true)
                    ui.setToastText('Geslaagd!')
                })
                .catch((error) => {
                    console.error(error)
                    ui.setToastText('Verzoek mislukt')
                })
        }

        map.setNewFeatureSpecies(null)
        ui.setShowLocationSelector(false)
    }

    const headerText = ui.selectorAction === 'new' ? 'Kies een locatie' : 'Kies een niewue locatie'

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                {headerText}
            </div>

            <Crosshair />

            <div className={classes.footer}>
                <IonButton
                    className={classes.actionButton}
                    onClick={handleCancel}
                    size="default"
                    fill="outline"
                >
                    Annuleren
                    </IonButton>
                <IonButton
                    className={classes.actionButton}
                    onClick={handleConfirm}
                    size="default"
                >
                    Bevestigen
                    </IonButton>
            </div>
        </div>
    )
})

