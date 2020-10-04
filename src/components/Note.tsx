import axios, { AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import { IonInput } from '@ionic/react'


const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        padding: '5px 16px',
        background: 'rgba(0, 0, 0, 0.1)',
        position: 'relative'
    },
    readonly: {
        padding: '10px 16px',
        background: 'rgba(0, 0, 0, 0.1)'
    }
})

export const Note: React.FC = observer(() => {
    const classes = useStyles()
    const { map, settings, ui } = useStores()
    const [text, setText] = useState(map.selectedFeature.get('notes'))

    const updateNote = () => {
        const featureJson = {
            notes: text
        }

        axios.post(`${settings.host}/tree/update/${map.selectedFeature.get('oid')}/`, featureJson, settings.authHeader)
            .then((response: AxiosResponse) => {
                console.debug(response)
                map.setNeedsUpdate(true)
                ui.setShowMetaUpdated(true)
            })
            .catch((error) => {
                console.error(error.response)
                ui.setToastText('Verzoek mislukt')
            })
    }

    // Blur input and submit on 'enter' press
    const onKeyPress = (e: any): void => {
        if (e.key === 'Enter') e.target.blur()
    }

    const readonlyNote = map.selectedFeature.get('notes') ?
        (
            <div className={classes.readonly}>
                {map.selectedFeature.get('notes')}
            </div>
        ) : null

    return settings.authenticated ?
        (
            <div className={classes.container}>
                <IonInput
                    value={text}
                    disabled={ui.showMetaUpdated}
                    placeholder='Notitie toevoegen'
                    enterkeyhint='done'
                    onIonChange={(e: any) => setText(e.detail.value!)}
                    onIonBlur={() => updateNote()}
                    onKeyDown={onKeyPress}
                    maxlength={80}
                    mode='ios'
                    clearInput
                ></IonInput>
            </div>
        ) : readonlyNote

})
