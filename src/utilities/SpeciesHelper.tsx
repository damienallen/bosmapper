import axios, { AxiosResponse } from 'axios'
import { RootStore } from '../stores'

export const fetchSpecies = (root: RootStore) => {
    axios.get(`${root.settings.host}/species/`)
        .then((response: AxiosResponse) => {
            root.species.setList(response.data)
            root.ui.setShowConnectionError(false)
            console.log(`Loaded species list with ${response.data.length} items`)
        })
        .catch((error) => {
            console.error(error)

            if (root.species.count > 0) {
                root.ui.setToastText('Geen verbinding met server')
            } else {
                root.ui.setToastText('Geen verbinding, probeer het opnieuwe')
                root.ui.setShowConnectionError(true)
                setTimeout(() => fetchSpecies(root), 5000)
            }
        })
}