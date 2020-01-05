import React from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton,
  IonModal,
  IonPopover
} from '@ionic/react'
import { logIn, settings } from 'ionicons/icons'

import { Filter } from './Filter'
import { LicenseModal } from './LicenseModal'
import { Logo } from './Logo'
// import { MapSelector } from './MapSelector'
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
    marginBottom: 8
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

export const Menu: React.FC = observer(() => {
  const classes = useStyles()
  const { ui } = useStores()

  return (
    <IonMenu contentId="main" type="overlay">

      <IonPopover
        isOpen={ui.showLoginPopover}
        onDidDismiss={e => ui.setShowLoginPopover(false)}
      >
        <SignIn />
      </IonPopover>

      <IonModal isOpen={ui.showSettingsModal}>
        <SettingsModal />
        <IonButton onClick={() => ui.setShowSettingsModal(false)}>Close Modal</IonButton>
      </IonModal>

      <IonModal isOpen={ui.showLicenseModal}>
        <LicenseModal />
        <IonButton onClick={() => ui.setShowLicenseModal(false)}>Close Modal</IonButton>
      </IonModal>

      <Logo />

      <IonContent>

        {/* <IonList className={classes.menuList} lines="none">
          <MapSelector />
        </IonList> */}

        <IonList className={classes.menuList} lines="none">
          <Filter />
        </IonList>

        <IonList className={classes.menuList} lines="none">

          <IonItem
            className={classes.clickable}
            onClick={() => ui.setShowLoginPopover(true)}
          >
            <IonIcon slot="start" icon={logIn} />
            <IonLabel>Sign in</IonLabel>
          </IonItem>

          <IonItem
            className={classes.clickable}
            onClick={() => ui.setShowSettingsModal(true)}
          >
            <IonIcon slot="start" icon={settings} />
            <IonLabel>Settings</IonLabel>
          </IonItem>

        </IonList>

        <MenuFooter />

      </IonContent>
    </IonMenu>
  )
})
