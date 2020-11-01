import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'
import { IonSearchbar } from '@ionic/react'

import { MenuToggle } from './Menu'


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
        border: (props: StyleProps) => props.border,
        borderRadius: 4,
        padding: 5,
        background: (props: StyleProps) => props.background,
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
    }
})

interface StyleProps {
    border: 'string',
    background: 'string',
}

export const SearchBar: React.FC = observer(() => {
    const [searchText] = React.useState('')
    const { species, map, ui } = useStores()

    const styleProps = {
        border: map.searchBorder,
        background: map.overlayBackground,
    }
    const classes = useStyles(styleProps)

    const onKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') (e.target as HTMLIonSearchbarElement).blur()
    }

    return (
        <div className={classes.container}>
            <div className={classes.bar}>

                <IonSearchbar
                    className={classes.search}
                    value={searchText}
                    onIonChange={e => species.setQuery(e.detail.value!)}
                    onIonFocus={e => {
                        ui.setShowTreeDetails(false)
                        map.setSelectedFeature(undefined)
                    }}
                    onKeyDown={onKeyPress}
                    debounce={400}
                    placeholder='Zoeken'
                    mode='ios'
                />

                <div className={classes.menuToggle}>
                    <MenuToggle />
                </div>

            </div>
        </div>
    )
})
