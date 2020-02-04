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

import { Filter } from './Filter'
import { LicenseModal } from './LicenseModal'
import { Logo } from './Logo'
import { MapOptions } from './MapOptions'
import { MenuFooter } from './MenuFooter'
import { SettingsModal } from './SettingsModal'
import { SignIn } from './SignIn'

const useStores = () => {
  return React.useContext(MobXProviderContext)
}

export interface AppPage {
  url: string,
  icon: object,
  title: string
}

const useStyles = createUseStyles({
  menuToggle: {
    position: 'absolute',
    background: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    margin: 8,
    padding: '4px 0',
    top: 0,
    left: 0,
    zIndex: 150
  },
  menuIcon: {
    color: '#fff',
    fontSize: '2.5em'
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

  return (
    <div className={classes.menuToggle}>
      <IonMenuButton className={classes.menuIcon} />
    </div>
  )
}

export const Menu: React.FC = () => {
  const classes = useStyles()
  const { ui } = useStores()

  return (
    <IonMenu contentId="main" type="overlay">

      <SignIn />
      <SettingsModal />
      <LicenseModal />

      <Logo />

      <IonContent>

        <IonList className={classes.menuList} lines="none">
          <MapOptions />
        </IonList>

        <IonList className={classes.menuList} lines="none">
          <Filter />
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
