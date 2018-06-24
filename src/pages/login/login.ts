import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { GamePage } from '../game/game';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	avatar: string;
	userName: string;
	userSeted: boolean = false;
	difficulty: string = "easy";
	type: string = "multiple";
	platform: string;
	mode: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private nativeStorage: NativeStorage,
		private loadingCtrl: LoadingController,
		private plt: Platform,
		// public file: File
	) {
		this.userName = "";
		this.platform = (plt.is('android') || plt.is('ios') ? "phone" : "computer");
	}

	ionViewDidLoad() {
		if (this.platform == "phone") {
			const loader = this.loadingCtrl.create({
				content: "Please wait..."
			});

			loader
				.present()
				.then(() => {
					this
						.nativeStorage
						.getItem('myUser')
						.then(data => {
							loader.dismiss();
							this.userName = data.userName;
							this.userSeted = true;
						}, error => loader.dismiss());
				});
		} else {
			this.userName = "Player";
			this.userSeted = false;
		}
	}

	setUser(username) {
		console.log(this.platform);
		const loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		loader.present().then(() => {

			if (this.platform == "phone") {
				this.nativeStorage.setItem('myUser', { userName: username })
					.then(
						() => {
							loader.dismiss();
							this.userName = username;
							this.userSeted = true;
						},
						error => loader.dismiss()
					);
			}
			else {
				this.userName = username;
				this.userSeted = true;
				loader.dismiss();
			}
		});
	}

	logout() {
		if (this.platform == "phone") {
			this.nativeStorage.clear().then(() => {
				this.userSeted = false;
				this.userName = "";
			}).catch(() => { });
		}
		else {
			this.userSeted = false;
			this.userName = "";
		}
	}

	playGame(mode: string) {
		/*** Android file system ***/
		// const appPath = this.file.applicationDirectory;
		// const imgsPath = appPath + 'assets/imgs/';

		/*** Alerts 'imgs/ exists' on ***/
		// this
		// 	.file
		// 	.checkDir(imgsPath, 'imgs/')
		// 	.then(_ => alert('imgs/ exists'))
		// 	.catch(err => alert('imgs/ doesn\'t exist'));

		/*** Catches the error ... ***/
		// this
		// 	.file
		// 	.checkFile(imgsPath, 'logo.png')
		// 	.then(_ => alert('logo.png exists'))
		// 	.catch(err => alert('logo.png doesn\'t exist'));

		this.navCtrl.setRoot(GamePage, { difficulty: this.difficulty, type: this.type, userName: this.userName, mode });
	}

}
