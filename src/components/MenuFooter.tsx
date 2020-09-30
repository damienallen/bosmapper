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
            padding: '0 20px'
        }
    },
    version: {
        fontStyle: 'italic',
        textAlign: 'right'
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
            </IonText>
        </div>
    )
}
