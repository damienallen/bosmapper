import React from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'

import { Canvas } from '../components/Canvas'

export const MapCanvas: React.FC = () => {

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar>
          <IonTitle>Bos Mapper</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <Canvas />
      </IonContent>

    </IonPage>
  )
}
