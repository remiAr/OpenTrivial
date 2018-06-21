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
    public difficulty: string;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {
        this.questions = [];
        this.question = {};
        this.difficulty = this.navParams.get('difficulty');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GamePage');
        this.loadQuestions(this.difficulty);
    }

    loadQuestions(difficulty) {
        this
            .restProvider
            .getQuestions(difficulty)
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
