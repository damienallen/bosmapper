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

export const SpeciesModal: React.FC = observer(() => {
    const classes = useStyles()
    const { map, species, ui } = useStores()

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
        console.log('Adding new tree:', species)
        map.setNewFeatureSpecies(species)
        ui.setShowLocationSelector(true)
        ui.setShowSpeciesModal(false)
    }

    const speciesList = filteredSpecies.map((item: Species) => (
        <IonItem key={item.species} onClick={e => handleSelect(item.species)}>
            <IonLabel>
                <h2>{item.name_nl ? item.name_nl : item.species}</h2>
                <p>{item.name_la}</p>
            </IonLabel>
        </IonItem>
    ))

    return (
        <IonModal
            isOpen={ui.showSpeciesModal}
            onDidDismiss={_e => ui.setShowSpeciesModal(false)}
        >
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Nieuwe boom toevoegen</IonTitle>
                    <IonButtons className={classes.toolbarButtons} slot="end">
                        <IonIcon onClick={() => ui.setShowSpeciesModal(false)} icon={close} />
                    </IonButtons>
                </IonToolbar>
                <IonToolbar>
                    <IonSearchbar
                        value={searchText}
                        onIonChange={handleInput}
                        debounce={200}
                        placeholder="Zoeken"
                        mode="ios"
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
