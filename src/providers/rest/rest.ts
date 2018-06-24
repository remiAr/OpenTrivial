import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class RestProvider {

    constructor(public http: HttpClient) {

    }

    getQuestions(difficulty, type) {
        return new Promise(resolve => {
            this
                .http
                .get('https://opentdb.com/api.php?amount=20&difficulty='+difficulty+'&type='+type+'&encode=base64')
                .subscribe(data => {
                    resolve(data);
                });
        });
    }

    getLeaderBoard(){
        return new Promise(resolve => {
            this
                .http
                .get('https://leaderboard.lp1.eu/api/json')
                .subscribe(data => {
                    resolve(data);
                });
        });
    }
    setScoreUser(user){
        return new Promise(resolve => {
            this
                .http
                .post('https://leaderboard.lp1.eu/api/score', user)
                .subscribe(data => {
                    resolve(data);
                });
        });
    }

}
