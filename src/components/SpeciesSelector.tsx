import axios, { AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import { toJS } from 'mobx'
import {
    IonButtons,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonToolbar,
    IonContent,
    IonTitle,
    IonSearchbar
} from '@ionic/react'
import { close } from 'ionicons/icons'

import { Species } from '../stores'

const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    container: {
        padding: 20
    },
    toolbarButtons: {
        marginRight: 20
    }
})

export const SpeciesSelector: React.FC = observer(() => {
    const classes = useStyles()
    const { map, settings, species, ui } = useStores()

    const allSpecies = toJS(species.list)

    // TODO: order this by common name
    const [searchText, setSearchText] = useState('')
    const [filteredSpecies, setFilteredSpecies] = useState(allSpecies)

    // Handle species search
    const handleInput = (e: any) => {
        setSearchText(e.detail.value!)
        const query = searchText.toLowerCase()

        if (query.length > 2) {
            const nameFilter = (item: Species) => (
                item.species.toLowerCase().includes(query)
                || (item.name_nl && item.name_nl.toLowerCase().includes(query))
                || (item.name_en && item.name_en.toLowerCase().includes(query))
            )

            setFilteredSpecies(allSpecies.filter(nameFilter))
        } else {
            setFilteredSpecies(allSpecies)
        }
    }

    // Handle species select
    const handleSelect = (species: string) => {
        if (ui.speciesSelectorAction === 'update') {
            const featureJson = {
                species: species
            }
            axios.post(`${settings.host}/tree/update/${map.selectedId}/`, featureJson, settings.authHeader)
                .then((response: AxiosResponse) => {
                    console.debug(response)
                    map.setNeedsUpdate(true)
                    ui.setShowSpeciesUpdated(true)
                })
                .catch((error) => {
                    console.error(error.response)
                    ui.setToastText('Verzoek mislukt')
                })
        } else {
            map.setNewFeatureSpecies(species)
            ui.setShowLocationSelector(true)
        }
        ui.setShowSpeciesSelector(false)
    }

    const onKeyPress = (e: any) => {
        if (e.key === 'Enter') e.target.blur()
    }

    const speciesList = filteredSpecies.map((item: Species) => (
        <IonItem key={item.species} onClick={e => handleSelect(item.species)}>
            <IonLabel>
                <h2>{item.name_nl ? item.name_nl : item.species}</h2>
                <p>{item.name_la}</p>
            </IonLabel>
        </IonItem>
    ))

    const headerText = ui.speciesSelectorAction === 'update' ? 'Soort bewerken' : 'Kies een soort (nieuw)'

    return (
        <IonModal
            isOpen={ui.showSpeciesSelector}
            onDidDismiss={_e => ui.setShowSpeciesSelector(false)}
        >
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{headerText}</IonTitle>
                    <IonButtons className={classes.toolbarButtons} slot='end'>
                        <IonIcon onClick={() => ui.setShowSpeciesSelector(false)} icon={close} />
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={handleInput}
                        onKeyDown={onKeyPress}
                        debounce={200}
                        placeholder='Zoeken'
                        mode='ios'
                    />
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    {speciesList}
                </IonList>
            </IonContent>
        </IonModal>
    )
})
