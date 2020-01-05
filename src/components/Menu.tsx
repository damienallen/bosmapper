import React from 'react'
import { createUseStyles } from 'react-jss'
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton
} from '@ionic/react'
import { logIn, settings } from 'ionicons/icons'

import { Logo } from '../components/Logo'

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

export const Menu: React.FC = () => (
  <IonMenu contentId="main" type="overlay">
    <Logo />
    <IonContent>

      <IonList lines="none">
        <IonListHeader>
          <IonLabel>Filter</IonLabel>
        </IonListHeader>
      </IonList>

      <IonList lines="none">
        <IonItem>
          <IonIcon slot="start" icon={logIn} />
          <IonLabel>Sign in</IonLabel>
        </IonItem>
        <IonItem>
          <IonIcon slot="start" icon={settings} />
          <IonLabel>Settings</IonLabel>
        </IonItem>
      </IonList>

      <IonList lines="none">
        <IonItem>
          <IonLabel>
            <h2>License</h2>
            <h3>MIT</h3>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <h2>Version</h2>
            <h3>0.1.0</h3>
          </IonLabel>
        </IonItem>
      </IonList>

    </IonContent>
  </IonMenu>
)
