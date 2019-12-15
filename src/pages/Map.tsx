import React from 'react'
import { IonPage } from '@ionic/react'

import { AddButton } from '../components/AddButton'
import { Canvas } from '../components/Canvas'
import { Logo } from '../components/Logo'

export const MapCanvas: React.FC = () => {

  return (
    <IonPage>
      <AddButton />
      <Logo />
      <Canvas />
    </IonPage>
  )
}
