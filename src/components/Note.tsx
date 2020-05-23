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
        background: 'rgba(0, 0, 0, 0.1)'
    },
})

export const Note: React.FC = observer(() => {
    const classes = useStyles()
    const { map } = useStores()
    const [text, setText] = useState(map.selectedFeature.values_.notes)

    const updateNote = () => {
        console.log('Edit note')
    }

    return (
        <div className={classes.container}>
            <IonInput
                value={text}
                placeholder='Notitie toevoegen'
                onIonChange={(e: any) => setText(e.detail.value!)}
                onIonBlur={() => updateNote()}
                maxlength={80}
                mode='ios'
                clearInput
            ></IonInput>
        </div>
    )
})
