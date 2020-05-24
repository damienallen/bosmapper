import React from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import {
    IonButton,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonInput,
    IonPopover
} from '@ionic/react'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        padding: 16,
        zIndex: 500
    },
    button: {
        marginTop: 10,
        width: '100%'
    },
    input: {
        borderBottom: '1px solid rgba(0,0,0,0.13)',
        marginBottom: 10,
    },
    confirm: {
        padding: 0,
        marginBottom: 10,
    }
})

export const LoginPopover: React.FC = observer(() => {
    const classes = useStyles()
    const { settings, ui } = useStores()

    const handleLogin = () => {
        settings.setToken('123')
        ui.setShowLoginPopover(false)
    }

    const login = (
        <div className={classes.container}>
            <IonInput className={classes.input} placeholder="Email" />
            <IonInput className={classes.input} type="password" placeholder="Wachtwoord" />
            <IonButton className={classes.button} onClick={() => handleLogin()}>Inloggen</IonButton>
        </div>
    )

    const handleLogout = () => {
        settings.clearToken()
        ui.setShowLoginPopover(false)
    }

    const logout = (
        <div className={classes.container}>
            <IonCardHeader className={classes.confirm}>
                <IonCardTitle>Zeker?</IonCardTitle>
                <IonCardSubtitle>Wilt u uitloggen?</IonCardSubtitle>
            </IonCardHeader>
            <IonButton color='danger' className={classes.button} onClick={() => handleLogout()}>Uitloggen</IonButton>
        </div>
    )

    return (
        <IonPopover
            isOpen={ui.showLoginPopover}
            onDidDismiss={(_e: any) => ui.setShowLoginPopover(false)}
        >
            {settings.authenticated ? logout : login}
        </IonPopover>
    )
})
