import React, { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import {
  IonButtons,
  IonHeader,
  IonIcon,
  IonModal,
  IonToolbar,
  IonPage,
  IonTitle
} from '@ionic/react'
import { close } from 'ionicons/icons'

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

export const SettingsModal: React.FC = observer(() => {
  const classes = useStyles()
  const { ui } = useStores()

  useEffect(() => {
    return () => {
      console.log('Saving settings...')
    }
  })

  return (
    <IonModal
      isOpen={ui.showSettingsModal}
      onDidDismiss={_e => ui.setShowSettingsModal(false)}
    >
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons className={classes.toolbarButtons} slot="end">
              <IonIcon onClick={() => ui.setShowSettingsModal(false)} icon={close} />
            </IonButtons>
            <IonTitle>Instellingen</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className={classes.container}>
        </div>
      </IonPage>
    </IonModal>
  )
})
