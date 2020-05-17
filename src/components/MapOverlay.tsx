import React from 'react'
import { observer, MobXProviderContext } from 'mobx-react'
import { createUseStyles } from 'react-jss'

import { AddButton } from '../components/AddButton'
import { FilterModal } from '../components/FilterModal'
import { SearchBar } from '../components/SearchBar'


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
  const { map } = useStores()
  const mapBackground = map.baseMap === 'drone' ? '#333' : '#fff'
  const classes = useStyles(mapBackground)

  return (
    <div className={classes.container}>
      <FilterModal />

      <SearchBar />
      <AddButton />
    </div>
  )
})
