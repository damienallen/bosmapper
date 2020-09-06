import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'
import {
    IonLabel,
    IonListHeader
} from '@ionic/react'

import droneBackground from '../assets/drone_bg.png'
import vectorBackground from '../assets/vector_bg.png'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        width: '100%'
    },
    mapButtonContainer: {
        display: 'flex',
        padding: '0 8px'
    },
    mapButton: {
        flex: 1,
        position: 'relative',
        margin: '0 8px',
        border: '2px solid #ddd',
        borderRadius: 10,
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'pointer',
        opacity: 0.6
    },
    buttonBackground: {
        display: 'block'
    },
    buttonLabel: {
        position: 'absolute',
        textTransform: 'uppercase',
        right: 8,
        bottom: 8,
        fontSize: '0.8em',
        fontWeight: 'bold'
    },
    selected: {
        border: '2px solid #888',
        opacity: 1
    }
})

export const MapOptions: React.FC = observer(() => {
    const classes = useStyles()
    const { map } = useStores()

    const isDrone = (map.baseMap === 'drone')
    const mapButtonClass = (selected: boolean) => (
        selected ? `${classes.mapButton} ${classes.selected}` : classes.mapButton
    )

    return (
        <div className={classes.container} >

            <IonListHeader>
                <IonLabel color="medium">Basis Kaart</IonLabel>
            </IonListHeader>

            <div className={classes.mapButtonContainer}>
                <div className={mapButtonClass(isDrone)} onClick={() => map.setBaseMap('drone')}>
                    <div className={classes.buttonLabel} style={{ color: '#fff' }}>drone</div>
                    <img className={classes.buttonBackground} src={droneBackground} alt="Drone" />
                </div>
                <div className={mapButtonClass(!isDrone)} onClick={() => map.setBaseMap('vector/v2')}>
                    <div className={classes.buttonLabel} style={{ color: '#888' }}>vector</div>
                    <img className={classes.buttonBackground} src={vectorBackground} alt="Vector" />
                </div>
            </div>

        </div>
    )
})
