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
        textAlign: 'center',
        '& span': {
            padding: '0 10px'
        }
    },
})

export const MenuFooter: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <IonText color="medium">
                <span>MIT License</span> &bull; <span>v0.1.0</span>
            </IonText>
        </div>
    )
}
