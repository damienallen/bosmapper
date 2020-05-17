import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'
import {
    IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonIcon, IonButton
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
    }
})

export const TreeDetail: React.FC = observer(() => {
    const { map } = useStores()
    const classes = useStyles()

    const speciesName = map.selectedFeature.values_.species
    const speciesData = getSpeciesData(speciesName)

    return (
        <div className={classes.container}>
            <IonCard className={classes.box}>

                <IonCardHeader>
                    <IonCardTitle>{speciesData.name_nl}</IonCardTitle>
                    <IonCardSubtitle className={classes.subtitle}>{speciesData.abbr}</IonCardSubtitle>
                </IonCardHeader>

                {/* <IonCardContent>
                    <IonIcon icon={addCircle} color="muted" />Voeg een notitie toe
                </IonCardContent> */}

                <IonItem>
                    <IonButton fill="outline" className={classes.moveButton}><IonIcon icon={move} /></IonButton>
                    <IonButton fill="outline">species wijzigen</IonButton>
                    <IonButton fill="outline" slot="end" color="danger">
                        <IonIcon icon={trash} color="danger" />
                    </IonButton>
                </IonItem>
            </IonCard>
        </div>
    )
})

// export const LoginPopover: React.FC = observer(() => {
//     const classes = useStyles()
//     const { ui } = useStores()

//     return (
//         <IonPopover
//             isOpen={ui.showLoginPopover}
//             onDidDismiss={(_e: any) => ui.setShowLoginPopover(false)}
//         >
//             <div className={classes.container}>

//                 <IonInput className={classes.input} placeholder="Email" />
//                 <IonInput className={classes.input} type="password" placeholder="Wachtwoord" />

//                 <IonButton className={classes.button}>Inloggen</IonButton>

//             </div>
//         </IonPopover>
//     )
// })
