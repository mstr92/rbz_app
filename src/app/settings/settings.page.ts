import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from '../../service/storage/storage.service';
import {AlertController, ToastController} from '@ionic/angular';
import {Constants} from '../../service/constants';
import {ApiService} from '../../service/apicalls/api.service';
import {BackupDate, User} from '../../interfaces/generalInterface';
import {HelperService} from '../../service/helper/helper.service';
import {Movie} from '../../interfaces/movieInterface';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    size_favourites = 0;
    size_history = 0;
    size_posters = 0;
    size_ratings = 0;
    account = {username: '', email: '', password: '', password1: ''};
    login = {username: '', password: ''};
    view_control = {login: false, register: false, buttons: true, loggedIn: false};
    backup_upload = <BackupDate>{history: '', rating: '', favourite: ''};
    backup_sync = <BackupDate>{history: '', rating: '', favourite: ''};
    @ViewChild('register_error_msg') register_error_msg;
    @ViewChild('login_error_msg') login_error_msg;
    private secureKey: Constants.AES_SECUREKEY;
    private secureIV: Constants.AES_SECUREIV;

    constructor(public storageService: StorageService, public alertController: AlertController, public apiService: ApiService,
                public toastController: ToastController, public helperService: HelperService) {

        this.storageService.getStorageEntries(Constants.MOVIE_FAVOURITE).then(data => {
            this.size_favourites = data.length;
        });
        this.storageService.getStorageEntries(Constants.MOVIE_RATING).then(data => {
            this.size_ratings = data.length;
        });
        this.storageService.getStorageEntries(Constants.MOVIE_POSTER).then(data => {
            this.size_posters = data.length;
        });
        this.storageService.getStorageEntries(Constants.MOVIE_HISTORY).then(data => {
            this.size_history = data.length;
        });

        if (this.helperService.isUserLoggedIn) {
            this.view_control = {login: false, register: false, buttons: false, loggedIn: true};
            this.setLastDates();
        }
    }


    ngOnInit() {
    }

    async presentConfirm(entity) {
        const alert = await this.alertController.create({
            header: 'Delete ' + entity,
            message: 'Are you sure to delete <strong>all</strong> entries?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                }, {
                    text: 'Delete',
                    handler: () => {
                        if (entity === 'favourites') {
                            this.storageService.initStorage(Constants.MOVIE_FAVOURITE);
                            this.size_favourites = 0;
                        }
                        if (entity === 'history') {
                            this.storageService.initStorage(Constants.MOVIE_HISTORY);
                            this.size_history = 0;
                        }
                        if (entity === 'posters') {
                            this.storageService.initStorage(Constants.MOVIE_POSTER);
                            this.size_posters = 0;
                        }
                        if (entity === 'ratings') {
                            this.storageService.initStorage(Constants.MOVIE_RATING);
                            this.size_ratings = 0;
                        }
                    }
                }
            ]
        });
        await alert.present();
    }

    sendRegistration() {
        const pattern_mail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        const pattern_user = /[^A-Za-z0-9]+/;
        let error_count = 0;
        let error_text = '';
        if (this.account.username.length < 3) {
            error_text += '- Username must contain at least 3 characters\n';
            error_count++;
        }
        else if (this.account.username.match(pattern_user) != null) {
            error_text += '- Only letters and numbers are allow for username \n';
            error_count++;
        }
        if (this.account.password.length < 5) {
            error_text += '- Password must contain at least 5 characters\n';
            error_count++;
        }
        else if (this.account.password != this.account.password1) {
            error_text += '- Password confirmation does not match \n';
            error_count++;
        }

        if (this.account.email.match(pattern_mail) == null) {
            error_text += '- Email address does not match \n';
            error_count++;
        }
        if (error_count > 0) {
            this.register_error_msg.nativeElement.innerText = error_text;
            return;
        } else {
            this.register_error_msg.nativeElement.innerText = '';
        }
        this.apiService.setUser(this.account).then(() => {
            this.displayToast('Account (' + this.account.username + ') registered! You can now login with your username and password.');
            this.open('register');
        }, error => {
            if (error.status == 410) {
                this.register_error_msg.nativeElement.innerText = '- Username already in use';
            }
            else {
                this.displayToast('Registration failed! Please try again.');
            }
        });
    }

    open(form) {
        if (form == 'login') {
            this.view_control.login = !this.view_control.login;
            this.login = {username: '', password: ''};
        }
        if (form == 'register') {
            this.view_control.register = !this.view_control.register;
            this.account = {username: '', email: '', password: '', password1: ''};
        }
        this.view_control.buttons = !this.view_control.buttons;
    }

    async displayToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            showCloseButton: true,
            position: 'bottom',
            closeButtonText: 'close',
            duration: 3000
        });
        toast.present();
    }

    checkLogin() {
        const pattern_user = /[^A-Za-z0-9]+/;
        if (this.login.username.match(pattern_user) != null) {
            this.login_error_msg.nativeElement.innerText = '- Invalid username \n';
            return;
        }
        if (this.login.username.length < 3) {
            this.login_error_msg.nativeElement.innerText = '- Invalid username \n';
            return;
        }
        if (this.login.password.length < 5) {
            this.login_error_msg.nativeElement.innerText = '- Invalid password \n';
            return;
        }

        this.apiService.getUserPassword(this.login.username, this.login.password).then(check => {
            if (check.status == 201) {
                this.apiService.getUser(this.login.username).then(user => {
                    const dataPreprocess = JSON.parse(user);
                    const dataJson = JSON.parse(dataPreprocess);
                    this.storageService.addUser(<User>{id: dataJson[0].id, email: dataJson[0].email, username: dataJson[0].username});
                    this.helperService.isUserLoggedIn = true;
                    this.helperService.username = dataJson[0].username;
                    this.view_control.login = !this.view_control.login;
                    this.view_control.loggedIn = !this.view_control.loggedIn;
                    this.setLastDates();
                    this.apiService.setUserUUID(this.login.username).then(data => {
                        console.log(data)
                        console.log("testst")
                    }, error => {
                        console.log(error)
                        console.log("testst")
                    })
                });
            }
        }, (check) => {
            if (check.status == 410) {
                this.login_error_msg.nativeElement.innerText = '- Wrong Password';
            } else if (check.status == 411) {
                this.login_error_msg.nativeElement.innerText = '- Username does not exist';
            } else {
                this.login_error_msg.nativeElement.innerText = '- Wrong Username or Password';
            }
        });
    }

    logout() {
        this.storageService.initUser();
        this.helperService.isUserLoggedIn = false;
        this.helperService.username = '';
        this.view_control.buttons = !this.view_control.buttons;
        this.view_control.loggedIn = !this.view_control.loggedIn;
    }

    async confirmLogout() {
        const alert = await this.alertController.create({
            header: 'LOGOUT',
            message: 'Are you sure to logout?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                }, {
                    text: 'Yes',
                    handler: () => {
                        this.logout();
                    }
                }
            ]
        });
        await alert.present();
    }

    async confirmSync(entity) {
        const alert = await this.alertController.create({
            header: 'SYNCHRONIZE',
            message: 'Are you sure to synchronize your data? You will permanently lose the currently stored data!',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                }, {
                    text: 'Yes',
                    handler: () => {
                        this.syncData(entity);
                    }
                }
            ]
        });
        await alert.present();
    }

    syncData(entity) {
        this.backup_sync[entity] = new Date().toISOString();
        this.storageService.addBackupSync(this.backup_sync);
        let storage = '';
        if (entity == 'rating') storage = Constants.MOVIE_RATING;
        if (entity == 'favourite') storage = Constants.MOVIE_FAVOURITE;
        if (entity == 'history') storage = Constants.MOVIE_HISTORY;

        this.storageService.getUser().then(user => {
            this.apiService.getBackup(user.id, entity).then(data => {
                if (data != undefined || data != null) {
                    const storeData = Array<Movie>();
                    const parseData1 = JSON.parse(data.data);
                    const parseData2 = JSON.parse(parseData1);
                    parseData2.forEach(item => {
                        storeData.push(item);
                    });
                    this.storageService.setFullData(storage, storeData).then(() => {
                            this.displayToast('SUCCESS: Data synchronized from Database');
                        }, () => {
                            this.displayToast('ERROR: Data not synchronized. Please try again');
                        }
                    );
                }
            });
        });
    }

    uploadData(entity) {
        let storage = '';
        let entry_index = 0;
        let entries = {ratingMovies: '', favouriteMovies: '', movie_history: ''};
        if (entity == 'rating') {
            storage = Constants.MOVIE_RATING;
            entry_index = 0;
        }

        if (entity == 'favourite') {
            storage = Constants.MOVIE_FAVOURITE;
            entry_index = 2;
        }
        if (entity == 'history') {
            storage = Constants.MOVIE_HISTORY;
            entry_index = 1;
        }

        this.storageService.getUser().then(user => {
            this.storageService.getStorageEntries(storage).then(data => {
                if (data != undefined || data != null) {
                    entries[storage] = JSON.stringify(data);
                    this.apiService.setBackup(entries.movie_history, entries.ratingMovies, entries.favouriteMovies, user.id).then(data => {
                            this.displayToast('SUCCESS: Data uploaded to Database');
                            this.apiService.getBackupLastDate(user.id).then(dates => {
                                let date_arr = dates.data.substring(1, dates.data.length - 2).split(',');
                                this.backup_upload[entity] = new Date(date_arr[entry_index]).toISOString();
                            });
                        },
                        () => {
                            this.displayToast('ERROR: Data not stored. Please try again');
                        });
                }
            });
        });
    }

    setLastDates() {
        this.storageService.getBackupSync().then(data => {
            if (data != null) {
                this.backup_sync = <BackupDate>{history: data.history, rating: data.rating, favourite: data.favourite};
            }
        });
        this.storageService.getUser().then(user => {
            this.apiService.getBackupLastDate(user.id).then(dates => {
                let date_arr = dates.data.substring(1, dates.data.length - 2).split(',');
                console.log(date_arr);
                if (date_arr[1] != 'None') this.backup_upload.history = new Date(date_arr[1]).toISOString();
                if (date_arr[2] != 'None') this.backup_upload.favourite = new Date(date_arr[2]).toISOString();
                if (date_arr[0] != 'None') this.backup_upload.rating = new Date(date_arr[0]).toISOString();
            });
        });
    }
}
