import React from 'react'
import { createUseStyles } from 'react-jss'
import { observer, MobXProviderContext } from 'mobx-react'
import { IonContent, IonIcon, IonSpinner, IonToast } from '@ionic/react'
import { cloudOfflineOutline } from 'ionicons/icons'


const useStores = () => {
    return React.useContext(MobXProviderContext)
}

const useStyles = createUseStyles({
    loading: {
        background: '#333',
        height: '100%',
        width: '100%',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    loadingText: {
        paddingBottom: 5
    },
    offlineIcon: {
        fontSize: '2em',
        marginBottom: 10
    }
})

export const LoadingScreen: React.FC = observer(() => {
    const classes = useStyles()
    const { ui } = useStores()

    const loadingContent = ui.showConnectionError ?
        (
            <div className={classes.loading}>
                <IonIcon icon={cloudOfflineOutline} className={classes.offlineIcon} color='light' />
                <div className={classes.loadingText}>Geen verbinding met server</div>
            </div>
        ) : (
            <div className={classes.loading}>
                <div className={classes.loadingText}>Aan het laden</div>
                <IonSpinner name='dots' color='light' />
            </div>
        )

    return (
        <IonContent id='main'>
            {loadingContent}
            <IonToast
                isOpen={ui.showToast}
                onDidDismiss={() => ui.hideToast()}
                message={ui.toastText}
                duration={2000}
            />
        </IonContent>
    )

})
