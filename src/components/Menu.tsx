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
  IonMenuButton,
  IonMenuToggle
} from '@ionic/react'
import { settings } from 'ionicons/icons'

import { Logo } from '../components/Logo'

export interface AppPage {
  url: string,
  icon: object,
  title: string
}

const useStyles = createUseStyles({
  menuToggle: {
    position: 'absolute',
    background: 'rgba(255,255,255,0.5)',
    borderRadius: 2,
    margin: 8,
    padding: '4px 0',
    top: 0,
    left: 0,
    zIndex: 150
  }
})

export const MenuToggle: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.menuToggle}>
      <IonMenuButton />
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
        <IonMenuToggle autoHide={false}>
          <IonItem>
            <IonIcon slot="start" icon={settings} />
            <IonLabel>Settings</IonLabel>
          </IonItem>
        </IonMenuToggle>
      </IonList>

    </IonContent>
  </IonMenu>
)
