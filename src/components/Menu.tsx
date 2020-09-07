import React from 'react'
import { createUseStyles } from 'react-jss'
import { observer } from 'mobx-react'
import {
  IonContent,
  IonList,
  IonMenu,
  IonMenuButton
} from '@ionic/react'

import { DataSummary } from './DataSummary'
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

        <IonList className={classes.menuSection} lines="none">
          <MapOptions />
        </IonList>

        <IonList className={classes.menuSection} lines="none">
          <DataSummary />
        </IonList>

        <MenuFooter />

      </IonContent>
    </IonMenu >
  )
})
