import React from 'react'
import { createUseStyles } from 'react-jss'

import { AddButton } from '../components/AddButton'
import { FilterModal } from '../components/FilterModal'
import { SearchBar } from '../components/SearchBar'


const useStyles = createUseStyles({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 50,
    height: '100%',
    width: '100%'
  }
})

export const MapOverlay: React.FC = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <FilterModal />

      <SearchBar />
      <AddButton />
    </div>
  )
}
