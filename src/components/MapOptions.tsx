import React from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import {
    IonItem,
    IonLabel,
    IonListHeader,
    IonToggle
} from '@ionic/react'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        width: '100%'
    },
    selected: {
        fontWeight: 'bold'
    }
})

export const MapOptions: React.FC = observer(() => {
    const classes = useStyles()
    const { map } = useStores()

    const showCurrent = (map.version === 'current')

    return (
        <div className={classes.container} >

            <IonListHeader>
                <IonLabel color="medium">Map</IonLabel>
            </IonListHeader>

            <IonItem>
                <div className={!showCurrent ? classes.selected : undefined}>Original</div>
                <IonToggle name="version" color="primary" checked></IonToggle>
                <div className={showCurrent ? classes.selected : undefined}>Current</div>
            </IonItem>

        </div>
    )
})
