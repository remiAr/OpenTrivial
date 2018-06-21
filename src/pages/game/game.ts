import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { LeaderBoardPage } from '../leader-board/leader-board';

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
    public arrayPoints = {};
    public score: number = 0;
    public time: number = 0;
    public userName: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, public restProvider: RestProvider) {
        this.questions = [];
        this.question = {};
        this.answers = [];
        this.difficulty = this.navParams.get('difficulty');
        this.userName = navParams.get('userName');
        this.arrayPoints = {
            "easy": 5,
            "medium": 10,
            "hard": 20
        };
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GamePage');
        this.loadQuestions(this.difficulty);
        this.timer()
    }

    loadQuestions(difficulty) {
        this
            .restProvider
            .getQuestions(difficulty)
            .then(data => {
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

        this.question.category = atob(this.question.category);
        this.question.question = atob(this.question.question);

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
                this.score = this.score + this.arrayPoints[this.difficulty]
            } else {
                event.target.style.backgroundColor = 'red';
                this.score = this.score - this.arrayPoints[this.difficulty]
            }

            setTimeout(() => {
                this.nextQuestion();
            }, 500);
        }
    }

    nextQuestion() {

        if (this.counter == 19) {
            const user = {
                nickname: this.userName,
                score: this.score,
                time: this.time,
                avatar_url: "https://api.adorable.io/avatars/285/"+this.userName+".png",
            };
            this.restProvider.setScoreUser(user).then(()=>{
                this.navCtrl.setRoot(LeaderBoardPage, {score: this.score, time: this.time});
            });
            
        } else {
            this.userHasClicked = false;
            this.counter++;
            this.loadQuestion();
        }

    }

    timer() {
        var timer = () => {
            setTimeout(() => {
                this.time += 1;
                if (this.counter < 20) {
                    timer();
                }
            }, 1000);
        }
        timer();
    }

}
