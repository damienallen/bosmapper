import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'
import {
    IonIcon,
    IonSearchbar
} from '@ionic/react'
import { funnel } from 'ionicons/icons'

import { MenuToggle } from '../components/Menu'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 10,
        width: '100vw',
        maxWidth: 400,
        zIndex: 150,
    },
    bar: {
        width: '100%',
        borderRadius: 6,
        padding: 5,
        background: (searchBackground: string) => searchBackground,
        display: 'flex'
    },
    search: {
        flex: 1,
        padding: 0,
        height: 36,
        '--background': 'none'
    },
    menuToggle: {
        flex: '0 1',
        height: 36
    },
    filterToggle: {
        display: 'none',
        flex: '0 1',
        fontSize: '1.4em',
        lineHeight: '32px',
        color: '#999',
        padding: '14px 10px 14px 0'
    }
})

export const SearchBar: React.FC = observer(() => {
    const [searchText] = React.useState('')
    const { filter, map, ui } = useStores()

    const searchBackground = map.baseMap === 'drone' ?
        'rgba(255, 255, 255, 0.95)' : 'rgba(225, 225, 225, 0.95)'
    const classes = useStyles(searchBackground)

    return (
        <div className={classes.container}>
            <div className={classes.bar}>

                <IonSearchbar
                    className={classes.search}
                    value={searchText}
                    onIonChange={e => filter.setQuery(e.detail.value!)}
                    debounce={400}
                    placeholder="Zoeken"
                    mode="ios"
                />

                <div className={classes.filterToggle}>
                    <IonIcon icon={funnel} onClick={() => ui.setShowFilterModal(true)} />
                </div>

                <div className={classes.menuToggle}>
                    <MenuToggle />
                </div>

            </div>
        </div>
    )
})
