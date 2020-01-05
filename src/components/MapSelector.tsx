import React from 'react'
import { createUseStyles } from 'react-jss'
import {
    IonLabel,
    IonListHeader
} from '@ionic/react'

const useStyles = createUseStyles({
    container: {
        width: '100%'
    },
})

export const MapSelector: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.container} >
            <IonListHeader>
                <IonLabel>Base Map</IonLabel>
            </IonListHeader>
        </div>
    )
}
