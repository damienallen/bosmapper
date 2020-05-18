import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'

import { AddButton } from './AddButton'
import { LocationSelector } from './LocationSelector'
import { SearchBar } from './SearchBar'
import { TreeDetail } from './TreeDetail'


const useStores = () => {
  return React.useContext(MobXProviderContext)
}

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
  const { map, ui } = useStores()
  const classes = useStyles(map.mapBackground)

  return ui.showLocationSelector ? (
    <div className={classes.container}>
      <LocationSelector />
    </div>
  ) : (
      <div className={classes.container}>
        <SearchBar />
        {ui.showTreeDetails ? <TreeDetail /> : null}
        {ui.showTreeDetails ? null : <AddButton />}
      </div>
    )

})
