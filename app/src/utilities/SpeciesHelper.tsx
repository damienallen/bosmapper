import axios, { AxiosResponse } from 'axios'
import { RootStore } from '../stores'

export const fetchSpecies = (store: RootStore) => {
    axios
        .get(`${store.settings.host}/species/`)
        .then((response: AxiosResponse) => {
            store.species.setList(response.data)
            store.ui.setShowConnectionError(false)
            console.log(`Loaded species list with ${response.data.length} items`)
        })
        .catch((error) => {
            console.error(error.response)

            if (store.species.count > 0) {
                store.ui.setToastText('Geen verbinding met server')
            } else {
                store.ui.setToastText('Geen verbinding, probeer het opnieuwe')
                store.ui.setShowConnectionError(true)
                setTimeout(() => fetchSpecies(store), 5000)
            }
        })
}
