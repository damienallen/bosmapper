import React from 'react'
// import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import { IonIcon } from '@ionic/react'
import { addCircleOutline, createOutline } from 'ionicons/icons'


const useStores = () => {
    return React.useContext(MobXProviderContext)
}

// const useStyles = createUseStyles({
//     container: {
//         padding: 20
//     },
// })

export const Note: React.FC = observer(() => {
    // const classes = useStyles()
    const { map } = useStores()

    const addNote = () => {
        console.log('add note')
    }

    return map.selectedFeature.values_.notes ?
        (
            <div onClick={addNote}>
                {map.selectedFeature.values_.notes} < IonIcon icon={createOutline} />
            </div>
        ) : (
            <div onClick={addNote}>
                <IonIcon icon={addCircleOutline} /> Notitie
            </div>
        )
})
