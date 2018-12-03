import { Injectable } from '@angular/core';
import { AlertController, Events } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

export enum ConnectionStatusEnum {
    Online,
    Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkServiceService {

    previousStatus;

    constructor(public alertCtrl: AlertController,
                public network: Network,
                public eventCtrl: Events) {

        console.log('Hello NetworkProvider Provider');

        this.previousStatus = ConnectionStatusEnum.Online;
    }
    public initializeNetworkEvents(): void {
        // this.network.onDisconnect().subscribe(() => {
        //     if (this.previousStatus === ConnectionStatusEnum.Online) {
        //         console.log('online');
        //        this.eventCtrl.publish('network:offline');
        //     }
        //     this.previousStatus = ConnectionStatusEnum.Offline;
        // });
        // this.network.onConnect().subscribe(() => {
        //     if (this.previousStatus === ConnectionStatusEnum.Offline) {
        //         console.log('offline');
        //         this.eventCtrl.publish('network:online');
        //     }
        //     this.previousStatus = ConnectionStatusEnum.Online;
        // });
    }
}
