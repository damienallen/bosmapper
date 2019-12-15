import React from 'react'
import { IonPage } from '@ionic/react'

import { Canvas } from '../components/Canvas'
import { Logo } from '../components/Logo'

export const MapCanvas: React.FC = () => {

  return (
    <IonPage>
      <Logo />
      <Canvas />
    </IonPage>
  )
}
