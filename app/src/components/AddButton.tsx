import { IonFab, IonFabButton, IonIcon } from '@ionic/react'
import { add } from 'ionicons/icons'
import React from 'react'
import { createUseStyles } from 'react-jss'

import { useStores } from '../stores'

const useStyles = createUseStyles({
    fab: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        zIndex: 150,
        opacity: 0.9,
    },
})

export const AddButton: React.FC = () => {
    const { ui } = useStores()
    const classes = useStyles()

    return (
        <IonFab className={classes.fab} vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton color="light" onClick={() => ui.setShowSpeciesSelector(true)}>
                <IonIcon icon={add} />
            </IonFabButton>
        </IonFab>
    )
}
