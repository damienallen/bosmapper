import React from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import {
    IonButtons,
    IonHeader,
    IonIcon,
    IonModal,
    IonToolbar,
    IonPage,
    IonTitle
} from '@ionic/react'
import { close } from 'ionicons/icons'

import { Filter } from './Filter'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        padding: 20
    },
    toolbarButtons: {
        marginRight: 20
    }
})

export const FilterModal: React.FC = observer(() => {
    const classes = useStyles()
    const { ui } = useStores()

    return (
        <IonModal
            isOpen={ui.showFilterModal}
            onDidDismiss={_e => ui.setShowFilterModal(false)}
        >
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Filter</IonTitle>
                        <IonButtons className={classes.toolbarButtons} slot="end">
                            <IonIcon onClick={() => ui.setShowFilterModal(false)} icon={close} />
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <Filter />

            </IonPage>
        </IonModal>
    )
})
