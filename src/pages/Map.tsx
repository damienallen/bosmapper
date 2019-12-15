import React from 'react'
import { IonContent, IonPage } from '@ionic/react'

import { Canvas } from '../components/Canvas'

export const MapCanvas: React.FC = () => {

  return (
    <IonPage>
      <IonContent>
        <Canvas />
      </IonContent>
    </IonPage>
  )
}
