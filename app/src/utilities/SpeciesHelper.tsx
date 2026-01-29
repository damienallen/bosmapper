import { RootStore } from '../stores'

export const fetchSpecies = (store: RootStore) => {
    fetch(`${store.settings.host}/species/`)
        .then(async (response) => {
            if (!response.ok) throw new Error(await response.text())
            const data = await response.json()
            store.species.setList(data)
            store.ui.setShowConnectionError(false)
            console.log(`Loaded species list with ${data.length} items`)
        })
        .catch((error) => {
            console.error(error)

            if (store.species.count > 0) {
                store.ui.setToastText('Geen verbinding met server')
            } else {
                store.ui.setToastText('Geen verbinding, probeer het opnieuwe')
                store.ui.setShowConnectionError(true)
                setTimeout(() => fetchSpecies(store), 5000)
            }
        })
}
