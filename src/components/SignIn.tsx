import React from 'react'
import { createUseStyles } from 'react-jss'
import {
    IonButton,
    IonInput
} from '@ionic/react'

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

export const SignIn: React.FC = () => {
    const classes = useStyles()

    return (
        <div className={classes.container}>

            <IonInput className={classes.input} placeholder="Email address" />
            <IonInput className={classes.input} type="password" placeholder="Password" />

            <IonButton className={classes.button}>Sign In</IonButton>

        </div>
    )
}
