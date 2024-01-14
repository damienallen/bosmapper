import {
    IonButton,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonInput,
    IonPopover,
} from '@ionic/react'
import { MobXProviderContext, observer } from 'mobx-react'
import React, { useState } from 'react'
import axios, { AxiosResponse } from 'axios'

import Cookies from 'universal-cookie'
import { createUseStyles } from 'react-jss'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

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
    const cookies = new Cookies()

    const handleLogin = () => {
        const formData = new FormData()
        formData.append('username', 'bosmapper')
        formData.append('password', passcode)

        axios
            .post(`${settings.host}/token/`, formData)
            .then((response: AxiosResponse) => {
                const accessToken = response.data.access_token
                settings.setToken(accessToken)
                cookies.set('token', accessToken, { sameSite: 'strict' })
                setPasscode('')
                ui.setShowLoginPopover(false)
            })
            .catch((error) => {
                if (error.response.status >= 400 && error.response.status < 500) {
                    ui.setToastText('Ongeldige code')
                } else {
                    console.error(error.response)
                    ui.setToastText('Verzoek mislukt')
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
        cookies.remove('token')
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
