import React from 'react'
import { createUseStyles } from 'react-jss'
import { MobXProviderContext } from 'mobx-react'
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton
} from '@ionic/react'
import { logIn, settings } from 'ionicons/icons'

import { Logo } from './Logo'
import { MapOptions } from './MapOptions'
import { MenuFooter } from './MenuFooter'

const useStores = () => {
  return React.useContext(MobXProviderContext)
}

export interface AppPage {
  url: string,
  icon: object,
  title: string
}

const useStyles = createUseStyles({
  menuIcon: {
    color: '#999',
    fontSize: '2.1em'
  },
  menuList: {
    borderBottom: '1px solid rgba(0,0,0,0.13)',
    marginBottom: 8,
    userSelect: 'none'
  },
  clickable: {
    cursor: 'pointer'
  }
})

export const MenuToggle: React.FC = () => {
  const classes = useStyles()
  return (<IonMenuButton className={classes.menuIcon} />)
}

export const Menu: React.FC = () => {
  const classes = useStyles()
  const { ui } = useStores()

  return (
    <IonMenu contentId="main" type="overlay">
      <Logo />

      <IonContent>

        <IonList className={classes.menuList} lines="none">
          <MapOptions />
        </IonList>

        <IonList className={classes.menuList} lines="none">

          <IonItem
            className={classes.clickable}
            onClick={() => ui.setShowLoginPopover(true)}
          >
            <IonIcon slot="start" icon={logIn} />
            <IonLabel>Inloggen</IonLabel>
          </IonItem>

          <IonItem
            className={classes.clickable}
            onClick={() => ui.setShowSettingsModal(true)}
          >
            <IonIcon slot="start" icon={settings} />
            <IonLabel>Instellingen</IonLabel>
          </IonItem>

        </IonList>

        <MenuFooter />

      </IonContent>
    </IonMenu >
  )
}
