import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'

import { AddButton } from './AddButton'
import { FilterModal } from './FilterModal'
import { SearchBar } from './SearchBar'
import { TreeDetail } from './TreeDetail'

import { LoginPopover } from './LoginPopover'
import { SettingsModal } from './SettingsModal'
import { SpeciesModal } from './SpeciesModal'

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

  return (
    <div className={classes.container}>
      <FilterModal />
      <SettingsModal />
      <SpeciesModal />
      <LoginPopover />

      <SearchBar />
      {ui.showTreeDetails ? <TreeDetail /> : null}
      {ui.showTreeDetails ? null : <AddButton />}
    </div>
  )
})
