import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { GamePage } from '../game/game';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	avatar: string;
	userName: string;
	userSeted: boolean = false;
	difficulty: string = "medium";
	type: string = "multiple";
	platform: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private nativeStorage: NativeStorage,
		private loadingCtrl: LoadingController,
		private plt: Platform
	) {
		this.userName = "";
		this.platform = (plt.is('android') || plt.is('ios') ? "phone" : "computer");
	}

	ionViewDidLoad() {
		if (this.platform == "phone") {
			const loader = this.loadingCtrl.create({
				content: "Please wait..."
			});
			loader.present().then(() => {
				this.nativeStorage.getItem('myUser')
					.then(
						data => {
							loader.dismiss();
							this.userName = data.userName;
							this.userSeted = true;
						},
						error => loader.dismiss()
					);
			});
		}
		else {
			this.userName = "";
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

	deconnexion() {
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

	playGame() {
		this.navCtrl.setRoot(GamePage, { difficulty: this.difficulty, type: this.type, userName: this.userName });
	}


}
