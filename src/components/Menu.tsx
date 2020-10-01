import React from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import {
  IonChip,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonToggle
} from '@ionic/react'
import { refreshOutline, layersOutline, pricetagsOutline, mapOutline } from 'ionicons/icons'

import { Logo } from './Logo'
import { MapOptions } from './MapOptions'
import { MenuFooter } from './MenuFooter'
import { UserBar } from './UserBar'

const useStores = () => {
  return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
  menuIcon: {
    color: '#999',
    fontSize: '2.1em'
  },
  menuSection: {
    padding: '0 10px',
    marginBottom: 10,
    userSelect: 'none'
  },
  sectionHeader: {
    paddingBottom: 0,
    color: '#92949c',
    fontSize: '0.9em'
  },
  sectionIcon: {
    marginRight: 10
  },
  toggleLabel: {
    fontSize: '0.8em'
  },
  clickable: {
    cursor: 'pointer'
  }
})

export const MenuToggle: React.FC = () => {
  const classes = useStyles()
  return (<IonMenuButton className={classes.menuIcon} />)
}

export const Menu: React.FC = observer(() => {
  const { settings } = useStores()
  const classes = useStyles()

  const displayToggles = settings.authenticated ? (
    <div>
      <IonListHeader className={classes.sectionHeader}>
        <IonIcon className={classes.sectionIcon} icon={mapOutline} />
      Weergave
    </IonListHeader>

      <IonList lines="none">
        <IonItem>
          <IonToggle
            color="primary"
            slot="start"
            checked={settings.showDead}
            onIonChange={e => settings.setShowDead(e.detail.checked)}
          />
          <IonLabel className={classes.toggleLabel}>Dood bomen tonen</IonLabel>
        </IonItem>
        <IonItem>
          <IonToggle
            color="primary"
            slot="start"
            checked={settings.showNotes}
            onIonChange={e => settings.setShowNotes(e.detail.checked)}
          />
          <IonLabel>Notities op kaart</IonLabel>
        </IonItem>
      </IonList>
    </div>
  ) : null

  return (
    <IonMenu contentId="main" type="overlay">
      <Logo />
      <UserBar />

      <IonContent>

        <IonListHeader className={classes.sectionHeader}>
          <IonIcon className={classes.sectionIcon} icon={layersOutline} />
          Basis kaart
        </IonListHeader>

        <IonList className={classes.menuSection} lines="none">
          <MapOptions />
        </IonList>

        <IonListHeader className={classes.sectionHeader}>
          <IonIcon className={classes.sectionIcon} icon={pricetagsOutline} />
          Tags
        </IonListHeader>

        <IonList className={classes.menuSection} lines="none">
          <IonChip color="primary" outline>
            <IonIcon icon={refreshOutline} />
            <IonLabel>Alles</IonLabel>
          </IonChip>
          <IonChip>
            <IonLabel>Onzeker</IonLabel>
          </IonChip>
          <IonChip>
            <IonLabel>Droog</IonLabel>
          </IonChip>
          <IonChip>
            <IonLabel>Tijdelijk</IonLabel>
          </IonChip>
          <IonChip>
            <IonLabel>Aandacht nodig</IonLabel>
          </IonChip>
        </IonList>

        {displayToggles}

        <MenuFooter />

      </IonContent>
    </IonMenu >
  )
})
