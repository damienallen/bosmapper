import { IonInput } from '@ionic/react'
import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'

import { useStores } from '../stores'

const useStyles = createUseStyles({
    container: {
        padding: '5px 16px',
        background: 'rgba(0, 0, 0, 0.1)',
        position: 'relative',
    },
    readonly: {
        padding: '10px 16px',
        background: 'rgba(0, 0, 0, 0.1)',
    },
})

export const Note: React.FC = observer(() => {
    const classes = useStyles()
    const { map, settings, ui } = useStores()
    const [text, setText] = useState(map.selectedFeature?.get('notes'))

    const updateNote = () => {
        const featureJson = {
            notes: text,
        }

        fetch(`${settings.host}/tree/update/${map.selectedId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(settings.authHeader.headers || {}),
            },
            body: JSON.stringify(featureJson),
        })
            .then(async (response) => {
                if (!response.ok) throw new Error(await response.text())
                map.setNeedsUpdate(true)
                ui.setShowMetaUpdated(true)
            })
            .catch((error) => {
                console.error(error)
                ui.setToastText('Verzoek mislukt')
            })
    }

    // Blur input and submit on 'enter' press
    const onKeyPress = (e: React.KeyboardEvent): void => {
        if (e.key === 'Enter') (e.target as HTMLIonInputElement).blur()
    }

    const readonlyNote = map.selectedFeature?.get('notes') ? (
        <div className={classes.readonly}>{map.selectedFeature.get('notes')}</div>
    ) : null

    return settings.authenticated ? (
        <div className={classes.container}>
            <IonInput
                value={text}
                disabled={ui.showMetaUpdated}
                placeholder="Notitie toevoegen"
                enterkeyhint="done"
                onIonChange={(e: CustomEvent) => setText(e.detail.value!)}
                onIonBlur={() => updateNote()}
                onKeyDown={onKeyPress}
                maxlength={80}
                mode="ios"
                clearInput
            ></IonInput>
        </div>
    ) : (
        readonlyNote
    )
})
