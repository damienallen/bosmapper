import React from 'react'
import { createUseStyles } from 'react-jss'
import {
    IonText
} from '@ionic/react'

import { version } from '../../package.json'

const useStyles = createUseStyles({
    container: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        '& div': {
            padding: '0 10px'
        }
    },
    footerItem: {
        fontSize: '0.7em',
        marginTop: 5
    },
    itemHeader: {
        textTransform: 'uppercase',
        opacity: 0.6
    },
    version: {
        marginBottom: 10,
        fontStyle: 'italic'
    }
})

export const MenuFooter: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <IonText color="medium">

                <div className={classes.version}>
                    v{version}
                </div>

                <div className={classes.footerItem}>
                    <span className={classes.itemHeader}>coding: </span>
                    Damien Allen
                </div>

                <div className={classes.footerItem}>
                    <span className={classes.itemHeader}>kaartgegevens: </span>
                    Voedseltuin Vrijwilligers
                </div>

                <div className={classes.footerItem}>
                    <span className={classes.itemHeader}>dronefoto: </span>
                    Gianna Campisano &amp; Taylan Bellen
                </div>

            </IonText>
        </div>
    )
}
