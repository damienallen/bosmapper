import React from 'react'
import { createUseStyles } from 'react-jss'
import { observer } from 'mobx-react'
import {
  IonChip,
  IonContent,
  IonIcon,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
} from '@ionic/react'
import { refreshOutline, layersOutline, pricetagsOutline } from 'ionicons/icons'

import { Logo } from './Logo'
import { MapOptions } from './MapOptions'
import { MenuFooter } from './MenuFooter'
import { UserBar } from './UserBar'

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
  clickable: {
    cursor: 'pointer'
  }
})

export const MenuToggle: React.FC = () => {
  const classes = useStyles()
  return (<IonMenuButton className={classes.menuIcon} />)
}

export const Menu: React.FC = observer(() => {
  const classes = useStyles()

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
            <IonLabel>Onzeker soort</IonLabel>
          </IonChip>
          <IonChip>
            <IonLabel>Droog</IonLabel>
          </IonChip>
          <IonChip>
            <IonLabel>Experiment</IonLabel>
          </IonChip>
          <IonChip>
            <IonLabel>Zorg nodig</IonLabel>
          </IonChip>
        </IonList>

        <MenuFooter />

      </IonContent>
    </IonMenu >
  )
})
