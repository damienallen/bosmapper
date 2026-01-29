import { IonButton, IonIcon, IonItem, IonItemDivider, IonLabel, IonPopover } from '@ionic/react'
import { checkboxOutline, closeOutline, pricetagOutline, squareOutline } from 'ionicons/icons'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'

import { useStores } from '../stores'

const useStyles = createUseStyles({
    container: {
        position: 'absolute',
        top: -10,
        right: 15,
        opacity: 0.9,
    },
    popover: {
        '& ion-item': {
            cursor: 'pointer',
            marginLeft: -10,
        },
        '& ion-icon': {
            marginRight: 5,
        },
    },
    tabContainer: {
        display: 'inline',
        position: 'relative',
        bottom: 0,
        right: 0,
        zIndex: 50,
    },
    tagButton: {
        textTransform: 'lowercase',
        fontWeight: '400',
        marginTop: -16,
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
        whiteSpace: 'nowrap',
    },
    divider: {
        fontWeight: 400,
        fontSize: '0.9em',
        opacity: 0.7,
        '& ion-icon': {
            marginRight: 12,
        },
    },
})

interface LookupDict {
    [Key: string]: string
}
export const tagTypes: LookupDict = {
    unsure: 'Onzeker',
    dry: 'Droog',
    temporary: 'Tijdelijk',
    attn_needed: 'Aandacht nodig',
}

export const Tags: React.FC = observer(() => {
    const [showTagsPopover, setShowTagsPopover] = useState<{
        open: boolean
        event: Event | undefined
    }>({
        open: false,
        event: undefined,
    })

    const { map, settings, ui } = useStores()
    const classes = useStyles()

    const featureTags = toJS(map.selectedFeature!.get('tags'))

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
            tags: featureTags,
        }

        fetch(`${settings.host}/tree/update/${map.selectedId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(settings.authHeader.headers || {}),
            },
            body: JSON.stringify(featureJson),
        })
            .then(async (response) => {
                if (!response.ok) throw new Error(await response.text())
                map.setNeedsUpdate(true)
                ui.setShowMetaUpdated(true)
            })
            .catch((error) => {
                console.error(error)
                ui.setToastText('Verzoek mislukt')
            })
    }

    const tabs = featureTags.length
        ? featureTags.map((key: string) => (
              <div className={classes.tab} key={`tab-${key}`}>
                  {tagTypes[key]}
              </div>
          ))
        : null

    const tags = Object.keys(tagTypes).map((key: string) => (
        <IonItem key={key} lines="none" onClick={() => updateTags(key)}>
            <IonIcon
                color={featureTags.includes(key) ? 'medium' : 'light'}
                icon={featureTags.includes(key) ? checkboxOutline : squareOutline}
                aria-label={featureTags.includes(key) ? 'Geselecteerd' : 'Niet geselecteerd'}
                slot="start"
            />
            <IonLabel>{tagTypes[key]}</IonLabel>
        </IonItem>
    ))

    const popoverButton = settings.authenticated ? (
        <IonButton
            color="medium"
            mode="md"
            className={classes.tagButton}
            onClick={(e: React.MouseEvent) =>
                setShowTagsPopover({ open: true, event: e.nativeEvent })
            }
        >
            <IonIcon
                icon={showTagsPopover.open ? closeOutline : pricetagOutline}
                aria-label={showTagsPopover.open ? 'Sluiten' : 'Tags'}
            />
        </IonButton>
    ) : null

    return (
        <div className={classes.container}>
            <IonPopover
                isOpen={showTagsPopover.open}
                event={showTagsPopover.event}
                className={classes.popover}
                mode="ios"
                onDidDismiss={() => setShowTagsPopover({ open: false, event: undefined })}
            >
                <IonItemDivider className={classes.divider}>
                    <IonIcon icon={pricetagOutline} aria-hidden="true" />
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
