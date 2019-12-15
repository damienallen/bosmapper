import React from 'react'
import { createUseStyles } from 'react-jss'

import { IonFab, IonFabButton, IonIcon } from '@ionic/react'
import { add } from 'ionicons/icons'


const useStyles = createUseStyles({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 5,
        zIndex: 150
    }
})

export const AddButton: React.FC = () => {

    const classes = useStyles()

    return (
        <div className={classes.container}>
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton>
                    <IonIcon icon={add} />
                </IonFabButton>
            </IonFab>
        </div>
    )
}


