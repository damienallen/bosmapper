import React from 'react'
import { createUseStyles } from 'react-jss'
import { MobXProviderContext } from 'mobx-react'
import {
    IonText
} from '@ionic/react'

import { version } from '../../package.json'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        textAlign: 'center',
        '& div': {
            padding: '0 10px'
        }
    },
    footerItem: {
        display: 'inline-block'
    }
})

export const MenuFooter: React.FC = () => {
    const classes = useStyles()
    const { ui } = useStores()

    return (
        <div className={classes.container}>
            <IonText color="medium">
                <div className={classes.footerItem} onClick={() => ui.setShowLicenseModal(true)}>
                    MIT License
                </div>
                &bull;
                <div className={classes.footerItem}>
                    v{version}
                </div>
            </IonText>
        </div>
    )
}
