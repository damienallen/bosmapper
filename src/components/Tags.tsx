import axios, { AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { toJS } from 'mobx'
import { MobXProviderContext, observer } from 'mobx-react'

import { IonButton, IonIcon, IonItem, IonLabel, IonPopover, IonItemDivider } from '@ionic/react'
import { checkboxOutline, closeOutline, pricetagOutline, squareOutline } from 'ionicons/icons'


const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        position: 'absolute',
        top: -27,
        right: 25,
        opacity: 0.9
    },
    popover: {
        '& ion-item': {
            cursor: 'pointer'
        },
        '& ion-icon': {
            marginRight: 5
        }
    },
    tagButton: {
        textTransform: 'lowercase',
        fontWeight: '400',
        zIndex: 50
    },
    tagText: {
        marginLeft: 5
    },
    divider: {
        fontWeight: 400,
        fontSize: '0.9em',
        opacity: 0.7,
        '& ion-icon': {
            marginRight: 12,
        }
    }
})

export const tagTypes = [
    {
        key: 'unsure',
        text: 'Onzeker'
    },
    {
        key: 'dry',
        text: 'Droog'
    },
    {
        key: 'temporary',
        text: 'Tijdelijk'
    },
    {
        key: 'attn_needed',
        text: 'Aandacht nodig'
    },
]

export const Tags: React.FC = observer(() => {
    const [showTagsPopover, setShowTagsPopover] = useState<{ open: boolean, event: Event | undefined }>({
        open: false,
        event: undefined,
    })

    const { map, settings, ui } = useStores()
    const classes = useStyles()

    const featureTags = toJS(map.selectedFeature.get('tags'))
    const tagsList = featureTags.length ? (
        <div className={classes.tagText}>{featureTags.join(', ')}</div>
    ) : null

    const updateTags = (key: string) => {
        const oid = map.selectedFeature.get('oid')
        console.log('Updating feature tags', oid)

        if (featureTags.includes(key)) {
            featureTags.pop(key)
        } else {
            featureTags.push(key)
        }

        const featureJson = {
            tags: featureTags
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

    const tags = tagTypes.map((type: any) => (
        < IonItem key={type.key} lines="none" onClick={() => updateTags(type.key)}>
            <IonIcon
                color={featureTags.includes(type.key) ? "medium" : "light"}
                icon={featureTags.includes(type.key) ? checkboxOutline : squareOutline}
                slot="start"
            />
            <IonLabel>{type.text}</IonLabel>
        </IonItem >
    ))

    return (
        <div className={classes.container}>
            <IonPopover
                isOpen={showTagsPopover.open}
                event={showTagsPopover.event}
                cssClass={classes.popover}
                mode="ios"
                onDidDismiss={(_e: any) => setShowTagsPopover({ open: false, event: undefined })}
            >
                <IonItemDivider className={classes.divider}>
                    <IonIcon icon={pricetagOutline} />
                    Tags
                </IonItemDivider>

                {tags}
            </IonPopover>

            <IonButton
                color="medium"
                mode="md"
                className={classes.tagButton}
                onClick={(e: any) => setShowTagsPopover({ open: true, event: e.nativeEvent })}
            >
                {tagsList}
                <IonIcon icon={showTagsPopover.open ? closeOutline : pricetagOutline} />
            </IonButton>
        </div>
    )
})


