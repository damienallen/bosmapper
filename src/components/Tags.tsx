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
        top: -10,
        right: 15,
        opacity: 0.9
    },
    popover: {
        '& ion-item': {
            cursor: 'pointer',
            marginLeft: -10
        },
        '& ion-icon': {
            marginRight: 5
        }
    },
    tabContainer: {
        display: 'inline',
        position: 'relative',
        bottom: 0,
        right: 0,
        zIndex: 50
    },
    tagButton: {
        textTransform: 'lowercase',
        fontWeight: '400',
        marginTop: -16
    },
    tab: {
        display: 'inline',
        marginTop: -20,
        marginRight: 10,
        padding: '5px 10px',
        background: '#ccc',
        borderRadius: '5px 5px 0 0',
        fontSize: '0.8em',
        fontStyle: 'italic',
        whiteSpace: 'nowrap'
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

interface LookupDict {
    [Key: string]: string
}
export const tagTypes: LookupDict = {
    'unsure': 'Onzeker',
    'dry': 'Droog',
    'temporary': 'Tijdelijk',
    'attn_needed': 'Aandacht nodig'
}

export const Tags: React.FC = observer(() => {
    const [showTagsPopover, setShowTagsPopover] = useState<{ open: boolean, event: Event | undefined }>({
        open: false,
        event: undefined,
    })

    const { map, settings, ui } = useStores()
    const classes = useStyles()

    const featureTags = toJS(map.selectedFeature.get('tags'))

    const updateTags = (key: string) => {
        const oid = map.selectedId
        console.debug('Updating feature tags', oid)

        const index = featureTags.indexOf(key)
        if (index > -1) {
            featureTags.splice(index, 1)
        } else {
            featureTags.push(key)
        }

        const featureJson = {
            tags: featureTags
        }

        axios.post(`${settings.host}/tree/update/${map.selectedId}/`, featureJson, settings.authHeader)
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

    const tabs = featureTags.length ? featureTags.map((key: any) => (
        <div className={classes.tab} key={`tab-${key}`}>{tagTypes[key]}</div>
    )) : null


    const tags = Object.keys(tagTypes).map((key: any) => (
        < IonItem key={key} lines="none" onClick={() => updateTags(key)}>
            <IonIcon
                color={featureTags.includes(key) ? "medium" : "light"}
                icon={featureTags.includes(key) ? checkboxOutline : squareOutline}
                slot="start"
            />
            <IonLabel>{tagTypes[key]}</IonLabel>
        </IonItem >
    ))

    const popoverButton = settings.authenticated ? (
        <IonButton
            color="medium"
            mode="md"
            className={classes.tagButton}
            onClick={(e: any) => setShowTagsPopover({ open: true, event: e.nativeEvent })}
        >
            <IonIcon icon={showTagsPopover.open ? closeOutline : pricetagOutline} />
        </IonButton>
    ) : null

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

            <div className={classes.tabContainer}>
                {tabs}
                {popoverButton}
            </div>


        </div>
    )
})


