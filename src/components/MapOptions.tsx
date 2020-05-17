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
    const isCurrent = (map.version === 'current')

    const toggleMap = (e: any) => {
        if (e.target.checked) {
            map.setVersion('current')
        } else {
            map.setVersion('original')
        }
    }

    const toggleBaseMap = (e: any) => {
        if (e.target.checked) {
            map.setBaseMap('drone')
        } else {
            map.setBaseMap('vector')
        }
    }

    return (
        <div className={classes.container} >

            <IonListHeader>
                <IonLabel color="medium">Kaart</IonLabel>
            </IonListHeader>

            <IonItem>
                <IonText color={!isCurrent ? 'dark' : 'medium'}>Vector</IonText>
                <IonToggle name="version" color="dark" onIonChange={toggleBaseMap} checked={isDrone}></IonToggle>
                <IonText color={isCurrent ? 'dark' : 'medium'}>Drone</IonText>
            </IonItem>

            <IonItem>
                <IonText color={!isCurrent ? 'dark' : 'medium'}>Geplanned</IonText>
                <IonToggle name="version" color="dark" onIonChange={toggleMap} checked={isCurrent}></IonToggle>
                <IonText color={isCurrent ? 'dark' : 'medium'}>Actueel</IonText>
            </IonItem>

        </div>
    )
})
