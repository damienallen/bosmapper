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
        padding: '5px 20px',
        background: 'rgba(0, 0, 0, 0.1)',
        position: 'relative'
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

        axios.post(`${settings.host}/tree/update/${map.selectedFeature.get('oid')}/`, featureJson)
            .then((response: AxiosResponse) => {
                console.debug(response)
                map.setNeedsUpdate(true)
                ui.setShowNotesUpdated(true)
            })
            .catch((error) => {
                console.error(error)
                ui.setToastText('Verzoek mislukt')
            })
    }

    // Blur input and submit on 'enter' press
    const onKeyPress = (e: any): void => {
        if (e.key === 'Enter') {
            e.target.blur()
        }
    }

    return (
        <div className={classes.container}>
            <IonInput
                value={text}
                disabled={ui.showNotesUpdated}
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
    )
})
