import axios from 'axios'
import React from 'react'
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
    const { map, ui } = useStores()
    const classes = useStyles(map.overlayBackground)

    const handleCancel = (event: any) => {
        map.setNewFeatureSpecies(null)
        ui.setShowLocationSelector(false)
    }

    const handleConfirm = (event: any) => {
        const featureJson = {
            species: map.newFeatureSpecies,
            lon: map.center[0],
            lat: map.center[1],
        }
        console.log('Trying to add feature', featureJson)

        axios.post('http://192.168.178.16:8080/tree/add/', featureJson)
            .then((response) => {
                console.debug(response)
                map.setNeedsUpdate(true)
            })
            .catch((error) => {
                console.error(error)
            })

        map.setNewFeatureSpecies(null)
        ui.setShowLocationSelector(false)
    }

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                Kies een locatie
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

