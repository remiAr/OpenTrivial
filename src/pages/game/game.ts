import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { LeaderBoardPage } from '../leader-board/leader-board';
import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
    selector: 'page-game',
    templateUrl: 'game.html',
})
export class GamePage {

    public questions;
    public question;
    public answers;
    public color: string;
    public counter: number = 0;
    public difficulty: string;
    public type: string;
    public correctAnswer: boolean = false;
    public userHasClicked: boolean = false;
    public arrayPoints = {};
    public score: number = 0;
    public time: number = 0;
    public userName: string;
    public mode: string;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public restProvider: RestProvider,
        private network: Network,
        public loadingCtrl: LoadingController,
    ) {
        this.questions = [];
        this.question = {};
        this.answers = [];
        this.color = 'primary';
        this.difficulty = this.navParams.get('difficulty');
        this.type = this.navParams.get('type');
        this.mode = this.navParams.get('mode');
        this.userName = navParams.get('userName');
        this.arrayPoints = {
            "easy": 5,
            "medium": 10,
            "hard": 20
        };
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad GamePage');

        if (this.mode === 'online') {
            this.loadQuestionsFromAPI(this.difficulty, this.type);
        } else {
            this.loadQuestionsFromFile();
        }

        this.timer()
    }

    loadQuestionsFromAPI(difficulty, type) {
        this
            .restProvider
            .getQuestions(difficulty, type)
            .then(data => {
                this.questions = data;
                this.questions = this.questions.results;

                this.loadQuestion();
            })
            .catch(error => {
                console.error(error);
            })
    }

    loadQuestionsFromFile() {}

    loadQuestion() {
        this.question = this.questions[this.counter];
        this.question.category = atob(this.question.category);
        this.question.question = atob(this.question.question);

        if (this.type !== 'boolean') {
            let answers = [];

            answers.push(atob(this.question.correct_answer));
            this.question.incorrect_answers.forEach(answer => { answers.push(atob(answer)) });

            this.answers = this.shuffleFisherYates(answers);
        } else {
            this.answers = ['True', 'False'];
        }
    }

    shuffleFisherYates(array) {
        let m = array.length, t, i;

        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }

    checkAnswer(event, answer, i) {
        if (this.userHasClicked === false) {
            this.userHasClicked = true;

            if (answer === atob(this.question.correct_answer)) {
                document.getElementById('button_' + i).style.backgroundColor = "#32db64";
                this.score = this.score + this.arrayPoints[this.difficulty];
            } else {
                document.getElementById('button_' + i).style.backgroundColor = "#f53d3d";
                this.score = this.score - this.arrayPoints[this.difficulty];
            }

            setTimeout(() => {
                this.nextQuestion();
            }, 1000);
        }
    }

    nextQuestion() {
        this.resetButtonsColors(this.answers.length);

        if (this.counter == 19) {
            if (this.network.type == "none") {
                const loader = this.loadingCtrl.create({
                    content: "Please wait..."
                });
                loader.present().then(() => {
                    this.network.onchange().subscribe(() => {
                        if (this.network.type != "none") {
                            loader.dismiss();
                            const user = {
                                nickname: this.userName,
                                score: this.score,
                                time: this.time,
                                avatar_url: "https://api.adorable.io/avatars/285/" + this.userName + ".png",
                            };
                            this.restProvider.setScoreUser(user).then(() => {
                                this.navCtrl.setRoot(LeaderBoardPage, { score: this.score, time: this.time });
                            });
                        }
                    });
                });
            }
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

    resetButtonsColors(answersLength: number) {
        if (answersLength > 0) {
            for (let i = 0; i < answersLength; i++) {
                document.getElementById('button_' + i).style.backgroundColor = "#488aff";
            }
        }
    }

}
