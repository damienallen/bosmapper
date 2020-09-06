import React from 'react'
import { createUseStyles } from 'react-jss'
import { observer } from 'mobx-react'
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuButton
} from '@ionic/react'

import { Logo } from './Logo'
import { MapOptions } from './MapOptions'
import { MenuFooter } from './MenuFooter'
import { UserBar } from './UserBar'

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

  return (
    <IonMenu contentId="main" type="overlay">
      <Logo />
      <UserBar />

      <IonContent>

        <IonList className={classes.menuList} lines="none">
          <MapOptions />
        </IonList>

        <MenuFooter />

      </IonContent>
    </IonMenu >
  )
})
