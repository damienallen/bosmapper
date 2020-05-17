import React, { useState } from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'
import {
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonIcon, IonButton, IonPopover
} from '@ionic/react'
import { move, trash } from 'ionicons/icons'

import { getSpeciesData } from '../utilities/FeatureHelpers'

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
    moveButton: {
        marginRight: 10
    },
    actionButtons: {
        display: 'flex',
        padding: '0 5px 10px 5px'
    },
    actionButton: {
        flex: 1,
        margin: '0 5px'
    }
})

export const TreeDetail: React.FC = observer(() => {
    const [showRemovePopover, setShowRemovePopover] = useState(false)
    const { map } = useStores()
    const classes = useStyles()

    const speciesName = map.selectedFeature.values_.species
    const speciesData = getSpeciesData(speciesName)

    const confirmRemove = () => {
        console.log('Removing feature', map.selectedFeature.values_.fid)
        setShowRemovePopover(false)
    }

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
                    <IonCardTitle>{speciesData.name_nl}</IonCardTitle>
                    <IonCardSubtitle className={classes.subtitle}>{speciesData.abbr}</IonCardSubtitle>
                </IonCardHeader>

                <IonItem>
                    <IonButton fill="outline" className={classes.moveButton}><IonIcon icon={move} /></IonButton>
                    <IonButton fill="outline">species wijzigen</IonButton>
                    <IonButton fill="outline" slot="end" color="danger" onClick={() => setShowRemovePopover(true)}>
                        <IonIcon icon={trash} color="danger" />
                    </IonButton>
                </IonItem>
            </IonCard>
        </div>
    )
})

