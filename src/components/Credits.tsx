import React from 'react'
import { createUseStyles } from 'react-jss'
import {
    IonText
} from '@ionic/react'


const useStyles = createUseStyles({
    container: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        '& div': {
            padding: '0 20px'
        }
    },
    footerItem: {
        fontSize: '0.9em',
        marginTop: 5
    },
    itemHeader: {
        textTransform: 'uppercase',
        opacity: 0.8
    }
})

export const Credits: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <IonText color="medium">

                <div className={classes.footerItem}>
                    <span className={classes.itemHeader}>coding en ontwerp: </span>
                    Damien Allen
                </div>

                <div className={classes.footerItem}>
                    <span className={classes.itemHeader}>kaartgegevens: </span>
                    Voedseltuin vrijwilligers
                </div>

                <div className={classes.footerItem}>
                    <span className={classes.itemHeader}>dronefoto: </span>
                    Gianna Campisano &amp; Taylan Bellen
                </div>

            </IonText>
        </div>
    )
}
