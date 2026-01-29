import { IonButton } from '@ionic/react'
import axios, { AxiosResponse } from 'axios'
import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { useStores } from '../stores'
import { Crosshair } from './Crosshair'

const useStyles = createUseStyles({
    container: {
        width: '100%',
        height: '100%',
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
        zIndex: 150,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        background: (backgroundColor: string) => backgroundColor,
        display: 'flex',
        padding: '10px 0',
        zIndex: 150,
    },
    actionButton: {
        flex: 1,
        margin: '0 5px',
    },
})

export const LocationSelector: React.FC = observer(() => {
    const { map, settings, ui } = useStores()
    const classes = useStyles(map.overlayBackground)

    useEffect(() => {
        if (ui.locationSelectorAction === 'move') map.setCenterOnSelected(true)
    })

    const handleCancel = () => {
        map.setNewFeatureSpecies(null)
        ui.setShowLocationSelector(false)
    }

    const handleConfirm = () => {
        if (ui.locationSelectorAction === 'move') {
            const featureJson = {
                lon: map.center[0],
                lat: map.center[1],
            }
            axios
                .post(
                    `${settings.host}/tree/update/${map.selectedId}/`,
                    featureJson,
                    settings.authHeader
                )
                .then((response: AxiosResponse) => {
                    console.debug(response)
                    map.setNeedsUpdate(true)
                    ui.setShowLocationUpdated(true)
                })
                .catch((error) => {
                    console.error(error.response)
                    ui.setToastText('Verzoek mislukt')
                })
        } else {
            const featureJson = {
                species: map.newFeatureSpecies,
                lon: map.center[0],
                lat: map.center[1],
            }
            console.log('Trying to add feature', featureJson)

            axios
                .post(`${settings.host}/tree/add/`, featureJson, settings.authHeader)
                .then((response: AxiosResponse) => {
                    console.debug(response)
                    map.setNeedsUpdate(true)
                    ui.setToastText('Geslaagd!')
                })
                .catch((error) => {
                    console.error(error.response)
                    ui.setToastText('Verzoek mislukt')
                })
        }

        map.setNewFeatureSpecies(null)
        ui.setShowLocationSelector(false)
    }

    const headerText =
        ui.locationSelectorAction === 'move' ? 'Locatie bewerken' : 'Kies een locatie (nieuw)'

    return (
        <div className={classes.container}>
            <div className={classes.header}>{headerText}</div>

            <Crosshair />

            <div className={classes.footer}>
                <IonButton
                    className={classes.actionButton}
                    onClick={() => handleCancel()}
                    size="default"
                    fill="outline"
                >
                    Annuleren
                </IonButton>
                <IonButton
                    className={classes.actionButton}
                    onClick={() => handleConfirm()}
                    size="default"
                >
                    Bevestigen
                </IonButton>
            </div>
        </div>
    )
})
