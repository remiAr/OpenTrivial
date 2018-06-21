import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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

	constructor(public navCtrl: NavController, public navParams: NavParams, private nativeStorage: NativeStorage, private loadingCtrl: LoadingController) {
		this.userName = "";
	}

	ionViewDidLoad() {
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

	setUser(username) {
		const loader = this.loadingCtrl.create({
			content: "Please wait..."
		});
		loader.present().then(() => {
			
			this.nativeStorage.setItem('myUser', { userName: username })
				.then(
					() =>  {
						loader.dismiss();
						this.userName = username;
						this.userSeted = true;
					},
					error => loader.dismiss()
				);
		});
	}

	deconnexion(){
		this.nativeStorage.clear().then(()=> {
		 	this.userSeted = false;
			this.userName = "";
		}).catch(()=>{});
	}

	playGame(){
		this.navCtrl.setRoot(GamePage, {difficulty: this.difficulty, userName: this.userName});
	}


}
