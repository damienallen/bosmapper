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

    const isCurrent = (map.version === 'current')

    const toggleMap = (e: any) => {
        if (e.target.checked) {
            map.setVersion('current')
        } else {
            map.setVersion('original')
        }
    }

    return (
        <div className={classes.container} >

            <IonListHeader>
                <IonLabel color="medium">Kaart</IonLabel>
            </IonListHeader>

            <IonItem>
                <IonText color={!isCurrent ? 'dark' : 'medium'}>Geplanned</IonText>
                <IonToggle name="version" color="dark" onIonChange={toggleMap} checked={isCurrent}></IonToggle>
                <IonText color={isCurrent ? 'dark' : 'medium'}>Actueel</IonText>
            </IonItem>

        </div>
    )
})