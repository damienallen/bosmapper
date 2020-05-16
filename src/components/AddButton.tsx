import React from 'react'
import { createUseStyles } from 'react-jss'

import { IonFab, IonFabButton, IonIcon } from '@ionic/react'
import { add } from 'ionicons/icons'


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

    const classes = useStyles()

    return (
        <IonFab className={classes.fab} vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton>
                <IonIcon icon={add} />
            </IonFabButton>
        </IonFab>
    )
}


