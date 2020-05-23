import axios, { AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'
import {
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonIcon, IonButton, IonPopover
} from '@ionic/react'
import { cloudDone, move, trash } from 'ionicons/icons'

import { Note } from './Note'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100vw',
        maxWidth: 400,
        zIndex: 150,
    },
    box: {
        background: 'rgba(255, 255, 255, 0.9)'
    },
    subtitle: {
        marginTop: 5,
        fontStyle: 'italic',
        fontWeight: 400
    },
    actionButtons: {
        display: 'flex',
        padding: '0 5px 10px 5px'
    },
    actionButton: {
        flex: 1,
        margin: '0 5px'
    },
    featureActions: {
        display: 'flex',
        padding: '15px 5px 5px 5px',
        background: '#fff'
    },
    labelButton: {
        flex: '0 1'
    },
    iconButtons: {
        flex: '0 1',
        marginLeft: 'auto',
        display: 'flex'
    },
    updated: {
        position: 'absolute',
        right: 15,
        top: 15,
        fontSize: '1.5em'
    }
})

export const TreeDetail: React.FC = observer(() => {
    const [showRemovePopover, setShowRemovePopover] = useState(false)
    const { map, settings, ui } = useStores()
    const classes = useStyles()

    const speciesData = map.selectedFeature.values_

    const confirmRemove = () => {
        const oid = map.selectedFeature.values_.oid
        console.log('Removing feature', oid)

        axios.post(`${settings.host}/tree/remove/${oid}/`)
            .then((response: AxiosResponse) => {
                console.debug(response)
                map.setNeedsUpdate(true)
                ui.setShowTreeDetails(false)
                ui.setToastText('Geslaagd!')
            })
            .catch((error) => {
                console.error(error)
                ui.setToastText('Verzoek mislukt')
            })


        setShowRemovePopover(false)
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
            <IonIcon icon={move} />
        </IonButton>
    )

    const deleteButton = (
        <IonButton
            fill="outline"
            size="small"
            color="danger"
            onClick={() => setShowRemovePopover(true)}
        >
            <IonIcon icon={trash} color="danger" />
        </IonButton>
    )

    return (
        <div className={classes.container}>
            <IonPopover
                isOpen={showRemovePopover}
                onDidDismiss={(_e: any) => setShowRemovePopover(false)}
            >
                <IonCardHeader>
                    <IonCardTitle>Zeker?</IonCardTitle>
                    <IonCardSubtitle>Wilt u dit boom verwijderen?</IonCardSubtitle>
                </IonCardHeader>

                <div className={classes.actionButtons}>
                    <IonButton
                        className={classes.actionButton}
                        onClick={() => setShowRemovePopover(false)}
                        size="default"
                    >
                        Nee, ga terug
                    </IonButton>
                    <IonButton
                        className={classes.actionButton}
                        onClick={confirmRemove}
                        size="default"
                        color="danger"
                        fill="outline"
                    >
                        Ja
                    </IonButton>
                </div>

            </IonPopover>

            <IonCard className={classes.box}>

                <IonCardHeader>
                    <IonCardTitle>{speciesData.name_nl ? speciesData.name_nl : speciesData.species}</IonCardTitle>
                    <IonCardSubtitle className={classes.subtitle}>{speciesData.name_la}</IonCardSubtitle>
                </IonCardHeader>

                <Note />
                {ui.showDetailsUpdated ? <IonIcon color='success' className={classes.updated} icon={cloudDone} /> : null}

                <div className={classes.featureActions}>
                    {changeSpeciesButton}

                    <div className={classes.iconButtons}>
                        {moveButton}
                        {deleteButton}
                    </div>
                </div>
            </IonCard>
        </div>
    )
})

