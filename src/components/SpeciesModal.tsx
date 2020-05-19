import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
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

import { speciesList, } from '../utilities/FeatureHelpers'


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
    const { map, ui } = useStores()

    // TODO: order this by common name
    const [searchText, setSearchText] = useState('')
    const [filteredSpecies, setFilteredSpecies] = useState(speciesList)

    // Handle species search
    const handleInput = (e: any) => {
        setSearchText(e.detail.value!)
        const query = searchText.toLowerCase()

        const nameFilter = (item: any) => {
            if (
                item.species.toLowerCase().includes(query)
                || (item.name_nl && item.name_nl.toLowerCase().includes(query))
                || (item.name_en && item.name_en.toLowerCase().includes(query))
            ) {
                return true
            } else {
                return false
            }
        }

        setFilteredSpecies(speciesList.filter(nameFilter))
    }

    // Handle species select
    const handleSelect = (species: string) => {
        console.log('Adding new tree:', species)
        map.setNewFeatureSpecies(species)
        ui.setShowLocationSelector(true)
        ui.setShowSpeciesModal(false)
    }

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
                    {
                        filteredSpecies.map((item) =>
                            <IonItem key={item.abbr} onClick={e => handleSelect(item.abbr)}>
                                <IonLabel>
                                    <h2>{item.name_nl}</h2>
                                    <p>{item.species}</p>
                                </IonLabel>
                            </IonItem>
                        )
                    }
                </IonList>
            </IonContent>
        </IonModal>
    )
})
