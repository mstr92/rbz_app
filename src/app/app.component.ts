import { Component } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NetworkServiceService} from '../service/network-service.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'My Favourites',
      url: '/favourites',
      icon: 'heart'
    },
    {
        title: 'History',
        url: '/history',
        icon: 'clock'
    },
    {
        title: 'Help',
        url: '/help',
        icon: 'help-circle'
    },
    {
        title: 'About',
        url: '/about',
        icon: 'information-circle'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public events: Events,
    public network: Network,
    public networkService: NetworkServiceService,
  ) {
      this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
        this.networkService.initializeNetworkEvents();

        // // Offline event
        // this.events.subscribe('network:offline', () => {
        //     alert('network:offline ==> ' + this.network.type);
        // });
        //
        // // Online event
        // this.events.subscribe('network:online', () => {
        //     alert('network:online ==> ' + this.network.type);
        // });

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
