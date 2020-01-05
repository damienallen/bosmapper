import React from 'react'
import { Provider } from 'mobx-react'
import {
  IonApp,
  IonSplitPane,
  IonContent
} from '@ionic/react'

/* Components */
import { MapCanvas } from './components/MapCanvas'
import { MapOverlay } from './components/MapOverlay'
import { Menu } from './components/Menu'

/* Stores */
import { UIStore, SettingStore } from './stores'

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


export const App: React.FC = () => (
  <Provider
    settings={new SettingStore()}
    ui={new UIStore()}
  >
    <IonApp>
      <IonSplitPane contentId="main">
        <Menu />
        <IonContent id="main">
          <MapOverlay />
          <MapCanvas />
        </IonContent>
      </IonSplitPane>
    </IonApp>
  </Provider>
)
