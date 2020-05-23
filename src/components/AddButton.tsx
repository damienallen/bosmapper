import React from 'react'
import { createUseStyles } from 'react-jss'
import { MobXProviderContext } from 'mobx-react'

import { IonFab, IonFabButton, IonIcon } from '@ionic/react'
import { add } from 'ionicons/icons'

import { fetchSpecies } from '../utilities/SpeciesHelper'


const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    fab: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        zIndex: 150,
        opacity: 0.9
    }
})

export const AddButton: React.FC = () => {
    const { root, species, ui } = useStores()
    const classes = useStyles()

    const checkSpecies = () => {
        if (species.count > 0) {
            ui.setShowSpeciesModal(true)
        } else {
            ui.setToastText('Probeert de soortenlijst van de server op te halen.')
            fetchSpecies(root)
        }
    }

    return (
        <IonFab className={classes.fab} vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => checkSpecies()}>
                <IonIcon icon={add} />
            </IonFabButton>
        </IonFab>
    )
}


