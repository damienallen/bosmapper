import React, { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import {
    IonButton,
    IonInput,
    IonPopover
} from '@ionic/react'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        padding: 20
    },
    button: {
        marginTop: 10,
        width: '100%'
    },
    input: {
        borderBottom: '1px solid rgba(0,0,0,0.13)',
        marginBottom: 10,
    }
})

export const SignIn: React.FC = observer(() => {
    const classes = useStyles()
    const { ui } = useStores()

    useEffect(() => {
        return () => {
            ui.setShowLoginPopover(false)
        }
    })

    return (
        <IonPopover
            isOpen={ui.showLoginPopover}
            onDidDismiss={(_e: any) => ui.setShowLoginPopover(false)}
        >
            <div className={classes.container}>

                <IonInput className={classes.input} placeholder="Email" />
                <IonInput className={classes.input} type="password" placeholder="Wachtwoord" />

                <IonButton className={classes.button}>Inloggen</IonButton>

            </div>
        </IonPopover>
    )
})
