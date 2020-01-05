import React from 'react'
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

export const LicenseModal: React.FC = observer(() => {
    const classes = useStyles()
    const { ui } = useStores()

    return (
        <IonModal
            isOpen={ui.showLicenseModal}
            onDidDismiss={_e => ui.setShowLicenseModal(false)}
        >
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>License</IonTitle>
                        <IonButtons className={classes.toolbarButtons} slot="end">
                            <IonIcon onClick={() => ui.setShowLicenseModal(false)} icon={close} />
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <div className={classes.container}>

                    <p>MIT License</p>

                    <p>Copyright (c) 2020 Damien Allen</p>

                    <p>
                        Permission is hereby granted, free of charge, to any person obtaining a copy
                        of this software and associated documentation files (the "Software"), to deal
                        in the Software without restriction, including without limitation the rights
                        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                        copies of the Software, and to permit persons to whom the Software is
                        furnished to do so, subject to the following conditions:
                    </p>


                    <p>
                        The above copyright notice and this permission notice shall be included in all
                        copies or substantial portions of the Software.
                    </p>

                    <p>
                        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                        SOFTWARE.
                    </p>

                </div>

            </IonPage>
        </IonModal>
    )
})
