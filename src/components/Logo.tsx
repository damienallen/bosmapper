import React from 'react'
import { createUseStyles } from 'react-jss'
import { IonImg } from '@ionic/react'

import logoDark from '../assets/logo_dark.png'

const useStyles = createUseStyles({
    container: {
        position: 'absolute',
        width: '30vw',
        maxWidth: 150,
        padding: '0 4px',
        top: 0,
        right: 0,
        background: 'rgba(255,255,255,0.8)',
        borderRadius: '0 0 0 4px',
        zIndex: 150
    }
})

export const Logo: React.FC = () => {

    const classes = useStyles()

    return (
        <div className={classes.container}>
            <IonImg src={logoDark} />
        </div>
    )
}
