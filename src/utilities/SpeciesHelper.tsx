import axios from 'axios'
import { RootStore } from '../stores'

export const fetchSpecies = (rootStore: RootStore) => {
    console.log('fetching species')
    axios.get(`${rootStore.settings.host}/species/`)
        .then((response) => {
            rootStore.species.setList(response.data)
        })
        .catch((error) => {
            console.error(error)
            rootStore.ui.setToastText('Geen verbinding met server')
        })
}