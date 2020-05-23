import axios from 'axios'
import { RootStore } from '../stores'

export const fetchSpecies = (rootStore: RootStore) => {
    axios.get(`${rootStore.settings.host}/species/`)
        .then((response) => {
            rootStore.species.setList(response.data)
            console.log(`Loaded species list with ${response.data.length} items`)
        })
        .catch((error) => {
            console.error(error)
            rootStore.ui.setToastText('Geen verbinding met server')
        })
}