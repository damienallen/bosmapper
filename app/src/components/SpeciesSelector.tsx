import {
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonSearchbar,
    IonTitle,
    IonToolbar,
} from '@ionic/react'
import { close } from 'ionicons/icons'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { Species, useStores } from '../stores'

const useStyles = createUseStyles({
    container: {
        padding: 20,
    },
    toolbarButtons: {
        marginRight: 20,
    },
})

export const SpeciesSelector: React.FC = observer(() => {
    const classes = useStyles()
    const { map, settings, species, ui } = useStores()

    const allSpecies = toJS(species.list)

    // TODO: order this by common name
    const [searchText, setSearchText] = useState('')
    const [filteredSpecies, setFilteredSpecies] = useState(allSpecies)

    // Handle species search
    const handleInput = (e: CustomEvent) => {
        setSearchText(e.detail.value!)
        const query = e.detail.value.toLowerCase()

        if (query.length > 1) {
            const nameFilter = (item: Species) =>
                item.name_la?.toLowerCase().includes(query) ||
                item.name_nl?.toLowerCase().includes(query)

            setFilteredSpecies(allSpecies.filter(nameFilter))
        } else {
            setFilteredSpecies(allSpecies)
        }
    }

    // Handle species select
    const handleSelect = (species: string) => {
        if (ui.speciesSelectorAction === 'update') {
            const featureJson = {
                species: species,
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
                    ui.setShowSpeciesUpdated(true)
                })
                .catch((error) => {
                    console.error(error)
                    ui.setToastText('Verzoek mislukt')
                })
        } else {
            map.setNewFeatureSpecies(species)
            ui.setShowLocationSelector(true)
        }
        ui.setShowSpeciesSelector(false)
    }

    const onKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') (e.target as HTMLIonSearchbarElement).blur()
    }

    const speciesList = filteredSpecies.map((item: Species) => (
        <IonItem key={item.species} onClick={() => handleSelect(item.species)}>
            <IonLabel>
                <h2>{item.name_nl ? item.name_nl : item.species}</h2>
                <p>{item.name_la}</p>
            </IonLabel>
        </IonItem>
    ))

    const headerText =
        ui.speciesSelectorAction === 'update' ? 'Soort bewerken' : 'Kies een soort (nieuw)'

    return (
        <IonModal
            isOpen={ui.showSpeciesSelector}
            onDidDismiss={(_e) => ui.setShowSpeciesSelector(false)}
        >
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{headerText}</IonTitle>
                    <IonButtons className={classes.toolbarButtons} slot="end">
                        <IonIcon
                            onClick={() => ui.setShowSpeciesSelector(false)}
                            icon={close}
                            aria-label="Sluiten"
                        />
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={handleInput}
                        onKeyDown={onKeyPress}
                        debounce={200}
                        placeholder="Zoeken"
                        mode="ios"
                    />
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>{speciesList}</IonList>
            </IonContent>
        </IonModal>
    )
})
