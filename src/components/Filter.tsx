import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
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

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        width: '100%',
        paddingBottom: 8
    },
    range: {
        padding: '28px 14px 0 14px'
    },
    large: {
        fontSize: '2em'
    },
    queryInput: {
        margin: '0 15px',
        padding: '0 10px !important',
        borderRadius: 4
    }
})

export const Filter: React.FC = observer(() => {
    const classes = useStyles()
    const { filter } = useStores()

    return (
        <div className={classes.container}>
            <IonListHeader>
                <IonLabel color="medium">Filteren</IonLabel>
            </IonListHeader>

            <IonItem>
                <IonRange
                    className={classes.range} dualKnobs={true}
                    onIonChange={(e: any) => filter.setWidthRange(e.target.value.lower, e.target.value.upper)}
                    min={0} max={20}
                    value={{ lower: 0, upper: 20 }}
                    pin color="dark"
                >
                    <IonNote slot="start"><IonIcon icon={radioButtonOff} /></IonNote>
                    <IonNote slot="end" className={classes.large}><IonIcon icon={radioButtonOff} /></IonNote>
                </IonRange>
            </IonItem>

            <IonItem>
                <IonRange
                    className={classes.range} dualKnobs={true}
                    onIonChange={(e: any) => filter.setHeightRange(e.target.value.lower, e.target.value.upper)}
                    min={0} max={30}
                    value={{ lower: 0, upper: 30 }}
                    pin color="dark"
                >
                    <IonNote slot="start"><GiFruitTree /></IonNote>
                    <IonNote slot="end" className={classes.large} ><GiFruitTree /></IonNote>
                </IonRange>
            </IonItem>

        </div>
    )
})
