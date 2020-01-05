import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonModal,
  IonPopover
} from '@ionic/react'
import { logIn, settings } from 'ionicons/icons'

import { Filter } from './Filter'
import { Logo } from './Logo'
import { MapSelector } from './MapSelector'
import { MenuFooter } from './MenuFooter'
import { Settings } from './Settings'
import { SignIn } from './SignIn'

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
  const [showModal, setShowModal] = useState(false)
  const [showPopover, setShowPopover] = useState(false)

  return (
    <IonMenu contentId="main" type="overlay">

      <IonPopover
        isOpen={showPopover}
        onDidDismiss={e => setShowPopover(false)}
      >
        <SignIn />
      </IonPopover>

      <IonModal isOpen={showModal}>
        <Settings />
        <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
      </IonModal>

      <Logo />

      <IonContent>

        <IonList className={classes.menuList} lines="none">
          <MapSelector />
        </IonList>

        <IonList className={classes.menuList} lines="none">
          <Filter />
        </IonList>


        <IonList className={classes.menuList} lines="none">
          <IonItem onClick={() => setShowPopover(true)}>
            <IonIcon slot="start" icon={logIn} />
            <IonLabel>Sign in</IonLabel>
          </IonItem>
          <IonItem onClick={() => setShowModal(true)}>
            <IonIcon slot="start" icon={settings} />
            <IonLabel>Settings</IonLabel>
          </IonItem>
        </IonList>

        <MenuFooter />

      </IonContent>
    </IonMenu>
  )
}
