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

    public questions;
    public question;
    public counter: number = 0;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {
        this.questions = [];
        this.question = { category: '' };
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GamePage');
        this.loadQuestions();
    }

    loadQuestions() {
        this
            .restProvider
            .getQuestions()
            .then(data =>{
                this.questions = data;
                this.questions = this.questions.results;
                this.loadQuestion();
            })
            .catch(error => {
                console.error(error);
            })
    }

    loadQuestion() {
        this.question = this.questions[this.counter];
    }

    nextQuestion() {
        this.counter++;
    }

}
