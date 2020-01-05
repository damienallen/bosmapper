import React, { useEffect } from 'react'
import { IonHeader, IonToolbar, IonPage, IonTitle, IonContent } from '@ionic/react'

export const SettingsModal: React.FC = () => {

  useEffect(() => {
    console.log('Loading settings page...')
    return () => {
      console.log('Unloading settings page...')
    }
  })

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        Label
      </IonContent>
    </IonPage>
  )
}
