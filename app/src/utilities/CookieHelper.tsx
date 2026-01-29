import Cookies from 'js-cookie'
import { RootStore } from '../stores'

export const fetchCookies = (store: RootStore) => {
    const cachedToken = Cookies.get('token')
    if (cachedToken) {
        store.settings.setToken(cachedToken)
        console.log(`Using cached token '${cachedToken}'`)
    }

    const droneMap = Cookies.get('drone')
    if (droneMap === 'true') {
        store.map.setBaseMap('drone')
    } else if (droneMap === 'false') {
        store.map.setBaseMap('vector/v2')
    } else {
        Cookies.set('drone', 'true', { expires: 365 })
    }

    const showDead = Cookies.get('showDead')
    store.settings.setShowDead(showDead === 'true')

    const showNotes = Cookies.get('showNotes')
    store.settings.setShowNotes(showNotes === 'true')
}
