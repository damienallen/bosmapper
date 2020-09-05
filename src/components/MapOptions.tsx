import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'
import {
    IonItem,
    IonLabel,
    IonListHeader,
    IonText,
    IonToggle
} from '@ionic/react'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        width: '100%'
    }
})

export const MapOptions: React.FC = observer(() => {
    const classes = useStyles()
    const { map } = useStores()

    const isDrone = (map.baseMap === 'drone')
    const toggleBaseMap = (e: any) => {
        if (e.target.checked) {
            map.setBaseMap('drone')
        } else {
            map.setBaseMap('vector/v2')
        }
    }

    return (
        <div className={classes.container} >

            <IonListHeader>
                <IonLabel color="medium">Basis Kaart</IonLabel>
            </IonListHeader>

            <IonItem>
                <IonText color={!isDrone ? 'dark' : 'medium'}>Vector</IonText>
                <IonToggle name="version" color="dark" onIonChange={toggleBaseMap} checked={isDrone}></IonToggle>
                <IonText color={isDrone ? 'dark' : 'medium'}>Drone</IonText>
            </IonItem>

        </div>
    )
})
