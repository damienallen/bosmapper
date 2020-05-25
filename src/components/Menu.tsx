import React from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton
} from '@ionic/react'
import { logIn, logOut } from 'ionicons/icons'

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

export const Menu: React.FC = observer(() => {
  const classes = useStyles()
  const { settings, ui } = useStores()

  return (
    <IonMenu contentId="main" type="overlay">
      <Logo />

      <IonContent>

        <IonList className={classes.menuList} lines="none">
          <MapOptions />
        </IonList>

        <IonItem
          className={classes.clickable}
          lines='none'
          onClick={() => ui.setShowLoginPopover(true)}
        >
          <IonIcon slot="start" icon={settings.authenticated ? logOut : logIn} />
          <IonLabel>{settings.authenticated ? 'Uitloggen' : 'Inloggen'}</IonLabel>
        </IonItem>

        {/* <IonItem
            className={classes.clickable}
            onClick={() => ui.setShowSettingsModal(true)}
          >
            <IonIcon slot="start" icon={settingsIcon} />
            <IonLabel>Instellingen</IonLabel>
          </IonItem> */}


        <MenuFooter />

      </IonContent>
    </IonMenu >
  )
})
