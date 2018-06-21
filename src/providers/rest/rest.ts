import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

    constructor(public http: HttpClient) {

    }

    getQuestions() {
        return new Promise(resolve => {
            this
                .http
                .get('https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple')
                .subscribe(data => {
                    console.log('test');
                    console.log('data: ', data);
                });
        });
        console.log('test');
    }

}
