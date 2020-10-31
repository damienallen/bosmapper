import React, { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import {
  IonButtons,
  IonHeader,
  IonIcon,
  IonContent,
  IonModal,
  IonToolbar,
  IonPage,
  IonTitle
} from '@ionic/react'
import { close } from 'ionicons/icons'

import { Credits } from './Credits'
import { DataSummary } from './DataSummary'

const useStores = () => {
  return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
  container: {
    padding: 20
  },
  toolbarButtons: {
    marginRight: 20
  }
})

export const AboutModal: React.FC = observer(() => {
  const classes = useStyles()
  const { ui } = useStores()

  useEffect(() => {
    return () => {
      console.log('Saving settings...')
    }
  })

  return (
    <IonModal
      isOpen={ui.showAboutModal}
      onDidDismiss={_e => ui.setShowAboutModal(false)}
    >
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons className={classes.toolbarButtons} slot="end">
              <IonIcon onClick={() => ui.setShowAboutModal(false)} icon={close} />
            </IonButtons>
            <IonTitle>Info</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <DataSummary />
          <Credits />
        </IonContent>

      </IonPage>
    </IonModal>
  )
})
