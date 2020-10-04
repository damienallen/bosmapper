import React from 'react'
import { createUseStyles } from 'react-jss'
import { MobXProviderContext, observer } from 'mobx-react'

import { IonButton, IonIcon, IonPopover } from '@ionic/react'
import { pricetagOutline } from 'ionicons/icons'


const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 150,
        opacity: 0.5
    },
    tagButton: {
        textTransform: 'lowercase',
        fontWeight: '400'
    },
    tagText: {
        marginLeft: 5
    }
})

export const TagSelector: React.FC = observer(() => {
    const { ui } = useStores()
    return (
        <IonPopover
            isOpen={ui.showTagsPopover}
            onDidDismiss={(_e: any) => ui.setShowTagsPopover(false)}
        >
            Hello
        </IonPopover>
    )
})

export const Tags: React.FC = observer(() => {
    const { map, ui } = useStores()
    const classes = useStyles()

    const tagsList = map.selectedFeature.get('tags')
    const tags = tagsList.length ? (
        <div className={classes.tagText}>{tagsList}</div>
    ) : null

    return (
        <div className={classes.container}>
            <TagSelector />
            <IonButton color="medium" size="small" className={classes.tagButton} onClick={() => ui.setShowTagsPopover(true)}>
                {tags}
                <IonIcon icon={pricetagOutline} />
            </IonButton>
        </div>
    )
})


