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
    size_ratings = 0;
    account = {username: '', email: '', password: '', password1: ''};
    login = {username: '', password: ''};
    view_control = {login: false, register: false, buttons: true, loggedIn: false};
    backup_upload = <BackupDate>{history: '', rating: '', favourite: ''};
    backup_sync = <BackupDate>{history: '', rating: '', favourite: ''};
    @ViewChild('register_error_msg') register_error_msg;
    @ViewChild('login_error_msg') login_error_msg;

    constructor(public storageService: StorageService, public alertController: AlertController, public apiService: ApiService,
                public toastController: ToastController, public helperService: HelperService) {

        this.storageService.getStorageEntries(Constants.MOVIE_FAVOURITE).then(data => {
            this.size_favourites = Object.keys(data).length;
        });
        this.storageService.getStorageEntries(Constants.MOVIE_RATING).then(data => {
            this.size_ratings = Object.keys(data).length;
        });
        this.storageService.getStorageEntries(Constants.MOVIE_HISTORY).then(data => {
            this.size_history = Object.keys(data).length;
        });

        if (this.helperService.isUserLoggedIn) {
            this.view_control = {login: false, register: false, buttons: false, loggedIn: true};
            this.setLastDates();
        }
    }


    ngOnInit() {
    }

    //---------------------------------------------------------
    // User-Registration
    //---------------------------------------------------------
    createErrorMsg(msg) {
        return '- ' + msg + '\n';
    }

    sendRegistration() {
        const pattern_mail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        const pattern_user = /[^A-Za-z0-9]+/;
        let error_count = 0;
        let error_text = '';
        if (this.account.username.length < 3) {
            error_text += this.createErrorMsg(Constants.ERROR_USERNAME_LENGTH);
            error_count++;
        }
        else if (this.account.username.match(pattern_user) != null) {
            error_text += this.createErrorMsg(Constants.ERROR_USERNAME_CHARS);
            error_count++;
        }
        if (this.account.password.length < 5) {
            error_text += this.createErrorMsg(Constants.ERROR_PASSWORD_LENGTH);
            error_count++;
        }
        else if (this.account.password != this.account.password1) {
            error_text += this.createErrorMsg(Constants.ERROR_PASSWORD_CONFIRM);
            error_count++;
        }

        if (this.account.email.match(pattern_mail) == null) {
            error_text += this.createErrorMsg(Constants.ERROR_MAIL_PATTERN);
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
                this.register_error_msg.nativeElement.innerText = this.createErrorMsg(Constants.ERROR_USERNAME_USE);
            }
            else {
                this.displayToast('Registration failed! Please try again.');
            }
        });
    }

    //---------------------------------------------------------
    // User-Login / Logout
    //---------------------------------------------------------
    checkLogin() {
        const pattern_user = /[^A-Za-z0-9]+/;
        if (this.login.username.match(pattern_user) != null) {
            this.login_error_msg.nativeElement.innerText = this.createErrorMsg(Constants.ERROR_USERNAME_INVALID);
            return;
        }
        if (this.login.username.length < 3) {
            this.login_error_msg.nativeElement.innerText = this.createErrorMsg(Constants.ERROR_USERNAME_INVALID);
            return;
        }
        if (this.login.password.length < 5) {
            this.login_error_msg.nativeElement.innerText = this.createErrorMsg(Constants.ERROR_PASSWORD_INVALID);
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
                });
            }
        }, (check) => {
            if (check.status == 410) {
                this.login_error_msg.nativeElement.innerText = this.createErrorMsg(Constants.ERROR_PASSWORD_WRONG);
            } else if (check.status == 411) {
                this.login_error_msg.nativeElement.innerText = this.createErrorMsg(Constants.ERROR_USERNAME_EXIST);
            } else {
                this.login_error_msg.nativeElement.innerText = this.createErrorMsg(Constants.ERROR_PASSWORD_USERNAME);
            }
        });
    }

    logout() {
        this.storageService.initStorage(Constants.USER, null);
        this.helperService.isUserLoggedIn = false;
        this.helperService.username = '';
        this.view_control.buttons = !this.view_control.buttons;
        this.view_control.loggedIn = !this.view_control.loggedIn;
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

    //---------------------------------------------------------
    // Synchronize Data
    //---------------------------------------------------------
    syncData(entity) {
        let storage = '';
        if (entity == 'rating') storage = Constants.MOVIE_RATING;
        if (entity == 'favourite') storage = Constants.MOVIE_FAVOURITE;
        if (entity == 'history') storage = Constants.MOVIE_HISTORY;

        this.storageService.getUser().then(user => {
            this.apiService.getBackup(user.id, entity).then(data => {
                if (data != undefined || data != null) {
                    const parseData1 = JSON.parse(data.data);
                    const parseData2 = JSON.parse(parseData1);
                    if (entity == 'rating') this.helperService.ratings = new Map(Object.entries(parseData2));
                    if (entity == 'favourite') this.helperService.favourites = new Map(Object.entries(parseData2));
                    this.storageService.setFullData(storage, parseData2).then(() => {
                            this.displayToast('SUCCESS: Data synchronized from Database');
                            this.backup_sync[entity] = new Date().toISOString();
                            this.storageService.addBackupSync(this.backup_sync);
                            document.getElementById("title-"+entity).click();
                        }, () => {
                            this.displayToast('ERROR: Data not synchronized. Please try again');
                        }
                    );
                }
            });
        });
    }

    //---------------------------------------------------------
    // Upload Data to Database
    //---------------------------------------------------------
    uploadData(entity) {
        let storage = '';
        let entries = {ratingMovies: '', favouriteMovies: '', movie_history: ''};
        if (entity == 'rating') {
            storage = Constants.MOVIE_RATING;
        }
        if (entity == 'history') {
            storage = Constants.MOVIE_HISTORY;
        }
        if (entity == 'favourite') {
            storage = Constants.MOVIE_FAVOURITE;
        }
        this.storageService.getUser().then(user => {
            this.storageService.getStorageEntries(storage).then(data => {
                if (data != undefined || data != null) {
                    if (entity = 'history') {
                        let dataMap = new Map(Object.entries(data));
                        let dataArr = Array.from(dataMap);
                        let length = dataArr.length;
                        let resArr = [];
                        if (length > 30) {
                            for (let index = length - 1; index >= length - 30; index--) {
                                resArr.push(dataArr[index]);
                            }
                        } else {
                            resArr = dataArr;
                        }
                        const map_to_object = (map => {
                            const obj = {};
                            map.forEach((v, k) => {
                                obj[k] = v;
                            });
                            return obj;
                        });
                        entries[storage] = JSON.stringify(map_to_object(new Map(resArr)));
                    } else {
                        entries[storage] = JSON.stringify(data);
                    }
                    this.apiService.setBackup(entries.movie_history, entries.ratingMovies, entries.favouriteMovies, user.id).then(data => {
                            this.displayToast('SUCCESS: Data uploaded to Database');
                            this.setLastDates()
                        },
                        error => {
                            console.log(error);
                            this.displayToast('ERROR: Data not stored. Please try again');
                        });
                }
            });
        });
    }

    //---------------------------------------------------------
    // PopUps
    //---------------------------------------------------------
    async confirmDeleteStorage(entity) {
        const alert = await this.alertController.create({
            header: entity != 'full' ?
                'Delete ' + entity:
                'Reset Storage',
            message: entity != 'full' ?
                'Are you sure to delete <strong>all</strong> entries? You can not undo this anymore':
                'Are you sure to delete the <strong>complete storage</strong>? After that, a restart of the app is required.' +
                'Otherwise the app won\'t work anymore! ',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                }, {
                    text: 'Delete',
                    handler: () => {
                        if (entity === 'favourites') {
                            this.storageService.initFavourites();
                            this.helperService.favourites = new Map<string, Movie>();
                            this.size_favourites = 0;
                        }
                        if (entity === 'history') {
                            this.storageService.initHistory();
                            this.size_history = 0;
                        }
                        if (entity === 'ratings') {
                            this.storageService.initRating();
                            this.helperService.ratings = new Map<string, Movie>();
                            this.size_ratings = 0;
                        }
                        if (entity === 'full') {
                            this.storageService.clearFull();
                            document.location.href = 'index.html';
                        }
                    }
                }
            ]
        });
        await alert.present();
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

    setLastDates() {
        this.storageService.getBackupSync().then(data => {
            if (data != null) {
                this.backup_sync = <BackupDate>{history: data.history, rating: data.rating, favourite: data.favourite};
            }
        });
        this.storageService.getUser().then(user => {
            this.apiService.getBackupLastDate(user.id).then(dates => {
                    let date_arr = dates.data.substring(1, dates.data.length - 2).split(',');
                    if (date_arr[1] == 'None' || date_arr[1] == undefined || date_arr[1] == '' || date_arr[1] == null)
                        this.backup_upload.history = '';
                    else
                        this.backup_upload.history = new Date(date_arr[1]).toISOString();

                    if (date_arr[2] == 'None' || date_arr[2] == undefined || date_arr[2] == '' || date_arr[2] == null)
                        this.backup_upload.favourite = '';
                    else
                        this.backup_upload.favourite = new Date(date_arr[2]).toISOString();

                    if (date_arr[0] == 'None' || date_arr[0] == undefined || date_arr[0] == '' || date_arr[0] == null)
                        this.backup_upload.rating = '';
                    else
                        this.backup_upload.rating = new Date(date_arr[0]).toISOString();
                },
                () => {
                    this.backup_upload = <BackupDate>{history: '', rating: '', favourite: ''};
                });
        });
    }
}
