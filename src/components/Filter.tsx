import React from 'react'
import { createUseStyles } from 'react-jss'
import {
    IonIcon,
    IonItem,
    IonLabel,
    IonListHeader,
    IonNote,
    IonRange
} from '@ionic/react'
import { radioButtonOff } from 'ionicons/icons'
import { GiFruitTree } from 'react-icons/gi'

const useStyles = createUseStyles({
    container: {
        width: '100%'
    },
    range: {
        padding: 8
    },
    large: {
        fontSize: '2em'
    }
})

export const Filter: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.container} >
            <IonListHeader>
                <IonLabel>Filter</IonLabel>
            </IonListHeader>

            <IonItem>
                <IonRange className={classes.range} dualKnobs={true} value={{ lower: 33, upper: 60 }} pin color="dark">
                    <IonNote slot="start"><IonIcon icon={radioButtonOff} /></IonNote>
                    <IonNote slot="end" className={classes.large}><IonIcon icon={radioButtonOff} /></IonNote>
                </IonRange>
            </IonItem>

            <IonItem>
                <IonRange className={classes.range} dualKnobs={true} value={{ lower: 33, upper: 60 }} pin color="dark">
                    <IonNote slot="start"><GiFruitTree /></IonNote>
                    <IonNote slot="end" className={classes.large} ><GiFruitTree /></IonNote>
                </IonRange>
            </IonItem>

        </div>
    )
}
