import { IonIcon, IonItem, IonLabel } from '@ionic/react'
import { informationCircleOutline, logInOutline, logOutOutline } from 'ionicons/icons'
import { observer } from 'mobx-react'
import React from 'react'
import { createUseStyles } from 'react-jss'

import { useStores } from '../stores'

const useStyles = createUseStyles({
    container: {
        width: '100%',
        fontSize: '0.8em',
    },
    icon: {
        cursor: 'pointer',
    },
})

export const UserBar: React.FC = observer(() => {
    const { settings, ui } = useStores()
    const classes = useStyles()

    const actionIcon = settings.authenticated ? logOutOutline : logInOutline
    const statusText = settings.authenticated ? 'Admin gebruiker' : 'Gast gebruiker'

    return (
        <IonItem
            color={settings.authenticated ? 'secondary' : 'tertiary'}
            className={classes.container}
            lines="none"
        >
            <IonLabel>{statusText}</IonLabel>
            <IonIcon
                className={classes.icon}
                onClick={() => ui.setShowAboutModal(true)}
                icon={informationCircleOutline}
                slot="end"
            />
            <IonIcon
                className={classes.icon}
                onClick={() => ui.setShowLoginPopover(true)}
                icon={actionIcon}
                slot="end"
            />
        </IonItem>
    )
})
