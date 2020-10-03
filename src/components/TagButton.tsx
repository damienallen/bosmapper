import React from 'react'
import { createUseStyles } from 'react-jss'
import { MobXProviderContext } from 'mobx-react'

import { IonFab, IonFabButton, IonIcon } from '@ionic/react'
import { pricetagOutline } from 'ionicons/icons'


const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    fab: {
        position: 'absolute',
        top: -28,
        right: 14,
        zIndex: 150,
        opacity: 0.9
    }
})

export const TagButton: React.FC = () => {
    const { ui } = useStores()
    const classes = useStyles()

    return (
        <IonFab
            className={classes.fab}
        >
            <IonFabButton color="light" onClick={() => ui.setShowSpeciesSelector(true)}>
                <IonIcon icon={pricetagOutline} />
            </IonFabButton>
        </IonFab>
    )
}


