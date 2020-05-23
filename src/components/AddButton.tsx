import React from 'react'
import { createUseStyles } from 'react-jss'
import { MobXProviderContext } from 'mobx-react'

import { IonFab, IonFabButton, IonIcon } from '@ionic/react'
import { add } from 'ionicons/icons'


const useStores = () => {
    return React.useContext(MobXProviderContext)
}

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
    const { ui } = useStores()
    const classes = useStyles()

    return (
        <IonFab
            className={classes.fab}
            vertical="bottom"
            horizontal="end"
            slot="fixed"
        >
            <IonFabButton color="light" onClick={() => ui.setShowSpeciesSelector(true)}>
                <IonIcon icon={add} />
            </IonFabButton>
        </IonFab>
    )
}


