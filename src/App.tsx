import React from 'react'
import { Provider } from 'mobx-react'
import {
  IonApp,
  IonSplitPane
} from '@ionic/react'

/* Components */
import { Content } from './components/Content'
import { Menu } from './components/Menu'

/* Stores */
import { RootStore } from './stores'

/* Utilities */
import { fetchCookies } from './utilities/CookieHelper'
import { fetchSpecies } from './utilities/SpeciesHelper'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'

/* Openlayers styling */
import 'ol/ol.css'


export const App: React.FC = () => {
  const rootStore = new RootStore()

  // Use dev server if enabled
  if (process.env.REACT_APP_SERVER === 'dev') {
    rootStore.settings.setHost('https://devbos.dallen.co/api')
  }

  // Fetch cookies
  fetchCookies(rootStore)

  // Fetch species list from server
  fetchSpecies(rootStore)

  return (
    <Provider
      map={rootStore.map}
      root={rootStore}
      settings={rootStore.settings}
      species={rootStore.species}
      ui={rootStore.ui}
    >
      <IonApp>
        <IonSplitPane contentId='main'>
          <Menu />
          <Content />
        </IonSplitPane>
      </IonApp>
    </Provider>
  )
}
