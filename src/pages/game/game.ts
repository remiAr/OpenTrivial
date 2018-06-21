import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';

/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-game',
    templateUrl: 'game.html',
})
export class GamePage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GamePage');
        this.loadQuestions();
    }

    loadQuestions() {
        console.log(
            this
                .restProvider
                .getQuestions()
        );
    }
}
