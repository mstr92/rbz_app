import {Injectable} from '@angular/core';
import {AlertController, Events} from '@ionic/angular';
import {NetworkStatusAngularService} from 'network-status-angular';

@Injectable({
    providedIn: 'root'
})
export class NetworkServiceService {

    alert;
    alertPresent = false;

    constructor(public alertController: AlertController,
                public networkStatus: NetworkStatusAngularService) {
    }

    public initializeNetworkEvents() {
        console.log('start watching network connection...');
        this.networkStatus.status.subscribe(status => {
            if (!status) { // disconnected
                this.presentAlertConfirm();
            } else {
                this.alert.dismiss();
                this.alertPresent = false;
            }
        });
    }

    async presentAlertConfirm() {
        if (!this.alertPresent) {
            this.alertPresent = true;
            this.alert = await this.alertController.create({
                header: 'No Internet Connection!',
                keyboardClose: true,
                backdropDismiss: false,
                message: 'Uh..oh.. Looks like you have lost the internet connection!' +
                    'Please connect again otherwise the app does not work anymore!',
            });
            await this.alert.present();
        }
    }
}
