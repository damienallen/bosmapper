import React from 'react'
import { observer } from 'mobx-react'
import { createUseStyles } from 'react-jss'
import { IonToast } from '@ionic/react'

import { AddButton } from './AddButton'
import { LocationSelector } from './LocationSelector'
import { SearchBar } from './SearchBar'
import { TreeDetail } from './TreeDetail'


import { useStores } from '../stores'

const useStyles = createUseStyles({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    background: (backgroundColor: string) => backgroundColor
  }
})

export const MapOverlay: React.FC = observer(() => {
  const { map, settings, ui } = useStores()
  const classes = useStyles(map.mapBackground)

  return ui.showLocationSelector ? (
    <div className={classes.container}>
      <LocationSelector />
    </div>
  ) : (
      <div className={classes.container}>
        <SearchBar />
        {ui.showTreeDetails ? <TreeDetail /> : null}
        {(ui.showTreeDetails || !settings.authenticated) ? null : <AddButton />}

        <IonToast
          isOpen={ui.showToast}
          onDidDismiss={() => ui.hideToast()}
          message={ui.toastText}
          duration={2000}
        />
      </div>
    )

})
