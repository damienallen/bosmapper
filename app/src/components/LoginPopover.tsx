import {
    IonButton,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonInput,
    IonPopover,
} from '@ionic/react'
import Cookies from 'js-cookie'
import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'

import { useStores } from '../stores'

const useStyles = createUseStyles({
    container: {
        padding: 16,
        zIndex: 500,
    },
    button: {
        marginTop: 10,
        width: '100%',
    },
    input: {
        borderBottom: '1px solid rgba(0,0,0,0.13)',
        marginBottom: 10,
    },
    confirm: {
        padding: 0,
        marginBottom: 10,
    },
})

export const LoginPopover: React.FC = observer(() => {
    const classes = useStyles()
    const { settings, ui } = useStores()
    const [passcode, setPasscode] = useState('')

    const handleLogin = () => {
        const formData = new FormData()
        formData.append('username', 'bosmapper')
        formData.append('password', passcode)

        fetch(`${settings.host}/token/`, {
            method: 'POST',
            body: formData,
        }).then(async (response) => {
            if (!response.ok) {
                if (response.status >= 400 && response.status < 500) {
                    ui.setToastText('Ongeldige code')
                } else {
                    console.error(response)
                    ui.setToastText('Verzoek mislukt')
                }
            } else {
                const data = await response.json()
                const accessToken = data.access_token
                settings.setToken(accessToken)
                Cookies.set('token', accessToken, { expires: 30, sameSite: 'strict' })
                setPasscode('')
                ui.setShowLoginPopover(false)
            }
        })
    }

    const onKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleLogin()
    }

    const login = (
        <div className={classes.container}>
            <IonInput
                value={passcode}
                className={classes.input}
                onIonChange={(e: CustomEvent) => setPasscode(e.detail.value!)}
                onKeyDown={onKeyPress}
                placeholder="Login code"
            />
            <IonButton className={classes.button} onClick={() => handleLogin()}>
                Inloggen
            </IonButton>
        </div>
    )

    const handleLogout = () => {
        settings.clearToken()
        Cookies.remove('token')
        ui.setShowLoginPopover(false)
    }

    const logout = (
        <div className={classes.container}>
            <IonCardHeader className={classes.confirm}>
                <IonCardTitle>Zeker?</IonCardTitle>
                <IonCardSubtitle>Wilt u uitloggen?</IonCardSubtitle>
            </IonCardHeader>
            <IonButton color="danger" className={classes.button} onClick={() => handleLogout()}>
                Uitloggen
            </IonButton>
        </div>
    )

    return (
        <IonPopover isOpen={ui.showLoginPopover} onDidDismiss={() => ui.setShowLoginPopover(false)}>
            {settings.authenticated ? logout : login}
        </IonPopover>
    )
})
