import React from 'react'
import { createUseStyles } from 'react-jss'
import { IonImg } from '@ionic/react'

import logoDark from '../assets/logo_dark.png'

const useStyles = createUseStyles({
    container: {
        width: '100%',
        padding: 8,
        borderBottom: '1px solid rgba(0,0,0,0.13)',
        marginBottom: 8
    },
    logo: {
        maxWidth: 150
    }
})

export const Logo: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <IonImg className={classes.logo} src={logoDark} />
        </div>
    )
}
