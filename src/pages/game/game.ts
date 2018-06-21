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
    public answers;
    public counter: number = 0;
    public difficulty: string;
    public correctAnswer: boolean = false;
    public userHasClicked: boolean = false;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {
        this.questions = [];
        this.question = {};
        this.answers = [];
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
        console.log('QU: ', this.questions);
        this.question = this.questions[this.counter];

        this.question.category = atob(this.question.category);
        this.question.question = atob(this.question.question);
        console.log('QU: ', this.questions);

        this.shuffleFisherYates();
    }

    shuffleFisherYates() {
        const array = [];

        array.push(atob(this.question.correct_answer));
        this.question.incorrect_answers.forEach(answer => { array.push(atob(answer)) });

        let m = array.length, t, i;

        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        this.answers = array;
    }

    checkAnswer(event, answer) {
        if (this.userHasClicked === false) {
            this.userHasClicked = true;

            if (answer === atob(this.question.correct_answer)) {
                event.target.style.backgroundColor = 'green';
            } else {
                event.target.style.backgroundColor = 'red';            
            }
        }
    }

    nextQuestion() {
        this.counter++;
    }

}
