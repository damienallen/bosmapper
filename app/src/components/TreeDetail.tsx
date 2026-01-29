import {
    IonActionSheet,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonIcon,
} from '@ionic/react'
import axios, { AxiosResponse } from 'axios'
import { cloudDone, move, trash } from 'ionicons/icons'
import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { useStores } from '../stores'
import { Note } from './Note'
import { Tags } from './Tags'

const useStyles = createUseStyles({
    container: {
        position: 'absolute',
        bottom: 0,
        left: '50%',
        width: '100vw',
        maxWidth: 400,
        zIndex: 150,
        transform: 'translateX(-50%)',
    },
    box: {
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.95)',
    },
    subtitle: {
        marginTop: 5,
        fontStyle: 'italic',
        fontWeight: 400,
    },
    actionButtons: {
        display: 'flex',
        padding: '0 5px 10px 5px',
    },
    actionButton: {
        flex: 1,
        margin: '0 5px',
    },
    featureActions: {
        display: 'flex',
        padding: '15px 5px 5px 5px',
        background: '#fff',
    },
    labelButton: {
        flex: '0 1',
    },
    iconButtons: {
        flex: '0 1',
        marginLeft: 'auto',
        display: 'flex',
    },
    updated: {
        position: 'absolute',
        right: 15,
        top: 15,
        fontSize: '1.5em',
    },
})

export const TreeDetail: React.FC = observer(() => {
    const [showActionSheet, setShowActionSheet] = useState(false)
    const { map, settings, ui } = useStores()
    const classes = useStyles()

    const speciesData = map.selectedFeature!.getProperties()

    const confirmRemove = () => {
        const oid = map.selectedId
        console.debug('Removing feature', oid)

        axios
            .post(`${settings.host}/tree/remove/${oid}/`, null, settings.authHeader)
            .then((response: AxiosResponse) => {
                console.debug(response)
                map.setNeedsUpdate(true)
                ui.setShowTreeDetails(false)
                map.setSelectedFeature(undefined)
                ui.setToastText('Geslaagd!')
            })
            .catch((error) => {
                console.error(error.response)
                ui.setToastText('Verzoek mislukt')
            })

        setShowActionSheet(false)
    }

    const confirmDead = (dead: boolean) => {
        const oid = map.selectedId
        console.debug('Marking feature dead', oid)

        const featureJson = {
            dead: dead,
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
                ui.setShowTreeDetails(false)
                map.setSelectedFeature(undefined)
                ui.setToastText('Geslaagd!')
            })
            .catch((error) => {
                console.error(error.response)
                ui.setToastText('Verzoek mislukt')
            })

        setShowActionSheet(false)
    }

    // Action buttons
    const changeSpeciesButton = (
        <IonButton
            fill="outline"
            size="small"
            className={classes.labelButton}
            onClick={() => ui.setShowSpeciesSelector(true, 'update')}
            disabled={ui.showSpeciesUpdated}
        >
            Soort bewerken
        </IonButton>
    )

    const moveButton = (
        <IonButton
            fill="outline"
            size="small"
            onClick={() => ui.setShowLocationSelector(true, 'move')}
            disabled={ui.showLocationUpdated}
        >
            <IonIcon icon={move} aria-label="Verplaatsen" />
        </IonButton>
    )

    const deleteButton = (
        <IonButton
            fill="outline"
            size="small"
            color="danger"
            onClick={() => setShowActionSheet(true)}
        >
            <IonIcon icon={trash} color="danger" aria-label="Verwijderen" />
        </IonButton>
    )

    const actionsArea = settings.authenticated ? (
        <div className={classes.featureActions}>
            {changeSpeciesButton}

            <div className={classes.iconButtons}>
                {moveButton}
                {deleteButton}
            </div>
        </div>
    ) : null

    const actionSheetButtons = speciesData.dead
        ? [
              {
                  text: 'Leeft nog!',
                  handler: () => confirmDead(false),
              },
              {
                  text: 'Verwijderen',
                  role: 'destructive',
                  handler: confirmRemove,
              },
              {
                  text: 'Nee, ga terug',
                  role: 'cancel',
                  handler: () => setShowActionSheet(false),
              },
          ]
        : [
              {
                  text: 'Ja, dood!',
                  role: 'destructive',
                  handler: () => confirmDead(true),
              },
              {
                  text: 'Verwijderen',
                  role: 'destructive',
                  handler: confirmRemove,
              },
              {
                  text: 'Nee, ga terug',
                  role: 'cancel',
                  handler: () => setShowActionSheet(false),
              },
          ]

    return (
        <div className={classes.container}>
            <Tags />

            <IonActionSheet
                isOpen={showActionSheet}
                onDidDismiss={() => setShowActionSheet(false)}
                header="Zeker?"
                buttons={actionSheetButtons}
            ></IonActionSheet>

            <IonCard className={classes.box} mode="md">
                <IonCardHeader mode="md">
                    <IonCardTitle>
                        {speciesData.name_nl ? speciesData.name_nl : speciesData.species}
                    </IonCardTitle>
                    <IonCardSubtitle className={classes.subtitle}>
                        {speciesData.name_la}
                    </IonCardSubtitle>
                </IonCardHeader>

                {ui.showDetailsUpdated ? (
                    <IonIcon
                        color="medium"
                        className={classes.updated}
                        icon={cloudDone}
                        aria-hidden="true"
                    />
                ) : null}

                <Note />
                {actionsArea}
            </IonCard>
        </div>
    )
})
